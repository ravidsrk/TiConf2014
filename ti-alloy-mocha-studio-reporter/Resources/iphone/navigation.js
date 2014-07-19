function Navigation(_args) {
    var that = this;
    _args = _args || {};
    this.isBusy = false;
    this.controllers = [];
    this.currentController = null;
    this.parent = _args.parent;
    this.open = function(_controller, _controllerArguments) {
        if (that.isBusy) return;
        that.isBusy = true;
        var controller = Alloy.createController(_controller, _controllerArguments);
        that.currentController && that.animateOut(that.currentController, "left");
        that.controllers.push(controller);
        that.currentController = controller;
        that.parent.add(that.currentController.getView());
        if (that.currentController.open) {
            that.currentController.open();
            that.isBusy = false;
        } else that.animateIn(this.currentController, "right");
        return that.currentController;
    };
    this.close = function(_callback) {
        if (that.isBusy) return;
        that.isBusy = true;
        var outgoingController = that.currentController;
        var incomingController = that.controllers[that.controllers.length - 2];
        if (incomingController) {
            that.parent.add(incomingController.getView());
            if (incomingController.open) {
                incomingController.open();
                that.isBusy = false;
            } else that.animateIn(incomingController, "left");
        }
        that.animateOut(outgoingController, "right", function() {
            that.controllers.pop();
            outgoingController = null;
            that.currentController = that.controllers[that.controllers.length - 1];
            _callback && _callback();
        });
    };
    this.closeToHome = function(_callback) {
        if (that.isBusy || 1 == that.controllers.length) return;
        that.isBusy = true;
        var outgoingController = that.currentController;
        var incomingController = that.controllers[0];
        if (incomingController) {
            that.parent.add(incomingController.getView());
            if (incomingController.open) {
                incomingController.open();
                that.isBusy = false;
            } else that.animateIn(incomingController, "left");
        }
        that.animateDisappear(outgoingController, function() {
            that.controllers.splice(1, that.controllers.length - 1);
            outgoingController = null;
            that.currentController = that.controllers[0];
            _callback && _callback();
        });
    };
    this.closeAll = function() {
        for (var i = 0, x = that.controllers.length; x > i; i++) that.parent.remove(that.controllers[i].getView());
        that.controllers = [];
        that.currentController = null;
        that.isBusy = false;
    };
    this.animateDisappear = function(_controller, _callback) {
        var animation = Ti.UI.createAnimation({
            transform: Ti.UI.create2DMatrix({
                scale: 0
            }),
            opacity: 0,
            curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
            duration: 300
        });
        animation.addEventListener("complete", function onComplete() {
            for (var i = 0, x = that.controllers.length; i > 1 && x > i; i++) that.parent.remove(that.controllers[i].getView());
            that.isBusy = false;
            _callback && _callback();
            animation.removeEventListener("complete", onComplete);
        });
        _controller.getView().animate(animation);
    };
    this.animateIn = function(_controller, _direction, _callback) {
        var animation = Ti.UI.createAnimation({
            opacity: 1,
            duration: 300
        });
        animation.addEventListener("complete", function onComplete() {
            that.isBusy = false;
            _callback && _callback();
            animation.removeEventListener("complete", onComplete);
        });
        Ti.API.trace(that.parent.size.width);
        _controller.getView().left = "left" === _direction ? -that.parent.size.width : that.parent.size.width;
        animation.left = 0;
        _controller.getView().animate(animation);
    };
    this.animateOut = function(_controller, _direction, _callback) {
        var animation = Ti.UI.createAnimation({
            opacity: 0,
            duration: 300
        });
        animation.addEventListener("complete", function onComplete() {
            that.parent.remove(_controller.getView());
            that.isBusy = false;
            _callback && _callback();
            animation.removeEventListener("complete", onComplete);
        });
        animation.left = "left" === _direction ? -that.parent.size.width : that.parent.size.width;
        _controller.getView().animate(animation);
    };
    this.testOutput = function() {
        var stack = [];
        for (var i = 0, x = that.controllers.length; x > i; i++) that.controllers[i].getView().controller && stack.push(that.controllers[i].getView().controller);
        Ti.API.debug("Stack Length: " + that.controllers.length);
        Ti.API.debug(JSON.stringify(stack));
    };
}

module.exports = function(_args) {
    return new Navigation(_args);
};
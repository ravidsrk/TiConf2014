function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "screen";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.wrapper = Ti.UI.createView({
        width: "100%",
        height: "100%",
        opacity: 0,
        id: "wrapper"
    });
    $.__views.wrapper && $.addTopLevelView($.__views.wrapper);
    $.__views.label = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: 200,
        id: "label"
    });
    $.__views.wrapper.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var App = require("core");
    $.params = arguments[0] || {};
    $.wrapper.backgroundColor = $.params.backgroundColor || "white";
    $.label.text = $.params.text || "Unnamed Screen";
    $.wrapper.addEventListener("click", function() {
        var colors = [ "red", "green", "white", "navy" ];
        App.Navigator.open("screen", {
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            text: "Sub Screen"
        });
    });
    $.wrapper.addEventListener("swipe", function(_event) {
        "right" === _event.direction && App.Navigator.close();
    });
    $.wrapper.addEventListener("pinch", function(_event) {
        .6 > _event.scale && App.Navigator.closeToHome();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;
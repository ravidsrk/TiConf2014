var Alloy = require("alloy");

var App = {
    Device: {
        version: Ti.Platform.version,
        versionMajor: parseInt(Ti.Platform.version.split(".")[0], 10),
        versionMinor: parseInt(Ti.Platform.version.split(".")[1], 10),
        width: null,
        height: null,
        dpi: Ti.Platform.displayCaps.dpi,
        orientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? "landscape" : "portrait"
    },
    Navigator: {},
    globalWindow: {},
    init: function() {
        Ti.Network.addEventListener("change", App.networkChange);
        Ti.App.addEventListener("pause", App.exit);
        Ti.App.addEventListener("close", App.exit);
        Ti.App.addEventListener("resumed", App.resume);
        Ti.Gesture.addEventListener("orientationchange", App.orientationChange);
        App.Navigator = require("navigation")({
            parent: App.globalWindow
        });
        App.getDeviceDimensions();
    },
    bindOrientationEvents: function(_controller) {
        _controller.window.addEventListener("close", function() {
            _controller.handleOrientation && Ti.App.removeEventListener("orientationChange", _controller.handleOrientation);
        });
        _controller.window.addEventListener("open", function() {
            Ti.App.addEventListener("orientationChange", function(_event) {
                _controller.handleOrientation && _controller.handleOrientation(_event);
                App.setViewsForOrientation(_controller);
            });
        });
    },
    setViewsForOrientation: function(_controller) {
        if (!App.Device.orientation) return;
        if ("portrait" == App.Device.orientation || "landscape" == App.Device.orientation) for (var view in _controller.__views) _controller.__views[view][App.Device.orientation] && "function" == typeof _controller.__views[view].applyProperties ? _controller.__views[view].applyProperties(_controller.__views[view][App.Device.orientation]) : _controller.__views[view].wrapper && _controller.__views[view].wrapper[App.Device.orientation] && "function" == typeof _controller.__views[view].applyProperties && _controller.__views[view].applyProperties(_controller.__views[view].wrapper[App.Device.orientation]);
    },
    networkChange: function() {},
    exit: function() {},
    resume: function() {},
    orientationChange: function(_event) {
        if (_event.orientation === Titanium.UI.FACE_UP || _event.orientation === Titanium.UI.FACE_DOWN || _event.orientation === Titanium.UI.UNKNOWN) return;
        App.Device.orientation = _event.source.isLandscape() ? "landscape" : "portrait";
        Ti.App.fireEvent("orientationChange", {
            orientation: App.Device.orientation
        });
    },
    getDeviceDimensions: function() {
        switch (App.Device.orientation) {
          case "portrait":
            App.Device.width = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth;
            App.Device.height = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight;
            break;

          case "landscape":
            App.Device.width = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight;
            App.Device.height = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth;
        }
        return {
            width: App.Device.width,
            height: App.Device.height
        };
    }
};

module.exports = App;
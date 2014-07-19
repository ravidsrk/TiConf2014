var App = require("core");

require("tests/ti.mocha");

mocha.setup({
    reporter: "ti-spec-studio"
});

describe("navigation.js", function() {
    it("open(); Opens a controller via a string", function() {
        var window = Ti.UI.createWindow({
            backgroundColor: "#eee"
        });
        window.open();
        var navigator = require("navigation")({
            parent: window
        });
        navigator.open("screen");
        if (1 > navigator.controllers.length) throw new Error();
    });
    it("close(); Closes a controller", function(done) {
        var window = Ti.UI.createWindow({
            backgroundColor: "#eee"
        });
        window.open();
        var navigator = require("navigation")({
            parent: window
        });
        navigator.open("screen");
        var interval = setInterval(function() {
            if (!navigator.isBusy) {
                navigator.close(function() {
                    if (navigator.controllers.length > 0) throw new Error();
                    done();
                });
                clearInterval(interval);
            }
        }, 100);
    });
    it("closeToHome(); Closes all but first controller", function(done) {
        var window = Ti.UI.createWindow({
            backgroundColor: "#eee"
        });
        window.open();
        var navigator = require("navigation")({
            parent: window
        });
        navigator.open("screen");
        navigator.open("screen");
        var interval = setInterval(function() {
            if (!navigator.isBusy) {
                navigator.closeToHome(function() {
                    if (1 !== navigator.controllers.length) throw new Error();
                    done();
                });
                clearInterval(interval);
            }
        }, 100);
    });
    it("closeAll(); Closes all controllers", function() {
        var window = Ti.UI.createWindow({
            backgroundColor: "#eee"
        });
        window.open();
        var navigator = require("navigation")({
            parent: window
        });
        navigator.open("screen");
        navigator.open("screen");
        navigator.open("screen");
        navigator.open("screen");
        navigator.closeAll();
        if (navigator.controllers.length > 0) throw new Error();
    });
});

mocha.run();
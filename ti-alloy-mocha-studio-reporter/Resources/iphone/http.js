exports.request = function(_params) {
    Ti.API.debug("HTTP.request " + _params.url);
    if (Ti.Network.online) {
        var xhr = Ti.Network.createHTTPClient();
        xhr.timeout = _params.timeout ? _params.timeout : 1e4;
        xhr.onload = function(_data) {
            if (_data) {
                switch (_params.format.toLowerCase()) {
                  case "data":
                  case "xml":
                    _data = this.responseData;
                    break;

                  case "json":
                    _data = JSON.parse(this.responseText);
                    break;

                  case "text":
                    _data = this.responseText;
                }
                if (!_params.success) return _data;
                _params.passthrough ? _params.success(_data, _params.url, _params.passthrough) : _params.success(_data, _params.url);
            }
        };
        _params.ondatastream && (xhr.ondatastream = function(_event) {
            _params.ondatastream && _params.ondatastream(_event.progress);
        });
        xhr.onerror = function(_event) {
            _params.failure ? _params.passthrough ? _params.failure(this, _params.url, _params.passthrough) : _params.failure(this, _params.url) : Ti.API.error(JSON.stringify(this));
            Ti.API.error(_event);
        };
        _params.type = _params.type ? _params.type : "GET";
        _params.async = _params.async ? _params.async : true;
        xhr.open(_params.type, _params.url, _params.async);
        if (_params.headers) for (var i = 0, j = _params.headers.length; j > i; i++) xhr.setRequestHeader(_params.headers[i].name, _params.headers[i].value);
        xhr.setRequestHeader("User-Agent", "Appcelerator Titanium/" + Ti.version + " (" + Ti.Platform.osname + "/" + Ti.Platform.version + "; " + "iPhone OS" + "; " + Ti.Locale.currentLocale + ";)");
        _params.data ? xhr.send(JSON.stringify(_params.data)) : xhr.send();
    } else {
        Ti.API.error("No internet connection");
        _params.failure && (_params.passthrough ? _params.failure(null, _params.url, _params.passthrough) : _params.failure(null, _params.url));
    }
};
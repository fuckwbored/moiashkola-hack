function Save(data, action, successFunc, errorFunc) {
    var json = JSON.stringify(data);

    $.ajax({
        url: action,
        type: 'POST',
        dataType: 'json',
        data: json,
        contentType: 'application/json; charset=utf-8',
        success: successFunc,
        error: errorFunc
    })
}

function getContent(url, callback) {
    var request = new Sys.Net.WebRequest();
    request.set_url(url);
    request.set_httpVerb("GET");
    var del = Function.createCallback(getContentResults, callback);
    request.add_completed(del);
    request.invoke();
}

function getContentResults(executor, eventArgs, callback) {
    if (executor.get_responseAvailable()) {
        callback(eval(executor.get_responseData()));
    } else {
        if (executor.get_timedOut())
            alert("TIMEOUT");
        else if (executor.get_aborted())
            alert("ABORT");
    }
}

function bindOptions(controlChild, controlParent, url, callback) {
    controlChild.options.length = 0;

    var makeId = controlParent.value;

    if (makeId) {
        getContent(url + makeId, callback);
    }
}

function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');

    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');

    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');

    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function updateQueryStringParam(key, value) {
    var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
        urlQueryString = document.location.search,
        newParam = key + '=' + value,
        params = '?' + newParam;

    if (urlQueryString) {
        var updateRegex = new RegExp('([\?&])' + key + '[^&]*');
        var removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

        if (typeof value == 'undefined' || value == null || value == '') {
            params = urlQueryString.replace(removeRegex, "$1");
            params = params.replace(/[&;]$/, "");
        } else if (urlQueryString.match(updateRegex) !== null) {
            params = urlQueryString.replace(updateRegex, "$1" + newParam);
        } else {
            params = urlQueryString + '&' + newParam;
        }
    }

    params = params == '?' ? '' : params;

    window.history.replaceState({}, "", baseUrl + params);
}

function windowOpen(url, name, specs) {
    if (!url.match(/^https?:\/\//i)) {
        url = 'http://' + url;
    }

    return window.open(url, name, specs);
}
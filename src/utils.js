﻿/// <reference path="namespace.js" />
/// <reference path="constants.js" />
/// <reference path="../lib/knockout-2.2.0.js" />
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }
        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp */) {
        "use strict";
        var t = Object(this),
            len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw new TypeError();
        }
        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}
window.kg.utils = {
    visualLength: function(node) {
        var elem = document.getElementById('testDataLength');
        if (!elem) {
            elem = document.createElement('SPAN');
            elem.id = "testDataLength";
            elem.style.visibility = "hidden";
            document.body.appendChild(elem);
        }
        $(elem).css('font', $(node).css('font'));
        elem.innerHTML = $(node).text();
        return elem.offsetWidth;
    },
    forIn: function(obj, action) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                action(obj[prop], prop);
            }
        }
    },
    evalProperty: function(entity, path) {
        var e = ko.utils.unwrapObservable(entity);
        var propPath = path.split('.'), i = 0;
        var tempProp = ko.utils.unwrapObservable(e[propPath[i]]), links = propPath.length;
        i++;
        while (tempProp && i < links) {
            tempProp = ko.utils.unwrapObservable(tempProp[propPath[i]]);
            i++;
        }
        return tempProp;
    },
    endsWith: function(str, suffix) {
        if (!str || !suffix || typeof str != "string") {
            return false;
        }
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    isNullOrUndefined: function(obj) {
        if (obj === undefined || obj === null) {
            return true;
        }
        return false;
    },
    getElementsByClassName: function(cl) {
        var retnode = [];
        var myclass = new RegExp('\\b' + cl + '\\b');
        var elem = document.getElementsByTagName('*');
        for (var i = 0; i < elem.length; i++) {
            var classes = elem[i].className;
            if (myclass.test(classes)) {
                retnode.push(elem[i]);
            }
        }
        return retnode;
    },
    getTemplatePromise: function(path) {
        return $.ajax(path);
    },
    newId: (function() {
        var seedId = new Date().getTime();
        return function() {
            return seedId += 1;
        };
    })(),
    
    // we copy KO's ie detection here bc it isn't exported in the min versions of KO
    // Detect IE versions for workarounds (uses IE conditionals, not UA string, for robustness) 
    ieVersion: (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');
        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
        iElems[0]) ;
        return version > 4 ? version : undefined;
    })()
};

$.extend(window.kg.utils, {
    isIe6: (function() {
        return window.kg.utils.ieVersion === 6;
    })(),
    isIe7: (function() {
        return window.kg.utils.ieVersion === 7;
    })(),
    isIe: (function() {
        return window.kg.utils.ieVersion !== undefined;
    })()
});
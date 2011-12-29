// Punchout JavaScript library v1.0
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="knockout-latest.debug.js" />
(function () {
    es = {};

    // Google Closure Compiler helpers (used only to make the minified file smaller)
    es.exportSymbol = function (publicPath, object) {
        var tokens = publicPath.split(".");
        var target = window;
        for (var i = 0; i < tokens.length - 1; i++) {
            target = target[tokens[i]];
        }
        target[tokens[tokens.length - 1]] = object;
    };

    es.exportProperty = function (owner, publicName, object) {
        owner[publicName] = object;
    };

    //---------------------------------------------------
    // Private helper functions
    //---------------------------------------------------
    es.RowStateEnum = {
        invalid: 0,
        unchanged: 2,
        added: 4,
        deleted: 8,
        modified: 16
    };

    function isArray(o) {
        return o.push && o.pop;
    }

    function injectProperties(entity) {

        if (!entity.hasOwnProperty("RowState")) {
            entity.RowState = ko.observable(es.RowStateEnum.added);
            if (entity.hasOwnProperty("__ko_mapping__")) {
                entity.__ko_mapping__.mappedProperties["RowState"] = true;
            }
        }

        if (!entity.hasOwnProperty("ModifiedColumns")) {
            entity.ModifiedColumns = ko.observableArray();
            if (entity.hasOwnProperty("__ko_mapping__")) {
                entity.__ko_mapping__.mappedProperties["ModifiedColumns"] = true;
            }
        }

        for (var propertyName in entity) {
            if (propertyName !== "RowState") {
                addPropertyChanged(entity, propertyName);
            }
        }
    }


    function addPropertyChanged(obj, propertyName) {
        var property = obj[propertyName];
        if (ko.isObservable(property) && !isArray(property)) {

            // This is the actual PropertyChanged event
            property.subscribe(function () {
                if (ko.utils.arrayIndexOf(obj.ModifiedColumns(), propertyName) === -1) {

                    if (propertyName !== "RowState") {
                        obj.ModifiedColumns.push(propertyName);

                        if (obj.RowState() !== es.RowStateEnum.modified && obj.RowState() !== es.RowStateEnum.added) {
                            obj.RowState(es.RowStateEnum.modified);
                        }
                    }
                }
            });
        }
    }

    //---------------------------------------------------
    // Public functions
    //---------------------------------------------------
    es.trackState = function (entity) {

        if (isArray(entity)) {
            var array;

            if (ko.isObservable(entity)) {
                array = ko.utils.unwrapObservable(entity);
            } else {
                array = entity;
            }

            ko.utils.arrayForEach(array, function (e) {
                es.trackState(e);
            });

        }

        injectProperties(entity);

        return entity;
    }

    es.markAsDeleted = function (entity) {

        if (!entity.hasOwnProperty("RowState")) {
            entity.RowState = ko.observable(es.RowStateEnum.deleted);
        } else if (entity.RowState() != es.RowStateEnum.deleted) {
            entity.RowState(es.RowStateEnum.deleted);
        }

        if (entity.hasOwnProperty("ModifiedColumns")) {
            entity.ModifiedColumns.removeAll();
        }
    }

    es.markAllAsDeleted = function (collection) {

        for (var i = 0; i < collection().length; i++) {
            var entity = collection()[i];
            es.markAsDeleted(entity);
        }
    }

    es.getDirtyEntities = function (collection) {
        var modifiedRecords = new Array();
        var index = 0;
        ko.utils.arrayFirst(collection(), function (entity) {
            if (entity.RowState() !== es.RowStateEnum.unchanged) {
                modifiedRecords[index++] = entity;
            }
        });

        if (modifiedRecords.length === 0) return null;

        return modifiedRecords;
    };

    es.trackStateMapping = {
        '': {
            create: function (options) {
                var obj = ko.mapping.fromJS(options.data);
                return es.trackState(obj);
            }
        }
    }

    es.makeRequstError = null;

    es.makeRequest = function (url, methodName, params) {
        var theData = null;
        es.getDataError = null;

        // Create HTTP request
        var xmlHttp;
        try {
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    alert("This sample only works in browsers with AJAX support");
                    return false;
                }
            }
        }

        // Build the operation URL
        var path = url + methodName;

        // Make the HTTP request
        xmlHttp.open("POST", path, false);
        xmlHttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
        xmlHttp.send(params);

        if (xmlHttp.status == 200) {
            if (xmlHttp.responseText !== '{}' && xmlHttp.responseText !== "") {
                theData = JSON.parse(xmlHttp.responseText);
            }
        } else {
            es.makeRequstError = xmlHttp.responseText;
        }

        return theData;
    };

    //---------------------------------------------------
    // Exported functions
    //---------------------------------------------------
    es.exportSymbol('es.makeRequest', es.makeRequest);
    es.exportSymbol('es.makeRequstError', es.makeRequstError);
    es.exportSymbol('es.trackStateMapping', es.trackStateMapping)
    es.exportSymbol('es.trackState', es.trackState);
    es.exportSymbol('es.markAsDeleted', es.markAsDeleted);
    es.exportSymbol('es.markAllAsDeleted', es.markAllAsDeleted);
    es.exportSymbol('es.RowStateEnum', es.RowStateEnum);
})();
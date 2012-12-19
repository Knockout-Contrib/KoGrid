/// <reference path="../../lib/jquery-1.8.2.min" />
/// <reference path="../../lib/angular.js" />
/// <reference path="../constants.js"/>
/// <reference path="../namespace.js" />
/// <reference path="../navigation.js"/>
/// <reference path="../utils.js"/>
window.kg.Row = function (entity, config, selectionService) {
    var self = this; // constant for the selection property that we add to each data item

    self.canSelectRows = config.canSelectRows;

    self.rowClasses = config.rowClasses;
    self.selectedItems = config.selectedItems;
    self.entity = entity;
    self.selectionService = selectionService;

    self.selected = ko.observable(false);
    self.continueSelection = function(event) {
        self.selectionService.ChangeSelection(self, event);
    };
    self.toggleSelected = function (row, event) {
        if (!self.canSelectRows) {
            return true;
        }
        var element = event.target || event;
        //check and make sure its not the bubbling up of our checked 'click' event 
        if (element.type == "checkbox") {
            self.selected(!self.selected());
        } 
        if (config.selectWithCheckboxOnly && element.type != "checkbox"){
            return true;
        } else {
            if (self.beforeSelectionChange(self, event)) {
                self.continueSelection(event);
                return self.afterSelectionChange(self, event);
            }
        }
        return false;
    };
    //selectify the entity
    if (self.entity[SELECTED_PROP] === undefined) {
        self.entity[SELECTED_PROP] = false;
    } else {
        // or else maintain the selection set by the entity.
        self.selectionService.setSelection(self, self.entity[SELECTED_PROP]);
    }
    self.rowIndex = ko.observable(0);
    self.offsetTop = ko.observable("0px");
    self.rowDisplayIndex = 0;
    self.isEven = ko.computed(function () {
        if (self.rowIndex() % 2 === 0) {
            return true;
        }
        return false;
    });
    self.isOdd = ko.computed(function () {
        if (self.rowIndex() % 2 !== 0) {
            return true;
        } 
        return false;
    });
    self.beforeSelectionChange = config.beforeSelectionChangeCallback;
    self.afterSelectionChange = config.afterSelectionChangeCallback;
    self.propertyCache = {};
    self.getProperty = function (path) {
        return self.propertyCache[path] || (self.propertyCache[path] = window.kg.utils.evalProperty(self.entity, path));
    };
}; 
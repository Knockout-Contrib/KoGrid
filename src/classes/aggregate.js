/// <reference path="../../lib/knockout-2.2.0.js" />
/// <reference path="../../lib/jquery-1.8.2.min" />
/// <reference path="../../lib/angular.js" />
/// <reference path="../constants.js"/>
/// <reference path="../namespace.js" />
/// <reference path="../navigation.js"/>
/// <reference path="../utils.js"/>
window.kg.Aggregate = function (aggEntity, config, rowFactory, selectionService) {
    var self = this;
    self.index = 0;
    self.offsetTop = ko.observable(0);
    self.entity = aggEntity;
    self.label = ko.observable(aggEntity.gLabel);
    self.field = aggEntity.gField;
    self.depth = aggEntity.gDepth;
    self.parent = aggEntity.parent;
    self.children = aggEntity.children;
    self.aggChildren = aggEntity.aggChildren;
    self.aggIndex = aggEntity.aggIndex;
    self.collapsed = ko.observable(true);
    self.isAggRow = true;
    self.offsetLeft = ko.observable((aggEntity.gDepth * 25).toString() + 'px');
    self.aggLabelFilter = aggEntity.aggLabelFilter;
    self.toggleExpand = function() {
        var c = self.collapsed();
        self._setExpand(!c);
        self.notifyChildren();
    };
    self.setExpand = function (state) {
        self._setExpand(state);
        self.notifyChildren();
    };
    self._setExpand = function (state, child) {
        if (!child) {
            self.collapsed(state);
            self.entity._kg_collapsed = self.collapsed();
        }
        if (self.parent && self.entity[KG_HIDDEN]) state = true;
        $.each(self.aggChildren, function (i, child) {
            var c =  !!state || child.collapsed();
            child.entity[KG_HIDDEN] = state;
            child._setExpand(c, true);
        });
        $.each(self.children, function (i, child) {
            child[KG_HIDDEN] = !!state;
        });
        // var foundMyself = false;
        // $.each(rowFactory.aggCache, function (i, agg) {
        //     if (foundMyself) {
        //         var offset = (30 * self.children.length);
        //         var c = self.collapsed();
        //         agg.offsetTop(c ? agg.offsetTop() - offset : agg.offsetTop() + offset);
        //     } else {
        //         if (i == self.aggIndex) {
        //             foundMyself = true;
        //         }
        //     }
        // });
    };
    self.notifyChildren = function() {
        rowFactory.rowCache = [];

        rowFactory.renderedChange();
    };
    self.aggClass = ko.computed(function() {
        return self.collapsed() ? "kgAggArrowCollapsed" : "kgAggArrowExpanded";
    });
    self.totalChildren = ko.computed(function() {
        if (self.aggChildren.length > 0) {
            var i = 0;
            var recurse = function (cur) {
                if (cur.aggChildren.length > 0) {
                    $.each(cur.aggChildren, function (x, a) {
                        recurse(a);
                    });
                } else {
                    i += cur.children.length;
                }
            };
            recurse(self);
            return i;
        } else {
            return self.children.length;
        }
    });
    self.isEven = ko.observable(false);
    self.isOdd = ko.observable(false);
    self.canSelectRows = config.canSelectRows;
    self.selectedItems = config.selectedItems;
    self.selectionService = selectionService;

    self.selected = ko.observable(false);
    self.cellSelection = ko.observableArray(aggEntity[CELLSELECTED_PROP] || []);
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
        self.selectionService.updateCellSelection(self, self.entity[CELLSELECTED_PROP]);
    }
    self.beforeSelectionChange = config.beforeSelectionChangeCallback;
    self.afterSelectionChange = config.afterSelectionChangeCallback;
    self.propertyCache = {};
    self.getProperty = function (path) {
        return self.propertyCache[path] || (self.propertyCache[path] = window.kg.utils.evalProperty(self.entity, path));
    };
    self.selectCell = function (column) {
        var field = column.field;
        var index = self.cellSelection().indexOf(field);
        if (index == -1) self.selectionService.setCellSelection(self, column, true);
        else self.selectionService.setCellSelection(self, column, false);
    };
}; 
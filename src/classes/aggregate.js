/// <reference path="../../lib/knockout-2.2.0.js" />
/// <reference path="../../lib/jquery-1.8.2.min" />
/// <reference path="../../lib/angular.js" />
/// <reference path="../constants.js"/>
/// <reference path="../namespace.js" />
/// <reference path="../navigation.js"/>
/// <reference path="../utils.js"/>
window.kg.Aggregate = function (aggEntity, rowFactory) {
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
        self.collapsed(!c);
        self.notifyChildren();
    };
    self.setExpand = function (state) {
        self.collapsed(state);
        self.notifyChildren();
    };
    self.notifyChildren = function() {
        $.each(self.aggChildren, function (i, child) {
            child.entity[KG_HIDDEN] = self.collapsed();
            if (self.collapsed()) {
                var c = self.collapsed();
                child.setExpand(c);
            }
        });
        $.each(self.children, function (i, child) {
            child[KG_HIDDEN] = self.collapsed();
        });
        rowFactory.rowCache = [];
        var foundMyself = false;
        $.each(rowFactory.aggCache, function (i, agg) {
            if (foundMyself) {
                var offset = (30 * self.children.length);
                var c = self.collapsed();
                agg.offsetTop(c ? agg.offsetTop() - offset : agg.offsetTop() + offset);
            } else {
                if (i == self.aggIndex) {
                    foundMyself = true;
                }
            }
        });
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
    self.selected = ko.observable(false);
    self.isEven = ko.observable(false);
    self.isOdd = ko.observable(false);
    self.toggleSelected = function () { return true; };
}; 
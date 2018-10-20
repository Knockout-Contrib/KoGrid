window.kg.Aggregate = function (aggEntity, rowFactory) {
    var self = this;
    self.index = 0;
    self.offsetTop = ko.observable(0);
    self.entity = aggEntity;
    self.label = ko.observable(aggEntity.gLabel);
    self.field = aggEntity.gField;
    self.depth = aggEntity.gDepth;
    self.parent = aggEntity.parent;
    self.children = ko.observableArray(aggEntity.children); // this was originally not observable, which made the totalChildren computed useless
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
        $.each(self.children(), function (i, child) {
            child[KG_HIDDEN] = self.collapsed();
        });
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
                    i += cur.children().length;
                }
            };
            recurse(self);
            return i;
        } else {
            return self.children().length;
        }
    }).extend({ rateLimit: 500 });

    self.selected = ko.observable(false);
    self.isEven = ko.observable(false);
    self.isOdd = ko.observable(false);
    self.toggleSelected = function () { return true; };
};

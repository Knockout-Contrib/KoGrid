kg.HeaderCell = function (col, rightHeaderGroup, grid) {
    var self = this;

    this.index = col.index;
    this.displayName = col.displayName;
    this.field = col.field;
    this.column = col;
    this.rightHeaderGroup = rightHeaderGroup;
    this.headerClass = col.headerClass;
    this.headerTemplate = col.headerTemplate;
    this.hasHeaderTemplate = col.hasHeaderTemplate;

    this.allowSort = ko.observable(col.allowSort);
    this.allowFilter = col.allowFilter;
    this.allowResize = ko.observable(col.allowResize);
    
    this.width = col.width;
    this.minWidth = col.minWidth;
    this.maxWidth = col.maxWidth;

    this.colClass = 'col' + this.index;
    this.filter = ko.computed({
        read: function () {
            return self.column.filter();
        },
        write: function (val) {
            self.column.filter(val);
        }
    });

    this.filterVisible = ko.observable(false);
    this._filterVisible = ko.computed({
        read: function () {
            return self.allowFilter;
        },
        write: function (val) {
            self.filterVisible(val);
        }
    });
    
    this.sortAscVisible = ko.computed(function () {
        return self.column.sortDirection() === "asc";
    });

    this.sortDescVisible = ko.computed(function () {
        return self.column.sortDirection() === "desc";
    });

    this.noSortVisible = ko.computed(function () {
        var sortDir = self.column.sortDirection();

        return sortDir !== "asc" && sortDir !== "desc";
    });

    this.sort = function () {
        if (!self.allowSort()) {
            return; // column sorting is disabled, do nothing
        }
        var dir = self.column.sortDirection() === "asc" ? "desc" : "asc";
        self.column.sortDirection(dir);
    };

    this.filterHasFocus = ko.observable(false);
    this.startMousePosition = 0;
    this.origWidth = 0;
    this.origMargin = 0;
    
    var DELAY = 500,
    clicks = 0,
    timer = null;

    this.gripClick = function(event) {
        clicks++;  //count clicks
        if(clicks === 1) {
            timer = setTimeout(function () {
                //Here you can add a single click action.
                clicks = 0;  //after action performed, reset counter
            }, DELAY);
        } else {
            clearTimeout(timer);  //prevent single-click action
            grid.resizeOnData(self.column);  //perform double-click action
            kg.cssBuilder.buildStyles(grid);
            clicks = 0;  //after action performed, reset counter
        }
    };

    this.gripOnMouseUp = function () {
        $(grid.$root).off('mousemove');
        $(grid.$root).off('mouseup');
        document.body.style.cursor = 'default';
        return false;
    };
    this.onMouseMove = function (event) {
        var diff = event.clientX - self.startMousePosition;
        var newWidth = diff + self.origWidth;
        var setMargins = function(hg, nd) {
            if (hg) {
                var nm = nd + hg.origMargin;
                hg.margin(nm);
                if (hg.rightHeaderGroup) setMargins(hg.parent[hg.rightHeaderGroup], nd);
            }
        };
        setMargins(self.rightHeaderGroup, diff),
        self.width(newWidth < self.minWidth ? self.minWidth : (newWidth > self.maxWidth ? self.maxWidth : newWidth));
        kg.cssBuilder.buildStyles(grid);
        return false;
    };
    this.gripOnMouseDown = function (event) {
        self.startMousePosition = event.clientX;
        self.origWidth = self.width();
        var setOrigMargins = function (hg) {
            if (hg) {
                hg.origMargin = hg.margin();
                if (hg.rightHeaderGroup) setOrigMargins(hg.parent[hg.rightHeaderGroup]);
            }
        };
        setOrigMargins(self.rightHeaderGroup);
        $(grid.$root).mousemove(self.onMouseMove);
        $(grid.$root).mouseup(self.gripOnMouseUp);
        document.body.style.cursor = 'col-resize';
        event.target.parentElement.style.cursor = 'col-resize';
        return false;
    };
};
kg.HeaderCell = function (col) {
    var self = this;

    this.colIndex = 0;
    this.displayName = col.displayName;
    this.field = col.field;
    this.column = col;

    this.headerClass = col.headerClass;
    this.headerTemplate = col.headerTemplate;
    this.hasHeaderTemplate = col.hasHeaderTemplate;

    this.width = ko.computed(function () {
        return col.width();
    });

    this.filter = ko.computed({
        read: function () {
            return self.column.filter();
        },
        write: function (val) {
            self.column.filter(val);
        }
    });

    this.filterVisible = ko.observable(false);

    this.allowSort = ko.observable(col.allowSort);

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
};
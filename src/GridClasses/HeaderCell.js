kg.HeaderCell = function (col) {
    var self = this;

    this.colIndex = 0;
    this.displayName = '';
    this.field = '';
    this.column = col;

    this.width = ko.computed(function () {
        return col.width();
    });

    this.offsetLeft = ko.computed(function () {
        return col.offsetLeft();
    });

    this.offsetRight = ko.computed(function () {
        return col.offsetRight();
    });

    this.sort = function () {
        var dir = self.column.sortDirection() === "asc" ? "desc" : "asc";
        self.column.sortDirection(dir);
    };
};
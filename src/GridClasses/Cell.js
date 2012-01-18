kg.Cell = function (col) {
    this.data = '';
    this.width = ko.computed(function () {
        return col.width();
    });
    this.column = col;
    this.row = null;
};
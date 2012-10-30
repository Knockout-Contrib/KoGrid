kg.HeaderRow = function () {
    this.headerCells = [];
    this.height;
    this.headerCellMap = {};
    this.filterVisible = ko.observable(false);
    this.headerGroups = { };
};
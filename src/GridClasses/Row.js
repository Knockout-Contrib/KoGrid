kg.Row = function () {
    this.entity = ko.observable();
    this.cells = ko.observableArray([]);
    this.cellMap = {};
    this.rowIndex = 0;
    this.offsetTop = 0;
    this.height = ko.observable(0);
};
kg.Cell = function () {
    this.data = ko.observable();
    this.width = ko.observable(0);
    this.offsetLeft = ko.observable(0);
    this.column = null;
    this.row = null;
};
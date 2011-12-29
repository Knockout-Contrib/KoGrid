kg.Column = function (colDef) {
    this.width = ko.observable(0);
    this.offsetLeft = ko.observable(0);
    this.field = colDef.field;
};
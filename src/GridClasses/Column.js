kg.Column = function (colDef) {
    this.width = ko.observable(0);
    this.offsetLeft = ko.observable(0);
    this.offsetRight = null; //replaced w/ ko.computed
    this.field = colDef.field;
};
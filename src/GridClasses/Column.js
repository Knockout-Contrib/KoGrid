kg.Column = function (colDef) {
    this.width = ko.observable(0);
    this.offsetLeft = ko.observable(0);
    this.offsetRight = null; //replaced w/ ko.computed
    this.field = colDef.field;
    this.displayName = colDef.displayName || '';
    this.colIndex = 0;
    this.isVisible = ko.observable(false);
};
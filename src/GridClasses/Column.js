kg.Column = function (colDef) {
    this.width = ko.observable(0);

    this.field = colDef.field;
    this.displayName = colDef.displayName || colDef.field;
    this.colIndex = 0;
    this.isVisible = ko.observable(false);

    //sorting
    this.allowSort = true;
    this.sortDirection = ko.observable("");

    //filtering
    this.filter = ko.observable();

    //cell Template
    this.hasCellTemplate = false;
    this.cellTemplate = null; // string of the cellTemplate script element id
};
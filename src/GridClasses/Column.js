kg.Column = function (colDef) {
    var self = this,
        wIsOb = ko.isObservable(colDef.width),
        minWIsOB = ko.isObservable(colDef.minWidth),
        maxWIsOB = ko.isObservable(colDef.maxWidth);
        
    this.width = wIsOb ? colDef.width : ko.observable(0);
    this.minWidth = minWIsOB ? colDef.minWidth : ( !colDef.minWidth ? ko.observable(50) : ko.observable(colDef.minWidth));
    this.maxWidth = maxWIsOB ? colDef.maxWidth : ( !colDef.maxWidth ? ko.observable(9000) : ko.observable(colDef.maxWidth));
    
    this.field = colDef.field;
    if (colDef.displayName === undefined || colDef.displayName === null) {
        // Allow empty column names -- do not check for empty string
        colDef.displayName = colDef.field;
    }
    this.displayName = colDef.displayName;
    this.colIndex = 0;
    this.isVisible = ko.observable(false);

    //sorting
    if (colDef.sortable === undefined || colDef.sortable === null) {
        colDef.sortable = true;
    }
    
    //resizing
    if (colDef.resizable === undefined || colDef.resizable === null) {
        colDef.resizable = true;
    }
    //resizing
    if (colDef.filterable === undefined || colDef.filterable === null) {
        colDef.filterable = true;
    }
    
    this.allowSort = colDef.sortable;
    this.allowResize = colDef.resizable;
    this.allowFilter = colDef.filterable;
    
    this.sortDirection = ko.observable("");
    this.sortingAlgorithm = colDef.sortFn;

    //filtering
    this.filter = ko.observable();

    //cell Template
    this.cellTemplate = colDef.cellTemplate; // string of the cellTemplate script element id
    this.hasCellTemplate = (this.cellTemplate ? true : false);

    this.cellClass = colDef.cellClass;
    this.headerClass = colDef.headerClass;

    this.headerTemplate = colDef.headerTemplate
    this.hasHeaderTemplate = (this.headerTemplate ? true : false);

    // figure out the width
    if (!colDef.width) {
        colDef.width = this.displayName.length * kg.domUtility.letterW;
        colDef.width += 30; //for sorting icons and padding
        self.width(colDef.width);
    } else if (!wIsOb) {
        self.width(colDef.width);
    }
};
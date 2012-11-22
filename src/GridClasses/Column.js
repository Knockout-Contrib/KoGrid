kg.Column = function (colDef, index) {
    var self = this;
    var minWisOb = ko.isObservable(colDef.minWidth);
    var maxWisOb = ko.isObservable(colDef.maxWidth);

    this.def = colDef;
    this.width = ko.observable(colDef.width);
    this.widthIsConfigured = false;
    this.autoWidthSubscription = undefined;
    
    this.headerGroup = colDef.headerGroup;
    // don't want the width to be smaller than this
    this.minWidth = minWisOb ? colDef.minWidth : (!colDef.minWidth ? ko.observable(50) : ko.observable(colDef.minWidth));
    // default max is OVER 9000!
    this.maxWidth = maxWisOb ? colDef.maxWidth : ( !colDef.maxWidth ? ko.observable(9001) : ko.observable(colDef.maxWidth));
    
    this.field = colDef.field;
    if (colDef.displayName === undefined || colDef.displayName === null) {
        // Allow empty column names -- do not check for empty string
        colDef.displayName = colDef.field;
    }
    this.displayName = colDef.displayName;
    this.index = index;
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
    if (self.hasCellTemplate){
        var elem = document.getElementById(self.cellTemplate);
        var templText = elem ? elem.innerHTML : undefined;
        kg.templateManager.addTemplateSafe(self.cellTemplate, templText);
    }
    this.cellClass = colDef.cellClass;
    this.headerClass = colDef.headerClass;

    //header Template
    this.headerTemplate = colDef.headerTemplate;
    this.hasHeaderTemplate = (this.headerTemplate ? true : false);
    if (self.hasHeaderTemplate){
        var elem = document.getElementById(self.headerTemplate);
        var templText = elem ? elem.innerHTML : undefined;
        kg.templateManager.addTemplateSafe(self.headerTemplate, templText);
    }
};
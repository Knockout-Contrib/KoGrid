kg.Column = function (colDef) {
    this.width = ko.observable(0);

    this.field = colDef.field;
    this.displayName = colDef.displayName || colDef.field;
    this.colIndex = 0;
    this.isVisible = ko.observable(false);
    this.width = ko.observable();


    //sorting
    this.allowSort = true;
    this.sortDirection = ko.observable("");

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
    }

    this.width(colDef.width);

};
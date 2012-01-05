kg.Footer = function (grid) {
    this.maxRows = grid.maxRows; //observable
    this.selectedPageSize = ko.observable(250);
    this.pageSizes = ko.observableArray([250, 500, 1000]);
    this.selectedItemCount = grid.selectedItemCount; //observable
};
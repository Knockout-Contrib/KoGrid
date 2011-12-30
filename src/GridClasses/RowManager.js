kg.RowManager = function (cols, dataSource) {
    var rowCache = {},
        viewableRange = ko.observable(),
        renderedRange = ko.computed(function () {
            var rg = viewableRange();

            rg.bottomRow = Math.max(0, rg.bottomRow - 10);
            rg.topRow = Math.min(maxRows(), rg.topRow + 10);

            return rg;
        });

    this.colCache = cols;
    this.dataSource = data; //observable
    this.viewportRows = 0;
    this.excessRows = 5;
    
};
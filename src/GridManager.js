kg.gridManager = (new function () {
    var self = this,
        elementGridKey = '__koGrid__';

    //#region Public Properties
    this.gridCache = {};

    //#endregion

    //#region Public Methods
    this.storeGrid = function (element, grid) {
        self.gridCache[grid.gridId] = grid;
        element[elementGridKey] = grid.gridId;
    };

    this.getGrid = function (element) {
        var grid;

        if (element[elementGridKey]) {
            grid = self.gridCache[element[elementGridKey]];
        }

        return grid;
    };

    this.clearGridCache = function () {
        self.gridCache = {};
    };

    this.assignGridEventHandlers = function (grid) {

        grid.$viewport.scroll(function (e) {
            var scrollLeft = e.target.scrollLeft,
                scrollTop = e.target.scrollTop;

            grid.adjustScrollLeft(scrollLeft);
            grid.adjustScrollTop(scrollTop);
        });
    };
    //#endregion
} ());
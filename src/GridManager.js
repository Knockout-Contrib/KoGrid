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

        //resize the grid on parent re-size events

        var $parent = grid.$root.parent();

        if ($parent.length == 0) {
            $parent = grid.$root;
        }

        $(window).resize(function () {
            var prevSizes = {
                rootMaxH: grid.elementDims.rootMaxH,
                rootMaxW: grid.elementDims.rootMaxW,
                rootMinH: grid.elementDims.rootMinH,
                rootMinW: grid.elementDims.rootMinW
            },
            scrollTop = 0,
            isDifferent = false;
            
            // first check to see if the grid is hidden... if it is, we will screw a bunch of things up by re-sizing
            var $hiddens = grid.$root.parents(":hidden");
            if ($hiddens.length > 0) {
                return;
            }

            //catch this so we can return the viewer to their original scroll after the resize!
            scrollTop = grid.$viewport.scrollTop();

            kg.domUtility.measureGrid(grid.$root, grid);

            //check to see if anything has changed
            if (prevSizes.rootMaxH !== grid.elementDims.rootMaxH && grid.elementDims.rootMaxH !== 0) { // if display: none is set, then these come back as zeros
                isDifferent = true;
            } else if (prevSizes.rootMaxW !== grid.elementDims.rootMaxW && grid.elementDims.rootMaxW !== 0) {
                isDifferent = true;
            } else if (prevSizes.rootMinH !== grid.elementDims.rootMinH) {
                isDifferent = true;
            } else if (prevSizes.rootMinW !== grid.elementDims.rootMinW) {
                isDifferent = true;
            } else {
                return;
            }

            if (isDifferent) {

                grid.refreshDomSizes();

                grid.adjustScrollTop(scrollTop, true); //ensure that the user stays scrolled where they were
            }
        });
    };
    //#endregion
} ());
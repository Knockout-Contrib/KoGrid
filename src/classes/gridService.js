/// <reference path="../../lib/jquery-1.8.2.min" />
/// <reference path="../constants.js"/>
/// <reference path="../namespace.js" />
/// <reference path="../navigation.js"/>
/// <reference path="../utils.js"/>
kg.gridService = {
    gridCache: {},
    eventStorage: {},
    getIndexOfCache: function() {
        var indx = -1;   
        for (var grid in kg.gridService.gridCache) {
            indx++;
            if (!kg.gridService.gridCache.hasOwnProperty(grid)) continue;
            return indx;
        }
        return indx;
    },
    StoreGrid: function (element, grid) {
        kg.gridService.gridCache[grid.gridId] = grid;
        element[GRID_KEY] = grid.gridId;
    },
    RemoveGrid: function(gridId) {
        delete kg.gridService.gridCache[gridId];
    },
    GetGrid: function (element) {
        var grid;
        if (element[GRID_KEY]) {
            grid = kg.gridService.gridCache[element[GRID_KEY]];
            return grid;
        }
        return false;
    },
    ClearGridCache : function () {
        kg.gridService.gridCache = {};
    },
    AssignGridEventHandlers: function (grid) {
        grid.$viewport.scroll(function (e) {
            var scrollLeft = e.target.scrollLeft,
            scrollTop = e.target.scrollTop;
            grid.adjustScrollLeft(scrollLeft);
            grid.adjustScrollTop(scrollTop);
        });
        grid.$viewport.off('keydown');
        grid.$viewport.on('keydown', function (e) {
            return kg.moveSelectionHandler(grid, e);
        });
        //Chrome and firefox both need a tab index so the grid can recieve focus.
        //need to give the grid a tabindex if it doesn't already have one so
        //we'll just give it a tab index of the corresponding gridcache index 
        //that way we'll get the same result every time it is run.
        //configurable within the options.
        if (grid.config.tabIndex === -1){
            grid.$viewport.attr('tabIndex', kg.gridService.getIndexOfCache(grid.gridId));
        } else {
            grid.$viewport.attr('tabIndex', grid.config.tabIndex);
        }
        $(window).resize(function () {
            kg.domUtilityService.UpdateGridLayout(grid);
            if (grid.config.maintainColumnRatios) {
                grid.configureColumnWidths();
            }
        });
    },
};
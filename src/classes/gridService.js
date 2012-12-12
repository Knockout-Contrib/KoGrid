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
};
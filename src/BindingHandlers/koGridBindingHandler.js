/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGrid'] = (function () {
    var gridCache = {};

    var makeNewValueAccessor = function (grid) {
        return function () {
            return grid;
        };
    };

    var makeNewBindingContext = function (bindingContext, grid) {
        return bindingContext.createChildContext(grid);
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = new kg.KoGrid(valueAccessor()),
                returnVal,
                gridId;

            gridId = kg.utils.newId();
            element['__koGrid__'] = gridId;

            grid.init(element);

            gridCache[gridId] = grid;

            returnVal = ko.bindingHandlers['with'].init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));

            return returnVal;
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid,
                returnVal,
                gridId;

            gridId = element['__koGrid__'];

            if (gridId) {

                grid = gridCache[gridId];

                returnVal = ko.bindingHandlers['with'].update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));
            }
            return returnVal;
        }
    };

} ());

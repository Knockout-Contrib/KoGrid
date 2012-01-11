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

    var setupGridLayout = function ($element) {
        $element.empty().html(kg.defaultGridInnerTemplate());
    };


    var measureElementMaxSizes = function ($container, grid) {
        $container.append("<div style='height: 20000px; width: 20000px;'></div>");

        grid.elementDims.rootMaxW = $container.width();
        grid.elementDims.rootMaxH = $container.height();
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = new kg.KoGrid(valueAccessor()),
                $element = $(element),
                returnVal;

            element['__koGrid__'] = grid.gridId;

            grid.init();

            measureElementMaxSizes($element, grid);

            setupGridLayout($element);

            kg.domFormatter.formatGrid(element, grid);

            returnVal = ko.bindingHandlers['with'].init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));

            gridCache[grid.gridId] = grid;

            return returnVal;
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid, returnVal, gridId;

            gridId = element['__koGrid__'];

            if (gridId) {

                grid = gridCache[gridId];

                if (grid) {

                    if (grid.h_updateTimeOut) {
                        window.clearTimeout(grid.h_updateTimeOut);
                    }

                    returnVal = ko.bindingHandlers['with'].update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));

                    grid.h_updateTimeOut = window.setTimeout(function () { grid.update(element); }, 0);

                    //grid.update(element);
                }
            }
            return returnVal;
        }
    };

} ());

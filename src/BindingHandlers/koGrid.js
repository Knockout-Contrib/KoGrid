/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGrid'] = (function () {
    var makeNewValueAccessor = function (grid) {
        return function () {
            return {
                name: GRID_TEMPLATE,
                data: grid
            };
        };
    };

    var measureElementMaxSizes = function ($container, grid) {
        var dims = kg.domUtility.measureElementMaxDims($container);

        grid.elementDims.rootMaxW = dims.maxWidth;
        grid.elementDims.rootMaxH = dims.maxWidth;

    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid,
                options = valueAccessor(),
                $element = $(element);

            //create the Grid
            grid = new kg.KoGrid(options);

            kg.gridManager.storeGrid(element, grid);

            //get the max container sizes
            measureElementMaxSizes($element, grid);

            //set the right styling on the container
            $(element).addClass("kgGrid")
                      .addClass(grid.gridId.toString())
                      .css("position", "relative");

            //make sure the templates are generated for the Grid
            kg.templateManager.ensureGridTemplates({
                rowTemplate: grid.config.rowTemplate,
                headerTemplate: grid.config.headerTemplate,
                headerCellTemplate: grid.config.headerCellTemplate,
                footerTemplate: grid.config.footerTemplate,
                columns: grid.columns(),
                showFilter: grid.config.allowFiltering
            });

            return ko.bindingHandlers['template'].init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid,
                returnVal;

            grid = kg.gridManager.getGrid(element);

            //kind a big problem if this isn't here...
            if (!grid) {
                return { 'controlsDescendantBindings': true };
            }

            //fire the with "update" bindingHandler
            returnVal = ko.bindingHandlers['template'].update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);

            //walk the element's graph and the correct properties on the grid
            kg.domUtility.assignGridContainers(element, grid);

            //now use the manager to assign the event handlers
            kg.gridManager.assignGridEventHandlers(grid);

            return returnVal;
        }
    };

} ());

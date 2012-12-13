ko.bindingHandlers['koGrid'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = valueAccessor();
            var elem = $(element);
            options.gridDim = new kg.Dimension({ outerHeight: ko.observable(elem.height()), outerWidth: ko.observable(elem.width()) });
            var grid = new kg.Grid(options);
            var gridElem = $(kg.defaultGridTemplate());
            // if it is a string we can watch for data changes. otherwise you won't be able to update the grid data
            options.data.subscribe(function () {
                if (grid.$$selectionPhase) return;
                grid.searchProvider.evalFilter();
                grid.refreshDomSizes();
            });
            // if columndefs are observable watch for changes and rebuild columns.
            if (ko.isObservable(options.columnDefs)) {
                options.columnDefs.subscribe(function (newDefs) {
                    grid.columns([]);
                    grid.config.columnDefs = newDefs;
                    grid.buildColumns();
                    grid.configureColumnWidths();
                });
            }
            //set the right styling on the container
            elem.addClass("koGrid").addClass(grid.gridId.toString());
            elem.append(gridElem);
            grid.$userViewModel = bindingContext.$data;
            ko.applyBindings(grid, gridElem[0]);
            //walk the element's graph and the correct properties on the grid
            kg.domUtilityService.AssignGridContainers(elem, grid);
            grid.configureColumnWidths();
            grid.refreshDomSizes();
            //now use the manager to assign the event handlers
            grid.eventProvider = new kg.EventProvider(grid);
            //initialize plugins.
            $.each(grid.config.plugins, function (i, p) {
                p.init(grid);
            });
            kg.domUtilityService.BuildStyles(grid);
            return { controlsDescendantBindings: true };
        }
    };
}());
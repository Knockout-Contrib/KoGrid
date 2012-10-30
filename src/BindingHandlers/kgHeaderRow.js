ko.bindingHandlers['kgHeaderRow'] = (function () {

    var buildHeaders = function (grid) {
        var cols = grid.columns(),
            cell,
            headerRow = new kg.HeaderRow();
        headerRow.headerGroups = grid.headerGroups;
        
        kg.utils.forEach(cols, function (col, i) {
            var hgs = headerRow.headerGroups(),
                hg;
            if (hgs) {
                hg = hgs[col.headerGroup || i];
            }
            cell = new kg.HeaderCell(col, hg ? hgs[hg.rightHeaderGroup] : undefined);
            cell.colIndex = i;

            headerRow.headerCells.push(cell);
            headerRow.headerCellMap[col.field] = cell;
        });
        grid.headerRow = headerRow;
        
        grid.headerRow.height = grid.config.headerRowHeight;
        
    };

    var makeNewValueAccessor = function (grid) {
        return function () {
            return {
                name: kg.templateManager.getTemplate(grid.config.headerTemplate),
                data: grid.headerRow
            };
        };
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            buildHeaders(grid);

            return ko.bindingHandlers.template.init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            return ko.bindingHandlers.template.update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);
        }
    }
} ());
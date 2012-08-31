ko.bindingHandlers['kgHeader'] = (function () {
    function makeNewValueAccessor (headerCell, grid) {
        return function () {
            return {
                name: headerCell.headerTemplate || grid.config.headerCellTemplate,
                data: headerCell
            };
        };
    };

    // measures the width of the text in a header cell
    function measureHeaderText(element, cell) {
        var $el = $(element);
        var $span = $('.kgHeaderText', $el);
        var width = kg.domUtility.measureText($span);

        cell.textWidth(width);

        return width;
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = bindingContext.$data,
                cell,
                property,
                options = valueAccessor(); //string of the property name

            if (options) {
                property = options.value;
                cell = headerRow.headerCellMap[property];
                if (cell) {
                    if (property !== 'rowIndex' && property !== '__kg_selected__') {
                        return { 'controlsDescendantBindings': true }
                    }
                }
            }

            
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = bindingContext.$data,
                grid = bindingContext.$parent,
                cell,
                property,
                options = valueAccessor(); //string of the property name

            if (options) {
                property = options.value;
                cell = headerRow.headerCellMap[property];
                if (cell) {
                    
                    //format the header cell
                    element.className += " kgHeaderCell col" + cell.colIndex + " ";
                    
                    //add the custom class in case it has been provided
                    if (cell.headerClass) {
                        element.className += " " + cell.headerClass;
                    }

                    if (property !== 'rowIndex' && property !== '__kg_selected__') {
                        //render the cell template
                        ko.bindingHandlers.template.update(element, makeNewValueAccessor(cell, grid), allBindingsAccessor, viewModel, bindingContext);

                        // get the text width
                        measureHeaderText(element, cell);

                        return { 'controlsDescendantBindings': true }
                    }
                }
            }
        }
    }
} ());
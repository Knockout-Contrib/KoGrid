ko.bindingHandlers['kgHeader'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

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
                kg.domFormatter.formatHeaderCell(element, cell);

                //don't set text binding on elements that have templated content defined
                if (!element.children.length > 0) {
                    ko.bindingHandlers['text'].update(element, function () { return cell.displayName; });
                }
            }

        }
    }
} ());
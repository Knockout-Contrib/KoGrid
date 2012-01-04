ko.bindingHandlers['kgHeader'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = bindingContext.$data,
                property = valueAccessor().value; //string of the property name

            var cell = headerRow.headerCellMap[property];

            kg.domFormatter.formatHeaderCell(element, cell);

            ko.bindingHandlers['text'].update(element, function () { return cell.displayName; });

        }
    }
} ());
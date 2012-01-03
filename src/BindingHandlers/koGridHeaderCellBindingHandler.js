ko.bindingHandlers['kgHeader'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = bindingContext.$data,
                property = valueAccessor().value; //string of the property name

            var cell = headerRow.headerCellMap[property];

            element.style.position = "absolute";
            element.style.width = cell.width();
            element.style.left = cell.offsetLeft() + 'px';
            element.style.right = cell.offsetRight() + 'px';

            ko.bindingHandlers['text'].update(element, function () { return cell.displayName; });

        }
    }
} ());
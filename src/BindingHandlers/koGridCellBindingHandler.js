/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGridCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = valueAccessor(),
                cell,
                row = bindingContext.$data;

            //get the cell from the options
            cell = row.cellMap[options.value];

            //style the element correctly:
            element.style.position = "absolute";
            element.style.left = cell.offsetLeft() + 'px';
            element.style.width = cell.width() + 'px';
            element.className = "kgCell"
            element.innerHTML = ko.utils.unwrapObservable(cell.data());
        }
    };

} ());
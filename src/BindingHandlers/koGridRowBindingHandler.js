/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGridRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor(),
                rowManager = bindingContext.$parent.rowManager;

            //style the element correctly:
            element.style.position = "absolute";
            element.style.height = row.height();
            element.style.top = row.offsetTop + 'px';

            rowManager.rowElCache[row.rowIndex] = element;
        }
    };

} ());
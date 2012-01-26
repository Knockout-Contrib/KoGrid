/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['kgRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor(),
                classes = 'kgRow',
                grid = bindingContext.$parent,
                rowManager = bindingContext.$parent.rowManager;

            classes += (row.rowIndex % 2) === 0 ? ' even' : ' odd';

            element['_kg_rowIndex_'] = row.rowIndex;
            element.style.top = row.offsetTop + 'px';
            element.className = classes;
        }
    };

} ());
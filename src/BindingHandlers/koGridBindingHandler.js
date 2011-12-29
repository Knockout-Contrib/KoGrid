/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGrid'] = (function () {

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var grid = new kg.KoGrid(valueAccessor());

            grid.init(element);

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        }
    };

} ());

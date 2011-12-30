/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGridRows'] = (function () {

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {


        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var val = valueAccessor(),
                context = bindingContext;
        }
    };

} ());
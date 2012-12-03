/// <reference path="../../lib/knockout-2.2.0.js" />
ko.bindingHandlers['kgCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var cell = $(viewModel.cellTemplate);
            ko.applyBindings(bindingContext, cell[0]);
            $(element).append(cell);
            return { controlsDescendantBindings: true };
        }
    };
}());
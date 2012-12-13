/// <reference path="../../lib/knockout-2.2.0.js" />
ko.bindingHandlers['kgCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            bindingContext.$userViewModel = bindingContext.$parent.$userViewModel;
            var compile = function (html) {
                var cell = $(html);
                ko.applyBindings(bindingContext, cell[0]);
                $(element).html(cell);
            };
            if (viewModel.cellTemplate.then) {
                viewModel.cellTemplate.then(function(p) {
                    compile(p);
                });
            } else {
                compile(viewModel.cellTemplate);
            }
            return { controlsDescendantBindings: true };
        }
    };
}());
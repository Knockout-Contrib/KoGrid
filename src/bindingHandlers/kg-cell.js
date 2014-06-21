/// <reference path="../../lib/knockout-2.2.0.js" />
ko.bindingHandlers['kgCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            bindingContext.$userViewModel = bindingContext.$parent.$userViewModel;
            var $element = $(element);
            var compile = function (html) {
                //viewModel.$cellTemplate = $(html);
                $element.html(html);
                ko.applyBindings(bindingContext, $element.children()[0]);
            };
            // if (viewModel.$cellTemplate) {
            //     $element.html(viewModel.$cellTemplate);
            //     ko.applyBindings(bindingContext, $element.children()[0]);
            // }
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

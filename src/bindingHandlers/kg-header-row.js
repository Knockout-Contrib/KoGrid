ko.bindingHandlers['kgHeaderRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            bindingContext.$userViewModel = bindingContext.$data.$userViewModel;
            var compile = function(html) {
                var headerRow = $(html);
                ko.applyBindings(bindingContext, headerRow[0]);
                $(element).html(headerRow);
            };
            if (viewModel.headerRowTemplate.then) {
                viewModel.headerRowTemplate.then(function (p) {
                    compile(p);
                });
            } else {
                compile(viewModel.headerRowTemplate);
            }
            return { controlsDescendantBindings: true };
        }
    };
}());
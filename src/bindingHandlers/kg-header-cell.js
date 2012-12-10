ko.bindingHandlers['kgHeaderCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var newContext = bindingContext.extend({ $grid: bindingContext.$parent, $userViewModel: bindingContext.$parent.$userViewModel });
            var compile = function (html) {
                var headerCell = $(html);
                ko.applyBindings(newContext, headerCell[0]);
                $(element).html(headerCell);
            };
            if (viewModel.headerCellTemplate.then) {
                viewModel.headerCellTemplate.then(function (p) {
                    compile(p);
                });
            } else {
                compile(viewModel.headerCellTemplate);
            }
            return { controlsDescendantBindings: true };
        }
    };
}());
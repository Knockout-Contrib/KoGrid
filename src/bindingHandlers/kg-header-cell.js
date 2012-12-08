ko.bindingHandlers['kgHeaderCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var newContext = bindingContext.extend({ $grid: bindingContext.$parent, $userViewModel: bindingContext.$parent.$userViewModel });
            var headerCell = $(viewModel.headerCellTemplate);
            ko.applyBindings(newContext, headerCell[0]);
            $(element).append(headerCell);
            return { controlsDescendantBindings: true };
        }
    };
}());
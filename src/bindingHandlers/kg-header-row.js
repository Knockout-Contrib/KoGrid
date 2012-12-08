ko.bindingHandlers['kgHeaderRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = $(viewModel.headerRowTemplate);
            bindingContext.$userViewModel = bindingContext.$data.$userViewModel;
            ko.applyBindings(bindingContext, headerRow[0]);
            $(element).append(headerRow);
            return { controlsDescendantBindings: true };
        }
    };
}());
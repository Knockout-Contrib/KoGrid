ko.bindingHandlers['kgFooterRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            bindingContext.$userViewModel = bindingContext.$data.$userViewModel;
            var compile = function(html) {
                var footer = $(html);
                ko.applyBindings(bindingContext, footer[0]);
                $(element).html(footer);
            };
            if (viewModel.footerRowTemplate.then) {
                viewModel.footerRowTemplate.then(function (p) {
                    compile(p);
                });
            } else {
                compile(viewModel.footerRowTemplate);
            }
            return { controlsDescendantBindings: true };
        }
    };
}());
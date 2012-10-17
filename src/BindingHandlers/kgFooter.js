ko.bindingHandlers['kgFooter'] = (function () {
    var makeNewValueAccessor = function (grid) {
        var templateText = kg.templateManager.getTemplateText(grid.config.footerTemplate);
        var template = document.createElement('script');
        template.setAttribute('type', 'text/html');
        template.setAttribute('id', grid.config.footerTemplate);
        template.innerHTML = templateText;
        return function () {
            return {
                name: template,
                data: grid.footer
            };
        };
    };

    var makeNewBindingContext = function (bindingContext, footer) {
        return bindingContext.createChildContext(footer);
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            grid.footer = new kg.Footer(grid);

            return ko.bindingHandlers.template.init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid.footer));
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            return ko.bindingHandlers.template.update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid.footer));
        }
    }
} ());
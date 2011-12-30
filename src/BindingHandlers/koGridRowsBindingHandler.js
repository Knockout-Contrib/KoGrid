/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGridRows'] = (function () {

    var cleanupCanvas = function (rowManager) {
        var rg = rowManager.renderedRange(),
            rowEl,
            len = rowManager.rowElCache.length,
            i = 0;

        while (i < rg.bottomRow) {

            rowEl = rowManager.rowElCache[i];
            if (rowEl) {
                ko.utils.domNodeDisposal.removeNode(rowEl);
                delete rowManager.rowElCache[i];
            }
            i++;
        }

        i = rg.topRow;
        i += 1;

        while (i < len) {

            rowEl = rowManager.rowElCache[i];
            if (rowEl) {
                ko.utils.domNodeDisposal.removeNode(rowEl);
                delete rowManager.rowElCache[i];
            }
            i++;
        }
    };

    var makeNewValueAccessor = function (rows, rowTemplateName) {
        return function () {
            return {
                name: rowTemplateName,
                foreach: rows
            };
        };
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var rowManager = bindingContext.$data.rowManager,
                rows = ko.utils.unwrapObservable(valueAccessor());

            cleanupCanvas(rowManager);

            element.style.height = (bindingContext.$data.maxRows() * rowManager.rowHeight) + 'px';

            var newAccessor = makeNewValueAccessor(rows, rowManager.rowTemplateId);

            return ko.bindingHandlers.template.update(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        }
    };

} ());
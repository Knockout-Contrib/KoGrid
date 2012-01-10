/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['kgRows'] = (function () {

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
            var rowManager = bindingContext.$data.rowManager,
                rows = ko.utils.unwrapObservable(valueAccessor());

            var newAccessor = makeNewValueAccessor(rows, rowManager.rowTemplateId);

            return ko.bindingHandlers.template.init(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var rowManager = bindingContext.$data.rowManager,
                rows = ko.utils.unwrapObservable(valueAccessor()),
                grid = bindingContext.$data,
                $row,
                $cell,
                newAccessor,
                retVal;

            element.style.height = (bindingContext.$data.maxCanvasHeight()) + 'px';

            newAccessor = makeNewValueAccessor(rows, rowManager.rowTemplateId);

            retVal = ko.bindingHandlers.template.update(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);

            //Measure the cell and row differences after rendering

            $row = $(element).children().first();
            if ($row) {
                $cell = $row.children().first();
                if ($cell) {

                    grid.elementDims.rowWdiff = $row.outerWidth() - $row.width();
                    grid.elementDims.rowHdiff = $row.outerHeight() - $row.height();

                    grid.elementDims.cellWdiff = $cell.outerWidth() - $cell.width();
                    grid.elementDims.cellHdiff = $cell.outerHeight() - $cell.height();
                }
            }

            return retVal;
        }
    };

} ());
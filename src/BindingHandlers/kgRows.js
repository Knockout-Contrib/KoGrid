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
                grid = bindingContext.$data,
                rows = ko.utils.unwrapObservable(valueAccessor());

            var newAccessor = makeNewValueAccessor(rows, grid.config.rowTemplate);

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

            newAccessor = makeNewValueAccessor(rows, grid.config.rowTemplate);

            retVal = ko.bindingHandlers.template.update(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);

            //only measure the row and cell differences when data changes
            if (grid.elementsNeedMeasuring && grid.initPhase > 0) {
                //Measure the cell and row differences after rendering
                kg.domUtility.measureRow($(element), grid);
            }
            return retVal;
        }
    };

} ());
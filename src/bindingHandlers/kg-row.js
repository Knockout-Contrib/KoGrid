/// <reference path="../../lib/knockout-2.2.0.js" />
/// <reference path="../constants.js" />
﻿/// <reference path="../templates/aggregateTemplate.js" />
/// <reference path="../namespace.js" />
ko.bindingHandlers['kgRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor();
            var grid = row.$grid = bindingContext.$parent;
            var html;
            if (row.isAggRow) {
                html = kg.aggregateTemplate();
                if (row.aggLabelFilter) {
                    html = html.replace(CUSTOM_FILTERS, '| ' + row.aggLabelFilter);
                } else {
                    html = html.replace(CUSTOM_FILTERS, "");
                }
            } else {
                html = grid.rowTemplate;
            }
            var rowElem = $(html);
            row.$userViewModel = bindingContext.$parent.$userViewModel;
            ko.applyBindings(row, rowElem[0]);
            $(element).append(rowElem);
            return { controlsDescendantBindings: true };
        }
    };
}());
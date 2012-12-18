/// <reference path="../../lib/knockout-2.2.0.js" />
/// <reference path="../constants.js" />
﻿/// <reference path="../templates/aggregateTemplate.js" />
/// <reference path="../namespace.js" />
ko.bindingHandlers['kgRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor();
            var grid = row.$grid = bindingContext.$parent;
            var source;
            if (row.isAggRow) {
                source = window.kg.aggregateTemplate();
            } else {
                source = grid.rowTemplate;
            }
            var compile = function(html) {
                var rowElem = $(html);
                row.$userViewModel = bindingContext.$parent.$userViewModel;
                ko.applyBindings(row, rowElem[0]);
                $(element).html(rowElem);
            };
            if (source.then) {
                source.then(function (p) {
                    compile(p);
                });
            } else {
                compile(source);
            }
            return { controlsDescendantBindings: true };
        }
    };
}());
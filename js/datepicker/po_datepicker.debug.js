/// <reference path="../../lib/jquery-1.6.js" />
/// <reference path="../../lib/knockout-1.2.1.js" />
/// <reference path="../../lib/jquery.tmpl.js" />
/// <reference path="../../lib/jquery-ui.js" />

(function () {
    ko.bindingHandlers['date'] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // This will be called when the binding is first applied to an element
            var allBindings, options;

            allBindings = allBindingsAccessor();
            if (allBindings['dateOptions']) {
                options = allBindings['dateOptions'];
                $(element).datepicker(options);
            } else {
                $(element).datepicker();
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // This will be called once when the binding is first applied to an element,
            var dateval = ko.utils.unwrapObservable(valueAccessor());
            $(element).datepicker("setDate", dateval);
        }
    };
})();
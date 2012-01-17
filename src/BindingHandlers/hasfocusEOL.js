ko.bindingHandlers['hasfocusEOL'] = {

    init: function (element, valueAccessor, allBindingsAccessor) {
        ko.bindingHandlers['hasfocus'].init(element, valueAccessor, allBindingsAccessor);
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var val = element.value,
            isFocus = ko.utils.unwrapObservable(valueAccessor());

        if (isFocus) {
            element.value = '';
            ko.bindingHandlers['hasfocus'].update(element, valueAccessor, allBindingsAccessor);
            element.value = val;
        }
    }
};
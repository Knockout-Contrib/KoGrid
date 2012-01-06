kg.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<span data-bind="text: $data.displayName"></span>');
    b.append('<button data-bind="click: $data.sort">S</button>');

    return b.toString();
};
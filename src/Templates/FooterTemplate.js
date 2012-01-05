kg.defaultFooterTemplate = function () {
    return  '<div>' +
                '<strong>Total Items:</strong><span data-bind="text: maxRows"></span>&nbsp' +
                '<strong>Selected Items:</strong><span data-bind="text: selectedItemCount"></span>&nbsp&nbsp' +
                '<strong>Selected Page Size:</strong><span data-bind="text: selectedPageSize"></span>' +
                '<select data-bind="options: pageSizes, value: selectedPageSize"></select>' +
            '</div>';
};
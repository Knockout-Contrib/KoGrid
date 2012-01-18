kg.templates.defaultFooterTemplate = function () {
    return  '<div>' +
                '<div style="float: left; margin: 5px"><strong>Total Items: </strong><span data-bind="text: maxRows"></span></div>' +
                '<div style="float: left; margin: 5px"><strong>Selected Items: </strong><span data-bind="text: selectedItemCount"></span></div>' +
                '<div style="float: left;" data-bind="visible: pagerVisible">' +
                    'Page Size: <select data-bind="options: pageSizes, value: selectedPageSize"></select>' +
                    '<button data-bind="click: pageBackward"> << </button>' +
                    'Page: <span data-bind="text: currentPage"></span> of <span data-bind="text: maxPages"></span>' +
                    '<button data-bind="click: pageForward"> >> </button>' +
                '</div>' +
            '</div>';
};
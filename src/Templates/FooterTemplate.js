<<<<<<< HEAD
﻿kg.templates.defaultFooterTemplate = function () {
    return '<div class="kgTotalSelectContainer" data-bind="visible: footerVisible">' +
                '<div class="kgFooterTotalItems" data-bind="css: {\'kgNoMultiSelect\': !isMultiSelect()}">' +
                    '<span class="kgLabel">Total Items:</span> <span data-bind="text: maxRows"></span>' +
                '</div>' +
                '<div class="kgFooterSelectedItems" data-bind="visible: isMultiSelect">' +
                    '<span class="kgLabel">Selected Items:</span> <span data-bind="text: selectedItemCount"></span>' +
                '</div>' +
            '</div>' +
            '<div class="kgPagerContainer" data-bind="visible: pagerVisible() && footerVisible(), css: {\'kgNoMultiSelect\': !isMultiSelect()}">' +
                '<div style="float: right;">' +
                    '<div class="kgRowCountPicker">' +
                        '<span class="kgLabel">Rows:</span>' +
                        '<select data-bind="options: pageSizes, value: selectedPageSize">' +
                        '</select>' +
                    '</div>' +
                    '<div class="kgPagerControl">' +
                        '<input class="kgPagerFirst" type="button" data-bind="click: pageToFirst, enable: canPageBackward" title="First Page"/>' +
                        '<input class="kgPagerPrev" type="button"  data-bind="click: pageBackward, enable: canPageBackward" title="Previous Page"/>' +
                        '<input class="kgPagerCurrent" type="text" data-bind="value: protectedCurrentPage, enable: maxPages() > 1" />' +
                        '<input class="kgPagerNext" type="button"  data-bind="click: pageForward, enable: canPageForward" title="Next Page"/>' +
                        '<input class="kgPagerLast" type="button"  data-bind="click: pageToLast, enable: canPageForward" title="Last Page"/>' +
                    '</div>' +
                '</div>' +
            '</div>';
=======
﻿kg.templates.defaultFooterTemplate = function () {
    return '<div class="kgTotalSelectContainer" data-bind="visible: footerVisible">' +
                '<div class="kgFooterTotalItems">' +
                    '<span class="kgLabel">Total Items:</span> <span data-bind="text: maxRows"></span>' +
                '</div>' +
                '<div class="kgFooterSelectedItems">' +
                    '<span class="kgLabel">Selected Items:</span> <span data-bind="text: selectedItemCount"></span>' +
                '</div>' +
            '</div>' +
            '<div class="kgPagerContainer" data-bind="visible: pagerVisible() && footerVisible()">' +
                '<div style="float: right;">' +
                    '<div class="kgRowCountPicker"">' +
                        '<span class="kgLabel">Rows:</span>' +
                        '<select data-bind="options: pageSizes, value: selectedPageSize">' +
                        '</select>' +
                    '</div>' +
                    '<div class="kgPagerControl" style="float: left; min-width: 135px;">' +
                        '<input class="kgPagerFirst" type="button" data-bind="click: pageToFirst, enable: canPageBackward" title="First Page"/>' +
                        '<input class="kgPagerPrev" type="button"  data-bind="click: pageBackward, enable: canPageBackward" title="Previous Page"/>' +
                        '<input class="kgPagerCurrent" type="text" data-bind="value: protectedCurrentPage, enable: maxPages() > 1" />' +
                        '<input class="kgPagerNext" type="button"  data-bind="click: pageForward, enable: canPageForward" title="Next Page"/>' +
                        '<input class="kgPagerLast" type="button"  data-bind="click: pageToLast, enable: canPageForward" title="Last Page"/>' +
                    '</div>' +
                '</div>' +
            '</div>';
>>>>>>> parent of f6037dc... updating source with previous commit's changes
};
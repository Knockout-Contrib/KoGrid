/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['kgRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor(),
                grid = bindingContext.$parent,
                rowManager = bindingContext.$parent.rowManager,
                selectionCell,
                displayIndex = grid.config.displayRowIndex ? 1 : 0,
                checkBox,
                indexCell;

            kg.domFormatter.formatRow(element, row);

            //allowRowSelection: true, 
            //displayRowIndex: true,
            if (grid.config.allowRowSelection) {
                selectionCell = document.createElement("DIV");
                selectionCell.innerHTML = "<input type='checkbox' data-bind='checked: $data.selected'/>";
                selectionCell.className = "kgSelectionCell";

                kg.domFormatter.formatCell(selectionCell, { column: { index: displayIndex} });
                element.insertBefore(selectionCell, element.children[0]);

                displayIndex--;
            }
            if (grid.config.displayRowIndex) {
                indexCell = document.createElement("DIV");
                indexCell.className = "kgRowIndexCell";

                kg.domFormatter.formatCell(indexCell, { column: { index: displayIndex} });

                element.insertBefore(indexCell, element.children[0]);
                ko.bindingHandlers.text.update(indexCell, function () { return row.rowIndex; });
            }
        }
    };

} ());
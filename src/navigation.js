/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

//set event binding on the grid so we can select using the up/down keys
var dba = getElementsByAttribute(document.body, "DIV", "data-bind", "koGrid", true);
var len = dba.length,
    i = 0;
for (; i < len; i++) {
    if (dba[i] !== undefined) {
        if (dba.indexOf("keydown") == -1) {
            var cas = $(dba)[i].getAttribute("data-bind")
            $(dba[i]).attr("data-bind", "event: { keydown: ko.kgMoveSelection }, " + cas);
        }
    }
}

ko.kgMoveSelection = function (sender, evt) {
    var offset,
        charCode = (evt.which) ? evt.which : event.keyCode;
    switch (charCode) {
        case 38:
            // up - select previous
            offset = -1;
            break;
        case 40:
            // down - select next
            offset = 1;
            break;
        default:
            return true;
    }
    //we have to check for IE because IE thinks the active element is a cell or row when clicked instead of what has a true tab index.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        grid = window['kg'].gridManager.getGrid($(document.activeElement).closest(".kgGrid")[0]);
    } else {
        grid = window['kg'].gridManager.getGrid(document.activeElement);
    }
    if (grid != null && grid != undefined){
        if (grid.config.isMultiSelect) return;
        var old = grid.config.selectedItem();
        if (old != undefined) {
            old.isSelected(false);
            var items = grid.finalData();
            var n = items.length;
            var index = items.indexOf(old) + offset;
            if (index >= 0 && index < n) {
                var item = items[index];
                item.isSelected(true);
                grid.config.selectedItem(item);
                var itemtoView = document.getElementsByClassName("kgSelected");
                if (!Element.prototype.scrollIntoViewIfNeeded){
                    itemtoView[0].scrollIntoView(false);
                } else {
                    itemtoView[0].scrollIntoViewIfNeeded();
                }
            }
        }
    }
}; 
/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

$(document).click(function(e) {
    e = e || event;
	var closestGrid = $(e.target).closest(".kgGrid")[0] || $(e.srcElement).closest(".kgGrid")[0];
	if (closestGrid) $.lastClickedGrid = closestGrid;
});

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
	}
	var grid = window['kg'].gridManager.getGrid($.lastClickedGrid);
	if (grid != null && grid != undefined){
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
			}
		}
	}
}; 
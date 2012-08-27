// Class that manages all row selection logic
// @options - {
//      selectedItems - an observable array to keep in sync w/ the selected rows
//      selectedIndex - an observable to keep in sync w/ the index of the selected data item
//      data - (required) the observable array data source of data items
//  }
//
kg.SelectionManager = function (options, rowManager) {
    var self = this,
        isMulti = options.isMulti,
        dataSource = options.data, // the observable array datasource
        KEY = '__kg_selected__', // constant for the selection property that we add to each data item
        maxRows = ko.computed(function () {
            return dataSource().length;
        });
        
    this.selectedItems = options.selectedItems; //observableArray
    this.selectedIndex = options.selectedIndex; //observable
    this.lastClickedRow = options.lastClickedRow;
    
    this.changeSelection = function(rowItem, clickEvent){
        if (isMulti && clickEvent.shiftKey) {
            if(self.lastClickedRow()) {
                var thisIndx = rowManager.rowCache.indexOf(rowItem);
                var prevIndex = rowManager.rowCache.indexOf(self.lastClickedRow());
                if (thisIndx < prevIndex) {
                    thisIndx = thisIndx ^ prevIndex;
                    prevIndex = thisIndx ^ prevIndex;
                    thisIndx = thisIndx ^ prevIndex;
                }
                for (; prevIndex <= thisIndx; prevIndex++) {
                    rowManager.rowCache[prevIndex].selected(true);
                    //first see if it exists, if not add it
                    if (self.selectedItems.indexOf(rowManager.rowCache[prevIndex].entity()) === -1) {
                        self.selectedItems.push(rowManager.rowCache[prevIndex].entity());
                    }
                }
            }
            document.getSelection().removeAllRanges();
        } else if (isMulti && clickEvent.ctrlKey) {
            self.toggle(rowItem);
            document.getSelection().removeAllRanges();
        } else {
            utils.forEach(self.selectedItems(), function (item) {
                item.myRowEntity.selected(false);
            });
            self.selectedItems.removeAll();
            self.toggle(rowItem);
        }
        self.lastClickedRow(rowItem);
        return true;
    }
    
    this.toggle = function(item) {
        if (item.selected()) {
            item.selected(false);
            self.selectedItems.remove(item.entity());
        } else {
            item.selected(true);
            if (self.selectedItems.indexOf(item.entity()) === -1) {
                self.selectedItems.push(item.entity());
            }
        }
    };
    
    // the count of selected items (supports both multi and single-select logic
    this.selectedItemCount = ko.computed(function () {
        return self.selectedItems().length;
    });

    // ensures our selection flag on each item stays in sync
    this.selectedItems.subscribe(function (newItems) {
        var data = dataSource();

        if (!newItems) {
            newItems = [];
        }

        utils.forEach(data, function (item, i) {

            if (!item[KEY]) {
                item[KEY] = ko.observable(false);
            }

            if (ko.utils.arrayIndexOf(newItems, item) > -1) {
                //newItems contains the item
                item[KEY](true);
            } else {
                item[KEY](false);
            }

        });
    });

    this.lastSelectedItem = options.lastClickedRow;

    // writable-computed observable
    // @return - boolean indicating if all items are selected or not
    // @val - boolean indicating whether to select all/de-select all
    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (maxRows() === 0) {
                return false;
            }
            return cnt === maxRows();
        },
        write: function (val) {
            var checkAll = val,
            dataSourceCopy = [];
            utils.forEach(dataSource(), function (item) {
                dataSourceCopy.push(item);
            });
            if (checkAll) {
                self.selectedItems(dataSourceCopy);
            } else {

                self.selectedItems([]);

            }
        }
    });

    //make sure as the data changes, we keep the selectedItem(s) correct
    dataSource.subscribe(function (items) {
        var selectedItems,
            itemsToRemove;
        if (!items) {
            return;
        }
        
        //make sure the selectedItem(s) exist in the new data
        selectedItems = self.selectedItems();
        itemsToRemove = [];

        ko.utils.arrayForEach(selectedItems, function (item) {
            if (ko.utils.arrayIndexOf(items, item) < 0) {
                itemsToRemove.push(item);
            }
        });

        //clean out any selectedItems that don't exist in the new array
        if (itemsToRemove.length > 0) {
            self.selectedItems.removeAll(itemsToRemove);
        }
    });
}; 
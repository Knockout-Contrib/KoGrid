// Class that manages all row selection logic
// @options - {
//      selectedItems - an observable array to keep in sync w/ the selected rows
//      selectedIndex - an observable to keep in sync w/ the index of the selected data item
//      data - (required) the observable array data source of data items
//  }
//
kg.SelectionManager = function (options, rowManager) {
    var self = this,
        isMulti = options.isMulti || options.isMultiSelect,
        ignoreSelectedItemChanges = false, // flag to prevent circular event loops keeping single-select observable in sync
        dataSource = options.data, // the observable array datasource
        KEY = '__kg_selected__', // constant for the selection property that we add to each data item
        maxRows = ko.computed(function () {
            return dataSource().length;
        });
        
    this.selectedItem = options.selectedItem || ko.observable(); // observable
    this.selectedItems = options.selectedItems || ko.observableArray([]); //observableArray
    this.selectedIndex = options.selectedIndex; //observable
    this.lastClickedRow = options.lastClickedRow;

    // some subscriptions to keep the selectedItem in sync
    this.selectedItem.subscribe(function (val) {
        if (ignoreSelectedItemChanges)
            return;

        self.selectedItems([val]);
    });
    this.selectedItems.subscribe(function (vals) {
        ignoreSelectedItemChanges = true;

        self.selectedItem(vals ? vals[0] : null);

        ignoreSelectedItemChanges = false;
    });

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
                if (item && item.myRowEntity && item.myRowEntity.selected) {
                    item.myRowEntity.selected(false);
                }
            });
            self.selectedItems.removeAll();
            self.toggle(rowItem);
        }
        self.lastClickedRow(rowItem);
        return true;
    }
    
    // function to manage the selection action of a data item (entity)
    // just call this func and hand it the item you want to select (or de-select)
    // @changedEntity - the data item that you want to select/de-select
    this.changeSelectedItem = function (changedEntity) {
        var currentEntity = self.selectedItem(),
            currentItems = self.selectedItems,
            len = 0,
            keep = false;

        if (!isMulti) {
            //Single Select Logic

            //find out if the changed entity is selected or not
            if (changedEntity && changedEntity[KEY]) {
                keep = changedEntity[KEY]();
            }

            if (keep) {
                //set the new entity
                self.selectedItem(changedEntity);
            } else {
                //always keep a selected entity around
                changedEntity[KEY](true);
            }

        } else {
            //Multi-Select Logic
            len = currentItems().length;

            //if the changed entity was de-selected, remove it from the array
            if (changedEntity && changedEntity[KEY]) {
                keep = changedEntity[KEY]();
            }

            if (!keep) {
                currentItems.remove(changedEntity);
            } else {
                //first see if it exists, if not add it
                if (currentItems.indexOf(changedEntity) === -1) {
                    currentItems.push(changedEntity);
                }
            }
        }
    };

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
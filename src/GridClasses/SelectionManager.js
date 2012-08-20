// Class that manages all row selection logic
// @options - {
//      selectedItem - an observable to keep in sync w/ the selected data item
//      selectedItems - an observable array to keep in sync w/ the selected rows
//      selectedIndex - an observable to keep in sync w/ the index of the selected data item
//      data - (required) the observable array data source of data items
//  }
//
kg.SelectionManager = function (options) {
    var self = this,
        isMulti = options.isMultiSelect, // flag that indicates if grid supports mult-select or single-select mode
        dataSource = options.data, // the observable array datasource
        KEY = '__kg_selected__', // constant for the selection property that we add to each data item
        maxRows = ko.computed(function () {
            return dataSource().length;
        });

    this.selectedItem = options.selectedItem; //observable
    this.selectedItems = options.selectedItems; //observableArray
    this.selectedIndex = options.selectedIndex; //observable
    this.keepLastSelectedAround = options.keepLastSelectedAround;
    
    // the count of selected items (supports both multi and single-select logic
    this.selectedItemCount = ko.computed(function () {
        var single = self.selectedItem(),
            arr = self.selectedItems();

        if (!isMulti) {
            return (single !== null && single !== undefined) ? 1 : 0; //truthy statement
        } else {
            return arr.length;
        }
    });

    // ensure outgoing entity is de-selected
    this.selectedItem.subscribe(function (currentEntity) {
        if (!isMulti) {
            //uncheck the current entity
            if (currentEntity && currentEntity[KEY]) {
                currentEntity[KEY](false);
            }
        }
    }, self, "beforeChange");

    // ensure incoming entity has our selected flag
    this.selectedItem.subscribe(function (entity) {
        if (entity && !entity[KEY]) {
            entity[KEY] = ko.observable(true);
        } else if (entity) {
            entity[KEY](true);
        }
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
                if (self.keepLastSelectedAround){
                    changedEntity[KEY](true);
                } else {
                    self.selectedItem(undefined);
                }
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

    // writable-computed observable
    // @return - boolean indicating if all items are selected or not
    // @val - boolean indicating whether to select all/de-select all
    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (!isMulti) {
                return cnt === 1;
            }
            if (maxRows() === 0) {
                return false;
            }
            return cnt === maxRows();
        },
        write: function (val) {
            var checkAll = val,
                dataSourceCopy = [];

            if (isMulti) {
                utils.forEach(dataSource(), function (item) {
                    dataSourceCopy.push(item);
                });

                if (checkAll) {
                    self.selectedItems(dataSourceCopy);
                } else {
                    self.selectedItems([]);
                }
            }
        }
    });

    //make sure as the data changes, we keep the selectedItem(s) correct
    dataSource.subscribe(function (items) {
        var selectedItems,
            selectedItem,
            itemsToRemove;

        if (!items) {
            return;
        }

        //make sure the selectedItem/Items exist in the new data
        if (isMulti) {
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

        } else {
            selectedItem = self.selectedItem();

            if (selectedItem && ko.utils.arrayIndexOf(items, selectedItem) < 0) {
                self.selectedItem(items[0] ? items[0] : null);
            }
        }
    });
};
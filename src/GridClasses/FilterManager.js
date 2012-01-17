kg.FilterManager = function (options) {
    var self = this;

    //map of column.field values to filterStrings
    this.filterInfo = ko.observable();
    this.data = options.data; //observableArray

    this.filteredData = ko.computed(function () {
        var filterInfo = self.filterInfo(),
            data = self.data(),
            keepRow = false,
            match = true,
            field,
            itemData,
            itemDataStr,
            filterStr;

        if (!filterInfo || $.isEmptyObject(filterInfo)) {
            return data;
        }

        return ko.utils.arrayFilter(data, function (item) {

            //loop through each property and filter it
            for (field in filterInfo) {

                if (filterInfo.hasOwnProperty(field)) {
                    itemData = ko.utils.unwrapObservable(item[field]);
                    filterStr = filterInfo[field];

                    if (itemData && filterStr) {
                        if (typeof itemData === "string") {
                            itemDataStr = itemData.toUpperCase();
                            match = (itemDataStr.indexOf(filterStr) > -1);
                        } else {
                            itemDataStr = itemData.toString().toUpperCase();
                            match = (itemDataStr.indexOf(filterStr) > -1);
                        }
                    }
                }

                //supports "AND" filtering logic
                if (keepRow && !match) {
                    keepRow = false;
                } else if (!keepRow && match) {
                    keepRow = true; //should only catch on the first pass
                }

                //now if we catch anything thats not a match, break out of the loop
                if (!match) { break; }
            }

            //reset variables
            filterStr = null;
            itemData = null;
            itemDataStr = null;
            match = true;

            return keepRow;
        });

    });

    this.createFilterChangeCallback = function (col) {
        return function (newFilterVal) {
            var info = self.filterInfo();

            if (!info && !newFilterVal) {
                return;
            }

            //if we're still here, we may need to new up the info
            if (!info) { info = {}; }

            if ((newFilterVal === null ||
                newFilterVal === undefined ||
                newFilterVal === "") &&
                info[col.field]) { //null or undefined
                //smoke it so we don't loop through it for filtering anymore!
                delete info[col.field];

            } else if (newFilterVal !== null && newFilterVal !== undefined) {

                info[col.field] = newFilterVal;

            }
            self.filterInfo(info);
        };
    };
};
kg.SortManager = function (options) {
    var self = this,
        colSortFnCache = {},
        dateRE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/,
        ASC = "asc",
        DESC = "desc",
        prevSortInfo = {},
        dataSource = options.data; //observableArray

    this.sortInfo = options.sortInfo || ko.observable();

    this.guessSortFn = function (item) {
        var sortFn,
            itemStr,
            itemType,
            dateParts,
            month,
            day;

        if (item === undefined || item === null || item === '') {
            return null;
        }

        itemType = typeof (item);

        //check for numbers and booleans
        switch (itemType) {
            case "number":
                sortFn = self.sortNumber;
                break;
            case "boolean":
                sortFn = self.sortBool;
                break;
        }

        //if we found one, return it
        if (sortFn) {
            return sortFn;
        }

        //check if the item is a valid Date
        if (Object.prototype.toString.call(item) === '[object Date]') {
            return self.sortDate;
        }

        // if we aren't left with a string, we can't sort full objects...
        if (itemType !== "string") {
            return null;
        }

        // now lets string check..

        //check if the item data is a valid number
        if (item.match(/^-?[£$¤]?[\d,.]+%?$/)) {
            return self.sortNumberStr;
        }

        // check for a date: dd/mm/yyyy or dd/mm/yy 
        // can have / or . or - as separator
        // can be mm/dd as well
        dateParts = item.match(dateRE)
        if (dateParts) {
            // looks like a date
            month = parseInt(dateParts[1]);
            day = parseInt(dateParts[2]);
            if (month > 12) {
                // definitely dd/mm
                return self.sortDDMMStr;
            } else if (day > 12) {

                return self.sortMMDDStr;
            } else {
                // looks like a date, but we can't tell which, so assume that it's MM/DD
                return self.sortMMDDStr;
            }
        }

        //finally just sort the normal string...
        return self.sortAlpha;

    };

    this.sortNumber = function (a, b) {

        return a - b;
    };

    this.sortNumberStr = function (a, b) {
        var numA, numB;

        numA = parseFloat(a.replace(/[^0-9.-]/g, ''));
        if (isNaN(numA)) {
            numA = 0;
        }
        numB = parseFloat(b.replace(/[^0-9.-]/g, ''));
        if (isNaN(numB)) {
            numB = 0;
        }
        return numA - numB;
    };

    this.sortAlpha = function (a, b) {
        var strA = a.toUpperCase(),
            strB = b.toUpperCase();

        return strA == strB ? 0 : (strA < strB ? -1 : 1);
    };

    this.sortDate = function (a, b) {
        var timeA = a.getTime(),
            timeB = b.getTime();

        return timeA == timeB ? 0 : (timeA < timeB ? -1 : 1);
    };

    this.sortBool = function (a, b) {
        if (a && b) { return 0; }
        if (!a && !b) { return 0; }
        else { return a ? 1 : -1 }
    };

    this.sortDDMMStr = function (a, b) {
        var dateA, dateB, mtch,
            m, d, y;

        mtch = a.match(dateRE);
        y = mtch[3]; m = mtch[2]; d = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateA = y + m + d;
        mtch = b.match(dateRE);
        y = mtch[3]; m = mtch[2]; d = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateB = y + m + d;
        if (dateA == dateB) return 0;
        if (dateA < dateB) return -1;
        return 1;
    };

    this.sortMMDDStr = function (a, b) {
        var dateA, dateB, mtch,
            m, d, y;

        mtch = a.match(dateRE);
        y = mtch[3]; d = mtch[2]; m = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateA = y + m + d;
        mtch = b.match(dateRE);
        y = mtch[3]; d = mtch[2]; m = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateB = y + m + d;
        if (dateA == dateB) return 0;
        if (dateA < dateB) return -1;
        return 1;
    };


    this.sort = function (col, direction) {
        //do an equality check first
        if (col === prevSortInfo.column && direction === prevSortInfo.direction) {
            return;
        }

        //if its not equal, set the observable and kickoff the event chain
        self.sortInfo({
            column: col,
            direction: direction
        });
    };

    this.sortedData = ko.computed(function () {
        var data = dataSource(), //register dependency
            sortInfo = self.sortInfo(), //register dependency
            col,
            direction,
            sortFn,
            item,
            prop;

        if (!data || !sortInfo || options.useExternalSorting) {
            return data;
        }

        col = sortInfo.column;
        direction = sortInfo.direction;

        //see if we already figured out what to use to sort the column
        if (colSortFnCache[col.field]) {
            sortFn = colSortFnCache[col.field];
        } else { // try and guess what sort function to use
            item = dataSource()[0];

            if (item) {
                prop = ko.utils.unwrapObservable(item[col.field]);
            }

            sortFn = self.guessSortFn(prop);

            //cache it
            if (sortFn) {
                colSortFnCache[col.field] = sortFn;
            } else {
                return;
            }
        }

        //now actually sort the data
        data.sort(function (itemA, itemB) {
            var propA = ko.utils.unwrapObservable(itemA[col.field]),
                propB = ko.utils.unwrapObservable(itemB[col.field]);

            if (propA === null || propA === undefined && !propB) {
                return 0;
            }

            if (direction === ASC) {
                return sortFn(propA, propB);
            } else {
                return 0 - sortFn(propA, propB);
            }
        });

        return data;
    });
};
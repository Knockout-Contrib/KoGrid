/// <reference path="../../lib/jquery-1.8.2.min" />
/// <reference path="../../lib/angular.js" />
/// <reference path="../constants.js"/>
/// <reference path="../namespace.js" />
/// <reference path="../navigation.js"/>
/// <reference path="../utils.js"/>
/// <reference path="../classes/range.js"/>
window.kg.sortService = {
    colSortFnCache: {}, // cache of sorting functions. Once we create them, we don't want to keep re-doing it
    dateRE: /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/, // nasty regex for date parsing
    guessSortFn: function(item) {
        var sortFn, // sorting function that is guessed
            itemType, // the typeof item
            dateParts, // for date parsing
            month, // for date parsing
            day; // for date parsing

        if (item === undefined || item === null || item === '') {
            return null;
        } 
        itemType = typeof(item);
        //check for numbers and booleans
        switch (itemType) {
            case "number":
                sortFn = window.kg.sortService.sortNumber;
                break;
            case "boolean":
                sortFn = window.kg.sortService.sortBool;
                break;
            default:
                sortFn = undefined;
                break;
        }
        //if we found one, return it
        if (sortFn) {
            return sortFn;
        } 
        //check if the item is a valid Date
        if (Object.prototype.toString.call(item) === '[object Date]') {
            return window.kg.sortService.sortDate;
        } 
        // if we aren't left with a string, return a basic sorting function...
        if (itemType !== "string") {
            return window.kg.sortService.basicSort;
        } 
        // now lets string check..
        //check if the item data is a valid number
        if (item.match(/^-?[£$¤]?[\d,.]+%?$/)) {
            return window.kg.sortService.sortNumberStr;
        } 
        // check for a date: dd/mm/yyyy or dd/mm/yy
        // can have / or . or - as separator
        // can be mm/dd as well
        dateParts = item.match(window.kg.sortService.dateRE);
        if (dateParts) {
            // looks like a date
            month = parseInt(dateParts[1], 10);
            day = parseInt(dateParts[2], 10);
            if (month > 12) {
                // definitely dd/mm
                return window.kg.sortService.sortDDMMStr;
            } else if (day > 12) {
                return window.kg.sortService.sortMMDDStr;
            } else {
                // looks like a date, but we can't tell which, so assume that it's MM/DD
                return window.kg.sortService.sortMMDDStr;
            }
        }
        //finally just sort the normal string...
        return window.kg.sortService.sortAlpha;
    },
    basicSort: function(a, b) {
        if (a == b) {
            return 0;
        }
        if (a < b) {
            return -1;
        }
        return 1;
    },
    sortNumber: function(a, b) {
        return a - b;
    },
    sortNumberStr: function(a, b) {
        var numA,
            numB,
            badA = false,
            badB = false;
        numA = parseFloat(a.replace(/[^0-9.-]/g, ''));
        if (isNaN(numA)) {
            badA = true;
        }
        numB = parseFloat(b.replace(/[^0-9.-]/g, ''));
        if (isNaN(numB)) {
            badB = true;
        }
        // we want bad ones to get pushed to the bottom... which effectively is "greater than"
        if (badA && badB) {
            return 0;
        }
        if (badA) {
            return 1;
        }
        if (badB) {
            return -1;
        } 
        return numA - numB;
    },
    sortAlpha: function(a, b) {
        var strA = a.toLowerCase(),
            strB = b.toLowerCase();
        return strA == strB ? 0 : (strA < strB ? -1 : 1);
    },
    sortBool: function(a, b) {
        if (a && b) {
            return 0;
        }
        if (!a && !b) {
            return 0;
        } else {
            return a ? 1 : -1;
        }
    },
    sortDate: function(a, b) {
        var timeA = a.getTime(),
            timeB = b.getTime();
        return timeA == timeB ? 0 : (timeA < timeB ? -1 : 1);
    },
    sortDDMMStr: function(a, b) {
        var dateA, dateB, mtch, m, d, y;
        mtch = a.match(window.kg.sortService.dateRE);
        y = mtch[3];
        m = mtch[2];
        d = mtch[1];
        if (m.length == 1) {
            m = '0' + m;
        } 
        if (d.length == 1) {
            d = '0' + d;
        } 
        dateA = y + m + d;
        mtch = b.match(window.kg.sortService.dateRE);
        y = mtch[3];
        m = mtch[2];
        d = mtch[1];
        if (m.length == 1) {
            m = '0' + m;
        }
        if (d.length == 1) {
            d = '0' + d;
        }
        dateB = y + m + d;
        if (dateA == dateB) {
            return 0;
        }
        if (dateA < dateB) {
            return -1;
        }
        return 1;
    },
    sortMMDDStr: function(a, b) {
        var dateA, dateB, mtch, m, d, y;
        mtch = a.match(window.kg.sortService.dateRE);
        y = mtch[3];
        d = mtch[2];
        m = mtch[1];
        if (m.length == 1) {
            m = '0' + m;
        }
        if (d.length == 1) {
            d = '0' + d;
        }
        dateA = y + m + d;
        mtch = b.match(dateRE);
        y = mtch[3];
        d = mtch[2];
        m = mtch[1];
        if (m.length == 1) {
            m = '0' + m;
        }
        if (d.length == 1) {
            d = '0' + d;
        } 
        dateB = y + m + d;
        if (dateA == dateB) {
            return 0;
        } 
        if (dateA < dateB) {
            return -1;
        }
        return 1;
    },
    sortData: function (data /*datasource*/, sortInfo) {
        var unwrappedData = data();
        // first make sure we are even supposed to do work
        if (!unwrappedData || !sortInfo) {
            return;
        }
        // grab the metadata for the rest of the logic
        var col = sortInfo.column,
            direction = sortInfo.direction,
            sortFn,
            item;
        //see if we already figured out what to use to sort the column
        if (window.kg.sortService.colSortFnCache[col.field]) {
            sortFn = window.kg.sortService.colSortFnCache[col.field];
        } else if (col.sortingAlgorithm != undefined) {
            sortFn = col.sortingAlgorithm;
            window.kg.sortService.colSortFnCache[col.field] = col.sortingAlgorithm;
        } else { // try and guess what sort function to use
            item = unwrappedData[0];
            if (!item) {
                return;
            }
            sortFn = kg.sortService.guessSortFn(item[col.field]);
            //cache it
            if (sortFn) {
                window.kg.sortService.colSortFnCache[col.field] = sortFn;
            } else {
                // we assign the alpha sort because anything that is null/undefined will never get passed to
                // the actual sorting function. It will get caught in our null check and returned to be sorted
                // down to the bottom
                sortFn = window.kg.sortService.sortAlpha;
            }
        }
        //now actually sort the data
        unwrappedData.sort(function (itemA, itemB) {
            var propA = window.kg.utils.evalProperty(itemA, col.field);
            var propB = window.kg.utils.evalProperty(itemB, col.field);
            // we want to force nulls and such to the bottom when we sort... which effectively is "greater than"
            if (!propB && !propA) {
                return 0;
            } else if (!propA) {
                return 1;
            } else if (!propB) {
                return -1;
            }
            //made it this far, we don't have to worry about null & undefined
            if (direction === ASC) {
                return sortFn(propA, propB);
            } else {
                return 0 - sortFn(propA, propB);
            }
        });
        data(unwrappedData);
        return;
    },
    Sort: function (sortInfo, data) {
        if (window.kg.sortService.isSorting) {
            return;
        }
        window.kg.sortService.isSorting = true;
        window.kg.sortService.sortData(data, sortInfo);
        window.kg.sortService.isSorting = false;
    }
};
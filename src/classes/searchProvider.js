kg.SearchProvider = function (grid) {
    var self = this,
        searchConditions = [],
        lastSearchStr;
    self.extFilter = grid.config.filterOptions.useExternalFilter;
    self.showFilter = grid.config.showFilter;
    self.filterText = grid.config.filterOptions.filterText;
    self.throttle = grid.config.filterOptions.filterThrottle;
    self.fieldMap = {};
    self.evalFilter = function () {
        if (searchConditions.length === 0)
            grid.filteredData(grid.sortedData.peek());
        else {
            grid.filteredData(grid.sortedData.peek().filter(function (item) {
                if (item._destroy) {
                    return false;
                }

                for (var i = 0, len = searchConditions.length; i < len; i++) {
                    var condition = searchConditions[i];
                    //Search entire row
                    if (!condition.column) {
                        for (var prop in item) {
                            if (item.hasOwnProperty(prop)) {
                                var c = self.fieldMap[prop];
                                if (!c) continue;
                                var pVal = ko.utils.unwrapObservable(item[prop]);
                                if (pVal && (typeof c.cellFilter === 'function' ? condition.regex.test(ko.utils.unwrapObservable(c.cellFilter(typeof pVal === 'number' ? pVal : pVal.toString()))) : condition.regex.test(typeof pVal === 'object' ? evalObject(pVal, c.field).toString() : pVal.toString())))
                                    return true;
                            }
                        }
                        return false;
                    }
                    //Search by column.
                    var col = self.fieldMap[condition.column] || self.fieldMap[condition.columnDisplay];
                    if (!col) return false;
                    var value = ko.utils.unwrapObservable(item[condition.column]) || ko.utils.unwrapObservable(item[col.field]);
                    if (!value || !(typeof col.cellFilter === 'function' ? condition.regex.test(ko.utils.unwrapObservable(col.cellFilter(typeof value === 'number' ? value : value.toString()))) : condition.regex.test(typeof value === 'object' ? evalObject(value, col.field).toString() : value.toString())))
                        return false;
                }
                return true;
            }));
        }
        grid.rowFactory.filteredDataChanged();
    };

    //Traversing through the object to find the value that we want. If fail, then return the original object.
    var evalObject = function (obj, columnName) {
        if (typeof obj != 'object' || typeof columnName != 'string')
            return obj;
        var args = columnName.split('.');
        var cObj = obj;
        if (args.length > 1) {
            for (var i = 1, len = args.length; i < len; i++) {
                cObj = cObj[args[i]];
                if (!cObj)
                    return obj;
            }
            return cObj;
        }
        return obj;

    };
    var getRegExp = function (str, modifiers) {
        try {
            return new RegExp(str, modifiers);
        }
        catch (err) {
            //Escape all RegExp metacharacters.
            return new RegExp(str.replace(/(\^|\$|\(|\)|\<|\>|\[|\]|\{|\}|\\|\||\.|\*|\+|\?)/g, '\\$1'));
        }
    }
    var buildSearchConditions = function (a) {
        //reset.
        searchConditions = [];
        var qStr = '';
        if (!(qStr = $.trim(a))) {
            return;
        }
        var columnFilters = qStr.split(";");
        $.each(columnFilters, function (i, filter) {
            var args = filter.split(':');
            if (args.length > 1) {
                var columnName = $.trim(args[0]);
                var columnValue = $.trim(args[1]);
                if (columnName && columnValue) {
                    searchConditions.push({
                        column: columnName,
                        columnDisplay: columnName.replace(/\s+/g, '').toLowerCase(),
                        regex: getRegExp(columnValue, 'i'),
                    });
                }
            } else {
                var val = $.trim(args[0]);
                if (val) {
                    searchConditions.push({
                        column: '',
                        regex: getRegExp(val, 'i'),
                    });
                }
            }
        });
    };

    var filterTextComputed = ko.computed(function () {
        var a = self.filterText();
        if (!self.extFilter && a != lastSearchStr) {
            //To prevent circular dependency when throttle is enabled.
            lastSearchStr = a;
            buildSearchConditions(a);
            self.evalFilter();
        }
    });
    if (typeof self.throttle === 'number') {
        filterTextComputed.extend({ throttle: self.throttle });
    }
    if (!self.extFilter) {
        grid.columns.subscribe(function (a) {
            $.each(a, function (i, col) {
                //Just in the case that value being set is an object within an object e.g ParentObject.childObject.
                self.fieldMap[col.field.split('.')[0]] = col;
                self.fieldMap[col.displayName().toLowerCase().replace(/\s+/g, '')] = col;
            });
        });
    }
};

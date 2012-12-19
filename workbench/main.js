/// <reference path="../plugins/ng-grid-reorderable.js" />
/// <reference path="../ng-grid-1.0.0.debug.js" />
function mainViewModel() {
    var self = this;
    var checkmarkFilter = function (input) {
        return input ? '\u2714' : '\u2718';
    };
    var dateFilter = function (input) {
        return new Date(input);
    };
    self.mySelections = ko.observableArray([]);
    self.myData = ko.observableArray([]);
    self.filterOptions = {
        filterText: ko.observable(""),
        useExternalFilter: false
    };
    self.pagingOptions = {
        pageSizes: ko.observable([250, 500, 1000]), //page Sizes
        pageSize: ko.observable(250), //Size of Paging data
        totalServerItems: ko.observable(0), //how many items are on the server (for paging)
        currentPage: ko.observable(1) //what page they are currently on
    };
    self.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                data = largeLoad().filter(function (item) {
                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                });
            } else {
                data = largeLoad();
            }
            //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            self.myData(data);
            self.pagingOptions.totalServerItems(data.length);
        }, 100);
    };
    self.pagingOptions.pageSize.subscribe(function (a) {
        self.getPagedDataAsync(a, self.pagingOptions.currentPage(), self.filterOptions.filterText());
    });
    self.pagingOptions.currentPage.subscribe(function (a) {
        self.getPagedDataAsync(self.pagingOptions.pageSize(), a, self.filterOptions.filterText());
    });
    self.filterOptions.filterText.subscribe(function (a) {
        self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), a);
    });
    self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage());
    self.columnsChanged = function(newCols) {
        return true;
    };
    self.gridOptions = {
        data: self.myData,
        selectedItems: self.mySelections,
        displaySelectionCheckbox: true,
        multiSelect: true,
        showGroupPanel: true,
        showColumnMenu: true,
        showFilter: true,
        columnsChanged: self.columnsChanged,
        maintainColumnRatios: true,
        enablePaging: true,
        pagingOptions: self.pagingOptions,
        columnDefs: ko.observableArray( [{ field: 'name', displayName: 'Very Long Name Title', headerClass: 'foo', width: 'auto' },
                     { field: 'allowance', cellTemplate: 'partials/cellTemplate.html', width: 'auto' },
                     { field: 'birthday', cellFilter: dateFilter, width: 'auto' },
                     { field: 'paid', cellFilter: checkmarkFilter, width: 'auto' }])
    };
    self.btnClick = function () {
        alert(self.mySelections().length);
        self.gridOptions.columnDefs(undefined);
    };

}
ko.applyBindings(new mainViewModel())
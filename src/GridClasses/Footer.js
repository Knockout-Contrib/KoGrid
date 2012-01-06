kg.Footer = function (grid) {
    var self = this;

    this.maxRows = grid.maxRows; //observable
    this.selectedItemCount = grid.selectedItemCount; //observable

    this.pagerVisible = ko.observable(grid.config.enablePaging);
    this.selectedPageSize = ko.observable(grid.config.defaultPageSize);
    this.pageSizes = ko.observableArray(grid.config.pageSizes);
    this.currentPage = ko.observable(1);
    this.maxPages = ko.computed(function () {
        var maxCnt = self.maxRows(),
            pageSize = self.selectedPageSize();
        return Math.ceil(maxCnt / pageSize);
    });

    this.pageForward = function () {
        var page = self.currentPage();
        self.currentPage(Math.min(page + 1, self.maxPages()));

        if(page !== self.currentPage()){
            grid.pageChanged(page);
        }
    }

    this.pageBackward = function () {
        var page = self.currentPage();
        self.currentPage(Math.max(page - 1, 1));

        if(page !== self.currentPage()){
            grid.pageChanged(page);
        }
    };
};
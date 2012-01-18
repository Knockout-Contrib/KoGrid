kg.Footer = function (grid) {
    var self = this;

    this.maxRows = grid.maxRows; //observable
    this.selectedItemCount = grid.selectedItemCount; //observable

    this.pagerVisible = ko.observable(grid.config.enablePaging);
    this.selectedPageSize = grid.config.pageSize; //observable
    this.pageSizes = ko.observableArray(grid.config.pageSizes);
    this.currentPage = grid.config.currentPage; //observable
    this.maxPages = ko.computed(function () {
        var maxCnt = grid.config.totalServerItems() || 1,
            pageSize = self.selectedPageSize();
        return Math.ceil(maxCnt / pageSize);
    });

    this.pageForward = function () {
        var page = self.currentPage();
        self.currentPage(Math.min(page + 1, self.maxPages()));
    }

    this.pageBackward = function () {
        var page = self.currentPage();
        self.currentPage(Math.max(page - 1, 1));
    };
};
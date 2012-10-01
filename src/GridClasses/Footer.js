kg.Footer = function (grid) {
    var self = this;

    this.maxRows;

    if (grid.config.totalServerItems() !== null && grid.config.totalServerItems() !== undefined) {
        this.maxRows = grid.config.totalServerItems; //observable
    } else {
        this.maxRows = grid.maxRows; //observable
    }
    this.isMultiSelect = ko.observable(grid.config.canSelectRows && grid.config.isMultiSelect);
    this.selectedItemCount = grid.selectedItemCount; //observable

    this.footerVisible = grid.config.footerVisible;
    this.pagerVisible = ko.observable(grid.config.enablePaging);
    this.selectedPageSize = grid.config.pageSize; //observable
    this.pageSizes = ko.observableArray(grid.config.pageSizes);
    this.currentPage = grid.config.currentPage; //observable
    this.maxPages = ko.computed(function () {
        var maxCnt = self.maxRows() || 1,
            pageSize = self.selectedPageSize();
        return Math.ceil(maxCnt / pageSize);
    });

    this.protectedCurrentPage = ko.computed({
        read: function () {
            return self.currentPage();
        },
        write: function (page) {
            var pageInt = parseInt(page);
            if (!isNaN(pageInt) || (pageInt && pageInt <= self.maxPages() && pageInt > 0)) {
                self.currentPage(pageInt); //KO does an equality check on primitives before notifying subscriptions here
            }
        },
        owner: self
    });

    this.pageForward = function () {
        var page = self.currentPage();
        self.currentPage(Math.min(page + 1, self.maxPages()));
    }

    this.pageBackward = function () {
        var page = self.currentPage();
        self.currentPage(Math.max(page - 1, 1));
    };

    this.pageToFirst = function () {
        self.currentPage(1);
    };

    this.pageToLast = function () {
        var maxPages = self.maxPages();
        self.currentPage(maxPages);
    };

    this.canPageForward = ko.computed(function () {
        var curPage = self.currentPage();
        var maxPages = self.maxPages();
        return curPage < maxPages;
    });

    this.canPageBackward = ko.computed(function () {
        var curPage = self.currentPage();
        return curPage > 1;
    });
};
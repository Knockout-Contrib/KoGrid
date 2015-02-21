(function() {
    'use strict';
    /*global QUnit,kg,ko*/

    QUnit.module("Paging Tests");

    QUnit.test("Basic Paging Test", function(assert) {

        var currentPage = ko.observable(1),
            pageSize = ko.observable(500),
            totalServerItems = ko.observable(999);

        var ftr = new kg.Footer({
            maxRows: ko.observable(1000),
            selectedItemCount: ko.observable(0),
            config: {
                pageSizes: [250, 500, 100],
                currentPage: currentPage,
                pageSize: pageSize,
                totalServerItems: totalServerItems
            }
        });

        assert.ok(ftr, "Footer Instantiated");
        assert.equals(ftr.maxPages(), 2, "Calculated Correct Max Pages");
    });

    QUnit.test("Paging Forward Test", function(assert) {

        var currentPage = ko.observable(1),
            pageSize = ko.observable(500),
            totalServerItems = ko.observable(999);

        var ftr = new kg.Footer({
            maxRows: ko.observable(1000),
            selectedItemCount: ko.observable(0),
            config: {
                pageSizes: [250, 500, 100],
                currentPage: currentPage,
                pageSize: pageSize,
                totalServerItems: totalServerItems
            }
        });

        var pageForwardWasCalled = false;

        currentPage.subscribe(function () {
            pageForwardWasCalled = true;
        });

        ftr.pageForward();

        assert.ok(pageForwardWasCalled, "Page Forward was called");
        assert.equals(currentPage(), 2, "Current Page was increased");
    });

    QUnit.test("Paging Backward Test", function(assert) {

        var currentPage = ko.observable(2),
            pageSize = ko.observable(500),
            totalServerItems = ko.observable(999);

        var ftr = new kg.Footer({
            maxRows: ko.observable(1000),
            selectedItemCount: ko.observable(0),
            config: {
                pageSizes: [250, 500, 100],
                currentPage: currentPage,
                pageSize: pageSize,
                totalServerItems: totalServerItems
            }
        });

        var pageBackwardWasCalled = false;

        currentPage.subscribe(function () {
            pageBackwardWasCalled = true;
        });

        ftr.pageBackward();

        assert.ok(pageBackwardWasCalled, "Page Forward was called");
        assert.equals(currentPage(), 1, "Current Page was decreased");
    });
})();

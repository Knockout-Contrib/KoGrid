/// <reference path="qunit/qunit.js" />
/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />
/// <reference path="../koGrid.debug.js" />

module("Paging Tests");

test("Basic Paging Test", function () {

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

    ok(ftr, "Footer Instantiated");
    equals(ftr.maxPages(), 2, "Calculated Correct Max Pages");
});

test("Paging Forward Test", function () {

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

    ok(pageForwardWasCalled, "Page Forward was called");
    equals(currentPage(), 2, "Current Page was increased");
});

test("Paging Backward Test", function () {

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

    ok(pageBackwardWasCalled, "Page Forward was called");
    equals(currentPage(), 1, "Current Page was decreased");
});
/// <reference path="qunit/qunit.js" />
/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />
/// <reference path="../koGrid.debug.js" />

window.getSortingTestData = function () {
    return ko.observableArray([
        { 'sortIndex': 1, 'Sku': ko.observable('abcde'), 'Vendor': 'NEWB', 'ID': 5, 'SeasonCode': '110', 'Mfg_Id': ko.observable('573-9880954'), 'UPC': '822860449228', CreatedOn: new Date("12/4/1993"), ModOn: "12/4/1977" },
        { 'sortIndex': 2, 'Sku': ko.observable('cdefg'), 'Vendor': 'NIKE', 'ID': 8, 'SeasonCode': '11', 'Mfg_Id': ko.observable('780-8855467'), 'UPC': '043208523549', CreatedOn: new Date("12/4/1997"), ModOn: "1/1/1985" },
        { 'sortIndex': 3, 'Sku': ko.observable('CDFGH'), 'Vendor': 'REEB', 'ID': 12, 'SeasonCode': '1293', 'Mfg_Id': ko.observable('355-6906843'), 'UPC': '229487568922', CreatedOn: new Date("5/4/1993"), ModOn: "05/3/2011" },
        { 'sortIndex': 4, 'Sku': ko.observable('ACDEF'), 'Vendor': 'ADID', 'ID': 2, 'SeasonCode': '6283', 'Mfg_Id': ko.observable('861-4929378'), 'UPC': '644134774391', CreatedOn: new Date("12/2/1997"), ModOn: "2/2/2001" },
        { 'sortIndex': 5, 'Sku': ko.observable('GJHLH'), 'Vendor': 'ASIC', 'ID': 49, 'SeasonCode': null, 'Mfg_Id': ko.observable('566-6546541'), 'UPC': '229487568922', CreatedOn: new Date("5/5/1993"), ModOn: "05/2/2011" },
        { 'sortIndex': 6, 'Sku': ko.observable(), 'Vendor': 'BROOK', 'ID': 17, 'SeasonCode': '', 'Mfg_Id': ko.observable('654-6565646'), 'UPC': null, CreatedOn: new Date("12/3/1997"), ModOn: undefined }
    ]);
};

module("Sorting Tests");

test("No Sorting Test", function () {
    var testData = getSortingTestData();

    var mgr = new kg.SortManager({
        data: testData
    });
    
    ok(mgr, "Sort Manager Instantiated");
    equals(mgr.sortedData().length, 6, "No Sorting returns correct data");
});

test("Basic Sorting Test", function () {

    var testData = getSortingTestData();

    var mgr = new kg.SortManager({
        data: testData
    });

    mgr.sort({ field: 'ID' }, "asc");

    ok(mgr, "Sort Manager Instantiated");
    equals(testData()[0].sortIndex, 4, "Sorted By ID Column correctly");
});

test("Number Sorting Test", function () {

    var testData = getSortingTestData();

    var mgr = new kg.SortManager({
        data: testData
    });

    mgr.sort({ field: 'ID' }, "asc");

    equals(testData()[0].sortIndex, 4, "First Item is correct");
    equals(testData()[5].sortIndex, 5, "Last Item is correct");
});

test("Obs String Sorting Test", function () {

    var testData = getSortingTestData();

    var mgr = new kg.SortManager({
        data: testData
    });

    mgr.sort({ field: 'Sku' }, "asc");

    equals(testData()[0].sortIndex, 1, "First Item is correct");
    equals(testData()[5].sortIndex, 6, "Last Item is correct"); // null items are sorted to last
});

test("Number String Sorting Test", function () {

    var testData = getSortingTestData();

    var mgr = new kg.SortManager({
        data: testData
    });

    mgr.sort({ field: 'SeasonCode' }, "asc");

    equals(testData()[0].sortIndex, 2, "First Item is correct");
    equals(testData()[4].sortIndex, 5, "Empty String is greater than null for our logic in this case");
    equals(testData()[5].sortIndex, 6, "Last Item is correct");
});

test("Date Sorting Test", function () {

    var testData = getSortingTestData();

    var mgr = new kg.SortManager({
        data: testData
    });

    mgr.sort({ field: 'CreatedOn' }, "asc");

    equals(testData()[0].sortIndex, 3, "First Item is correct");
    equals(testData()[5].sortIndex, 2, "Last Item is correct");
});

test("Date String Sorting Test", function () {

    var testData = getSortingTestData();

    var mgr = new kg.SortManager({
        data: testData
    });

    mgr.sort({ field: 'ModOn' }, "desc");

    equals(testData()[0].sortIndex, 3, "First Item is correct");
    equals(testData()[5].sortIndex, 6, "Last Item is correct");
});

test("Ensure sortInfo gets called", function () {

    var testData = getSortingTestData();
    var mySortInfo = ko.observable();
    var gotCalled = false;

    mySortInfo.subscribe(function () {
        gotCalled = true;
    });

    var mgr = new kg.SortManager({
        data: testData,
        sortInfo: mySortInfo
    });

    mgr.sort({ field: 'ModOn' }, "desc");

    ok(gotCalled, "Sort Info Subscription was called");
});


test("Use External Sorting Ignores Internal Sorting", function () {

    var testData = getSortingTestData();
    var mySortInfo = ko.observable();
    var gotCalled = false;

    mySortInfo.subscribe(function () {
        gotCalled = true;
    });

    var mgr = new kg.SortManager({
        data: testData,
        sortInfo: mySortInfo,
        useExternalSorting: true
    });

    mgr.sort({ field: 'ModOn' }, "desc");

    ok(gotCalled, "Sort Info Subscription was called");
    equals(testData()[0].sortIndex, 1, "First Item is correct");    
});
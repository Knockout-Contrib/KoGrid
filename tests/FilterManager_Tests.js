/// <reference path="qunit/qunit.js" />
/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />
/// <reference path="../koGrid.debug.js" />

window.getFilteringTestData = function () {
    return ko.observableArray([
        { 'Sku': ko.observable('C-2820164'), 'Vendor': 'NEWB', 'SeasonCode': '542', 'Mfg_Id': ko.observable('573-9880954'), 'UPC': '822860449228' },
        { 'Sku': ko.observable('J-8555462'), 'Vendor': 'NIKE', 'SeasonCode': '3935', 'Mfg_Id': ko.observable('780-8855467'), 'UPC': '043208523549' },
        { 'Sku': ko.observable('K-5312708'), 'Vendor': 'REEB', 'SeasonCode': '1293', 'Mfg_Id': ko.observable('355-6906843'), 'UPC': '229487568922' },
        { 'Sku': ko.observable('W-4295255'), 'Vendor': 'REEB', 'SeasonCode': '6283', 'Mfg_Id': ko.observable('861-4929378'), 'UPC': '644134774391' }
    ]);
};


module("Filtering Tests");

test("No Filtered Data Test", function () {

    var data = getFilteringTestData();

    var manager = new kg.FilterManager({ data: data });

    ok(manager, 'Manager Instantiated!');
    equals(manager.filteredData().length, 4, 'Defaults to no Filtering!'); 
});

test("1 Column Filtering", function () {

    var data = getFilteringTestData();

    var manager = new kg.FilterManager({ data: data });

    manager.filterInfo({ 'Sku': 'C-28201' });

    equals(manager.filteredData()[0].Sku(), 'C-2820164', 'Filtering 1 Column returns correct item'); //4 columns bc of RowIndex and Selected
    equals(manager.filteredData().length, 1, 'Filtered Data is only 1 item, which matches filter correctly');
});

test("Filter Reset", function () {

    var data = getFilteringTestData();

    var manager = new kg.FilterManager({ data: data });

    manager.filterInfo({ 'Sku': "" });

    equals(manager.filteredData()[0].Sku(), 'C-2820164', 'First Object is correct'); //4 columns bc of RowIndex and Selected
    equals(manager.filteredData().length, 4, 'Filtered Data is full original length');
});

test("2 Column Filtering", function () {

    var data = getFilteringTestData();

    var manager = new kg.FilterManager({ data: data });

    manager.filterInfo({ 'Sku': 'C-28201' });

    equals(manager.filteredData()[0].Sku(), 'C-2820164', 'Filtering 1 Column returns correct item'); //4 columns bc of RowIndex and Selected
    equals(manager.filteredData().length, 1, 'Filtered Data is only 1 item, which matches filter correctly');

    manager.filterInfo({ 'Sku': '5', 'Vendor': 'REE' });

    equals(manager.filteredData().length, 2, 'Filtered Data should only be 2 items, which matches filter correctly');

});

test("1 Column Callback Filtering", function () {

    var data = getFilteringTestData();

    var manager = new kg.FilterManager({ data: data });

    var skuCallback = manager.createFilterChangeCallback({ field: 'Sku' });
    
    skuCallback('C-28201');

    equals(manager.filteredData()[0].Sku(), 'C-2820164', 'Filtering 1 Column returns correct item'); //4 columns bc of RowIndex and Selected
    equals(manager.filteredData().length, 1, 'Filtered Data is only 1 item, which matches filter correctly');
});

test("2 Column Callback Filtering", function () {

    var data = getFilteringTestData();

    var manager = new kg.FilterManager({ data: data });

    var skuCallback = manager.createFilterChangeCallback({ field: 'Sku' });
    var vendorCallback = manager.createFilterChangeCallback({ field: 'Vendor' });

    skuCallback('5');

    equals(manager.filteredData()[0].Sku(), 'J-8555462', 'Filtering 1 Column returns correct first item'); //4 columns bc of RowIndex and Selected
    equals(manager.filteredData().length, 3, 'Filtered Data is only 3 items, which matches filter correctly');

    vendorCallback('REE');

    equals(manager.filteredData()[0].Sku(), 'K-5312708', 'Returns Correct first item'); //4 columns bc of RowIndex and Selected
    equals(manager.filteredData().length, 2, 'Filtered Data should only be 2 items, which matches filter correctly');

});

test("setting filter info to empty object clears out filter", function () {
    var data = getFilteringTestData();

    var manager = new kg.FilterManager({ data: data });

    var skuCallback = manager.createFilterChangeCallback({ field: 'Sku' });
    var vendorCallback = manager.createFilterChangeCallback({ field: 'Vendor' });

    skuCallback('5');
    vendorCallback('REE');

    equals(manager.filteredData()[0].Sku(), 'K-5312708', 'Returns Correct first item'); //4 columns bc of RowIndex and Selected
    equals(manager.filteredData().length, 2, 'Filtered Data should only be 2 items, which matches filter correctly');

    manager.filterInfo({});

    equals(manager.filteredData().length, 4, 'Filtered Data should be reset back to 4 items');
});

test("Ensure FilterInfo gets called back", function () {

    var data = getFilteringTestData();
    var myFilterInfo = ko.observable();
    var gotCalled = false;

    myFilterInfo.subscribe(function () {
        gotCalled = true;
    });

    var manager = new kg.FilterManager({
        data: data,
        filterInfo: myFilterInfo
    });

    var skuCallback = manager.createFilterChangeCallback({ field: 'Sku' });

    skuCallback('5');

    ok(gotCalled, "Filter Info was called back");
});

test("External Filtering ignores internal filtering", function () {

    var data = getFilteringTestData();
    var myFilterInfo = ko.observable();
    var gotCalled = false;

    myFilterInfo.subscribe(function () {
        gotCalled = true;
    });

    var manager = new kg.FilterManager({
        data: data,
        filterInfo: myFilterInfo,
        useExternalFiltering: true
    });

    var skuCallback = manager.createFilterChangeCallback({ field: 'Sku' });

    skuCallback('5');

    ok(gotCalled, "Filter Info was called back");
    equals(manager.filteredData()[0].Sku(), 'C-2820164', 'Returns Correct first item'); //4 columns bc of RowIndex and Selected
    
});
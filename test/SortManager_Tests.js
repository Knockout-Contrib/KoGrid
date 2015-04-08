(function() {
    'use strict';
    /*global QUnit,kg,ko*/

    function getSortingTestData() {
        return ko.observableArray([
            {
                'sortIndex': 1,
                'Sku': ko.observable('abcde'),
                'Vendor': 'NEWB',
                'ID': 5,
                'SeasonCode': '110',
                'Mfg_Id': ko.observable('573-9880954'),
                'UPC': '822860449228',
                CreatedOn: new Date('12/4/1993'),
                ModOn: '12/4/1977'
            },
            {
                'sortIndex': 2,
                'Sku': ko.observable('cdefg'),
                'Vendor': 'NIKE',
                'ID': 8,
                'SeasonCode': '11',
                'Mfg_Id': ko.observable('780-8855467'),
                'UPC': '043208523549',
                CreatedOn: new Date('12/4/1997'),
                ModOn: '1/1/1985'
            },
            {
                'sortIndex': 3,
                'Sku': ko.observable('CDFGH'),
                'Vendor': 'REEB',
                'ID': 12,
                'SeasonCode': '1293',
                'Mfg_Id': ko.observable('355-6906843'),
                'UPC': '229487568922',
                CreatedOn: new Date('5/4/1993'),
                ModOn: '05/3/2011'
            },
            {
                'sortIndex': 4,
                'Sku': ko.observable('ACDEF'),
                'Vendor': 'ADID',
                'ID': 2,
                'SeasonCode': '6283',
                'Mfg_Id': ko.observable('861-4929378'),
                'UPC': '644134774391',
                CreatedOn: new Date('12/2/1997'),
                ModOn: '2/2/2001'
            },
            {
                'sortIndex': 5,
                'Sku': ko.observable('GJHLH'),
                'Vendor': 'ASIC',
                'ID': 49,
                'SeasonCode': null,
                'Mfg_Id': ko.observable('566-6546541'),
                'UPC': '229487568922',
                CreatedOn: new Date('5/5/1993'),
                ModOn: '05/2/2011'
            },
            {
                'sortIndex': 6,
                'Sku': ko.observable(),
                'Vendor': 'BROOK',
                'ID': 17,
                'SeasonCode': '',
                'Mfg_Id': ko.observable('654-6565646'),
                'UPC': null,
                CreatedOn: new Date('12/3/1997'),
                ModOn: undefined
            }
        ]);
    }

    function createTestGrid(config) {
        var $testElement = $('<div data-bind="koGrid: gridOptions"></div>');
        $('#qunit-fixture').append($testElement);
        ko.applyBindings({ gridOptions: config }, $testElement[0]);

        var $gridElement = $testElement.children().first();
        var gridInstance = ko.dataFor($gridElement[0]);

        return {
            gridInstance: gridInstance,
            $gridElement: $gridElement
        };
    }


    QUnit.module('Sorting Tests', {
        beforeEach: function() {
            Object.keys(kg.sortService.colSortFnCache).forEach(function(key) {
                delete kg.sortService.colSortFnCache[key];
            });
        },
        afterEach: function() {
            ko.cleanNode(document.querySelector('#qunit-fixture'));
        }
    });

    QUnit.test('sortService is available', function(assert) {
        assert.ok(kg.sortService);
        assert.equal(kg.sortService.dateRE.source, /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/.source);
    });

    QUnit.test('Basic Sorting Test', function(assert) {

        var testData = getSortingTestData();

        // Ascending sort test
        kg.sortService.sortData(testData, { column: { field: 'ID' }, direction: 'asc' });
        assert.equal(testData()[0].sortIndex, 4);
        assert.equal(testData()[5].sortIndex, 5);

        // Descending sort test
        kg.sortService.sortData(testData, { column: { field: 'ID' }, direction: 'desc' });
        assert.equal(testData()[0].sortIndex, 5);
        assert.equal(testData()[5].sortIndex, 4);
    });

    QUnit.test('Sorting by observable property works', function(assert) {

        var testData = getSortingTestData();

        kg.sortService.sortData(testData, { column: { field: 'Sku' }, direction: 'asc' });
        assert.equal(testData()[0].sortIndex, 4);
        assert.equal(testData()[5].sortIndex, 6); // null items are sorted to last
    });

    QUnit.test('Number String sorting works', function(assert) {

        var testData = getSortingTestData();

        kg.sortService.sortData(testData, { column: { field: 'SeasonCode' }, direction: 'asc' });
        assert.equal(testData()[0].sortIndex, 2);
        assert.equal(testData()[4].sortIndex, 5, 'Empty String is greater than null for our logic in this case');
        assert.equal(testData()[5].sortIndex, 6, 'Last Item is correct');
    });

    QUnit.test('Date sorting works', function(assert) {

        var testData;

        // Ascending
        testData = getSortingTestData();
        kg.sortService.sortData(testData, { column: { field: 'CreatedOn' }, direction: 'asc' });
        assert.equal(testData()[0].sortIndex, 3);
        assert.equal(testData()[5].sortIndex, 2);

        // Descending
        testData = getSortingTestData();
        kg.sortService.sortData(testData, { column: { field: 'CreatedOn' }, direction: 'desc' });
        assert.equal(testData()[0].sortIndex, 2);
        assert.equal(testData()[5].sortIndex, 3);
    });

    QUnit.test('Date String Sorting Test', function(assert) {

        var testData;

        // Ascending
        testData = getSortingTestData();
        kg.sortService.sortData(testData, { column: { field: 'ModOn' }, direction: 'asc' });
        assert.equal(testData()[0].sortIndex, 1);
        assert.equal(testData()[5].sortIndex, 6);

        // Descending
        testData = getSortingTestData();
        kg.sortService.sortData(testData, { column: { field: 'ModOn' }, direction: 'desc' });
        assert.equal(testData()[0].sortIndex, 3);
        assert.equal(testData()[5].sortIndex, 6);
    });

    QUnit.test('Custom sorting algorithm is used', function(assert) {

        function compareByID(first, second) {
            if (first === second) {
                return 0;
            }
            return first < second ? -1 : 1;
        }

        var testData;

        // Ascending
        testData = getSortingTestData();
        kg.sortService.sortData(testData, {
            column: { field: 'ID', sortingAlgorithm: compareByID },
            direction: 'asc'
        });
        assert.equal(testData()[0].sortIndex, 4);
        assert.equal(testData()[5].sortIndex, 5);

        // Descending
        testData = getSortingTestData();
        kg.sortService.sortData(testData, {
            column: { field: 'ID', sortingAlgorithm: compareByID },
            direction: 'desc'
        });
        assert.equal(testData()[0].sortIndex, 5);
        assert.equal(testData()[5].sortIndex, 4);
    });

    QUnit.test('Using external sorting ignores internal sorting', function(assert) {
        assert.expect(1);

        var testData = getSortingTestData();
        var sortInfo = ko.observable();

        createTestGrid({
            data: testData,
            sortInfo: ko.observable(),
            useExternalSorting: true
        });

        sortInfo.subscribe(function(value) {
            assert.equal(value, { column: { field: ID }, direction: 'asc' });
        });

        assert.equal(testData()[0].sortIndex, 1);
    });
})();

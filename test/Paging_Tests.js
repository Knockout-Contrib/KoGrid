(function() {
    'use strict';
    /*global QUnit,kg,ko*/

    QUnit.module('Paging Tests', {
        afterEach: function() {
            ko.cleanNode(document.querySelector('#qunit-fixture'));
        }
    });

    QUnit.test('Pagination defaults are set', function(assert) {

        var fixture = createTestGrid({
            data: ko.observableArray([{prop1: '1', prop2: '2'}])
        });

        var gridInstance = fixture.gridInstance;
        assert.strictEqual(gridInstance.enablePaging, false);
        assert.deepEqual(gridInstance.pagingOptions.pageSizes(), [250, 500, 1000]);
        assert.equal(gridInstance.pagingOptions.pageSize(), 250);
        assert.strictEqual(gridInstance.pagingOptions.totalServerItems(), 0);
        assert.strictEqual(gridInstance.pagingOptions.currentPage(), 1);

        var $gridElement = fixture.$gridElement;
        assert.strictEqual($gridElement.find('.kgFooterPanel > .kgPagerContainer').length, 1);
        assert.strictEqual($gridElement.find('.kgFooterPanel > .kgPagerContainer').is(':visible'), false);
    });

    QUnit.test('Pagination is set from options', function(assert) {

        var pagingOptions = {
            pageSizes: ko.observableArray([250, 500, 1000]), //page Sizes
            pageSize: ko.observable(250), //Size of Paging data
            totalServerItems: ko.observable(0), //how many items are on the server (for paging)
            currentPage: ko.observable(1) //what page they are currently on
        };

        var fixture = createTestGrid({
            data: ko.observableArray([{prop1: '1', prop2: '2'}]),
            enablePaging: true,
            pagingOptions: pagingOptions
        });

        var gridInstance = fixture.gridInstance;
        pagingOptions.totalServerItems(510);

        assert.strictEqual(gridInstance.enablePaging, true);
        assert.equal(gridInstance.pagingOptions.totalServerItems(), 510);
        assert.equal(gridInstance.maxPages(), 3);
        assert.equal(gridInstance.cantPageForward(), false);
        assert.equal(gridInstance.cantPageBackward(), true);

        var $gridElement = fixture.$gridElement;
        var $currentPageElement = $gridElement.find('.kgFooterPanel .kgPagerContainer .kgPagerCurrent');

        assert.strictEqual($currentPageElement.val(), '1');

        gridInstance.pageForward();
        assert.strictEqual($currentPageElement.val(), '2');
        assert.strictEqual(pagingOptions.currentPage(), 2);

        gridInstance.pageToLast();
        assert.strictEqual($currentPageElement.val(), '3');
        assert.strictEqual(pagingOptions.currentPage(), 3);

        gridInstance.pageBackward();
        assert.strictEqual($currentPageElement.val(), '2');
        assert.strictEqual(pagingOptions.currentPage(), 2);

        gridInstance.pageToFirst();
        assert.strictEqual($currentPageElement.val(), '1');
        assert.strictEqual(pagingOptions.currentPage(), 1);
    });

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
})();

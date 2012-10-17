/// <reference path="qunit/qunit.js" />

module("Template Manager Tests");

test("Grid Template - Generates Single Grid Inner Template", function () {

    kg.templateManager.ensureGridTemplates({}); //empty object will force only grid template to get generated;

    var el = kg.templateManager.getTemplate('koGridTmpl');

    ok(el, 'Grid Inner Template was generated!');
});

test("Row Template - is generated", function () {

    kg.templateManager.ensureGridTemplates({
        rowTemplate: 'testRowTemplate',
        columns: [{ field: 'test1' }, { field: 'test2'}]
    }); //empty object will force only grid template to get generated;

    var el = kg.templateManager.getTemplate('testRowTemplate');

    ok(el, 'Row Template was generated!');
});

test("Get Template Text Test", function () {

    var txt = kg.templateManager.getTemplate('testRowTemplate');

    ok(txt, "Template Text retrieved correctly: " + txt);
});
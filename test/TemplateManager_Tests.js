(function() {
    'use strict';
    /*global QUnit,kg*/

    QUnit.module("Template Manager Tests");

    QUnit.test("Grid Template - Generates Single Grid Inner Template", function(assert) {

        kg.templateManager.ensureGridTemplates({}); //empty object will force only grid template to get generated;

        var el = kg.templateManager.getTemplate('koGridTmpl');

        assert.ok(el, 'Grid Inner Template was generated!');
    });

    QUnit.test("Row Template - is generated", function(assert) {

        kg.templateManager.ensureGridTemplates({
            rowTemplate: 'testRowTemplate',
            columns: [{ field: 'test1' }, { field: 'test2'}]
        }); //empty object will force only grid template to get generated;

        var el = kg.templateManager.getTemplate('testRowTemplate');

        assert.ok(el, 'Row Template was generated!');
    });

    QUnit.test("Get Template Text Test", function(assert) {

        var txt = kg.templateManager.getTemplate('testRowTemplate');

        assert.ok(txt, "Template Text retrieved correctly: " + txt);
    });
})();

kg.templateManager = (new function () {
    var self = this;
    self.templateCache = {};
    
    self.templateExists = function (tmplId) {
        var el = self.templateCache[tmplId];
        return (el !== undefined && el !== null);
    };

    self.addTemplate = function (templateText, tmplId) {
        self.templateCache[tmplId] = kg.utils.makeTemplate(tmplId, templateText);
    };
    
    this.removeTemplate = function (tmplId){
        delete self.templateCache[tmplId];
    };
    
    this.addTemplateSafe = function (tmplId, templateText) {
        if (!self.templateExists(tmplId)) {
            self.addTemplate(templateText , tmplId);
        }
    };

    this.ensureGridTemplates = function (options) {

        //first ensure the koGrid template!
        self.addTemplateSafe(GRID_TEMPLATE, kg.templates.defaultGridInnerTemplate(options));

        //header row template
        var template;
        if (options.headerTemplate) {
            template = self.getTemplateFromDom(options.headerTemplate) || kg.templates.generateHeaderTemplate(options);
            self.addTemplateSafe(options.headerTemplate, template);
        }

        //header cell template
        if (options.headerCellTemplate) {
            template = self.getTemplateFromDom(options.headerCellTemplate) || kg.templates.defaultHeaderCellTemplate(options);
            self.addTemplateSafe(options.headerCellTemplate, template);
        }

        //row template
        if (options.rowTemplate) {
            template = self.getTemplateFromDom(options.rowTemplate) || kg.templates.generateRowTemplate(options);
            self.addTemplateSafe(options.rowTemplate, template);
        }

        //footer template
        if (options.footerTemplate) {
            template = self.getTemplateFromDom(options.footerTemplate) || kg.templates.defaultFooterTemplate(options);
            self.addTemplateSafe(options.footerTemplate, template);
        }
    };

    this.getTemplate = function (tmplId) {
        return self.templateCache[tmplId] || "";
    };
    
    this.getTemplateFromDom = function(templId){
        var temp = document.getElementById(templId);
        return temp ? temp.innerHTML : undefined;
    };
} ());
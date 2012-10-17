kg.templateManager = (new function () {
    var self = this;
    self.templateCache = {};
    
    self.templateExists = function (tmplId) {
        var el = self.templateCache[tmplId];
        return (el !== undefined && el !== null);
    };

    self.addTemplate = function (templateText, tmplId) {
        self.templateCache[tmplId] = templateText;
    };
    
    this.removeTemplate = function (tmplId){
        delete self.templateCache[tmplId];
    };
    
    this.addTemplateSafe = function (tmplId, templateText) {
        if (!self.templateExists(tmplId)) {
            self.addTemplate(templateText, tmplId);
        }
    };

    this.ensureGridTemplates = function (options) {
        var defaults = {
            rowTemplate: '',
            headerTemplate: '',
            headerCellTemplate: '',
            footerTemplate: '',
            columns: null,
            showFilter: true
        },
            config = $.extend(defaults, options);

        //first ensure the koGrid template!
        self.addTemplateSafe(GRID_TEMPLATE, kg.templates.defaultGridInnerTemplate(config));

        //header row template
        if (config.headerTemplate) {
            var template = self.getTemplateFromDom(config.headerTemplate) || kg.templates.generateHeaderTemplate(config);
            self.addTemplateSafe(config.headerTemplate, template);
        }

        //header cell template
        if (config.headerCellTemplate) {
            var template = self.getTemplateFromDom(config.headerCellTemplate) || kg.templates.defaultHeaderCellTemplate(config);
            self.addTemplateSafe(config.headerCellTemplate, template);
        }

        //row template
        if (config.rowTemplate) {
            var template = self.getTemplateFromDom(config.rowTemplate) || kg.templates.generateRowTemplate(config);
            self.addTemplateSafe(config.rowTemplate, template);
        }

        //footer template
        if (config.footerTemplate) {
            var template = self.getTemplateFromDom(config.footerTemplate) || kg.templates.defaultFooterTemplate(config);
            self.addTemplateSafe(config.footerTemplate, template);
        }
    };

    this.getTemplateText = function (tmplId) {
        return self.templateCache[tmplId] || "";
    };
    
    this.getTemplateFromDom = function(templId){
        var temp = document.getElementById(templId);
        return temp ? temp.innerHTML : undefined;
    };
} ());
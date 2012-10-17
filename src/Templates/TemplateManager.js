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
    
    this.addTemplateSafe = function (tmplId, templateTextAccessor) {
        if (!self.templateExists(tmplId)) {
            self.addTemplate(templateTextAccessor(), tmplId);
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
        self.addTemplateSafe(GRID_TEMPLATE,  function () {
                return kg.templates.defaultGridInnerTemplate(config);
            });

        //header row template
        if (config.headerTemplate) {
            self.addTemplateSafe(config.headerTemplate, function () {
                return kg.templates.generateHeaderTemplate(config);
            });
        }

        //header cell template
        if (config.headerCellTemplate) {
            self.addTemplateSafe(config.headerCellTemplate, function () {
                return kg.templates.defaultHeaderCellTemplate(config);
            });
        }

        //row template
        if (config.rowTemplate) {
            self.addTemplateSafe(config.rowTemplate, function () {
                return kg.templates.generateRowTemplate(config);
            });
        }

        //footer template
        if (config.footerTemplate) {
            self.addTemplateSafe(config.footerTemplate, function () {
                return kg.templates.defaultFooterTemplate(config);
            });
        }
    };

    this.getTemplateText = function (tmplId) {
        return self.templateCache[tmplId] || "";
    };

} ());
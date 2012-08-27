kg.templateManager = (new function () {
    var self = this;

    var templateExists = function (tmplId) {
        var el = document.getElementById(tmplId);
        return (el !== undefined && el !== null);
    };

    var addTemplate = function (templateText, tmplId) {
        var tmpl = document.createElement("SCRIPT");
        tmpl.type = "text/html";
        tmpl.id = tmplId;

        //        'innerText' in tmpl ? tmpl.innerText = templateText
        //                            : tmpl.textContent = templateText;

        tmpl.text = templateText;

        document.body.appendChild(tmpl);
    };

    this.addTemplateSafe = function (tmplId, templateTextAccessor) {
        if (!templateExists(tmplId)) {
            addTemplate(templateTextAccessor(), tmplId);
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
        self.addTemplateSafe(GRID_TEMPLATE, kg.templates.defaultGridInnerTemplate);

        //header row template
        if (config.headerTemplate) {
            self.addTemplateSafe(config.headerTemplate, function () {
                return kg.templates.generateHeaderTemplate(config);
            });
        }

        //header cell template
        if (config.headerCellTemplate) {
            self.addTemplateSafe(config.headerCellTemplate, kg.templates.defaultHeaderCellTemplate);
        }

        //row template
        if (config.rowTemplate) {
            self.addTemplateSafe(config.rowTemplate, function () {
                return kg.templates.generateRowTemplate(config);
            });
        }

        //footer template
        if (config.footerTemplate) {
            self.addTemplateSafe(config.footerTemplate, kg.templates.defaultFooterTemplate);
        }
    };

    this.getTemplateText = function (tmplId) {
        if (!templateExists(tmplId)) {
            return "";
        } else {
            var el = document.getElementById(tmplId);
            return el.text;
        }
    };

} ());
// only overriding this until knockout supports storing templates in memory instead of requiring they be appended to the dom.
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        if (ko.a && ko.a.L){
            return ko.a.L(templateNodes.cloneNode(true).childNodes);
        }
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText;
        if (templateSource['text']() == undefined){
            if (templateSource.domElement == undefined){
                if (templateSource.i == undefined){
                    if (templateSource.h == undefined){
                        if (templateSource['template']() == undefined){
                            templateText = "";
                        } else {
                            templateText = templateSource['template']();
                        }
                    } else {
                        templateText = templateSource.h.innerHTML;
                    }
                } else {
                    templateText = templateSource.i.innerHTML;
                }
            } else {
                templateText = templateSource.domElement.innerHTML;
            }
        } else{
            templateText = templateSource['text']();
        }
        return ko.utils.parseHtmlFragment(templateText);
    }
};
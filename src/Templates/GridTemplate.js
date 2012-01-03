kg.defaultGridInnerTemplate = function () {
    var html = [];

    html.push("<div class='kgHeaderContainer'>");
    /**/html.push("<div class='kgHeaders'>");
    /**/html.push("</div>");
    html.push("</div>");

    html.push("<div class='kgViewport'>");
    /**/html.push("<div class='kgCanvas'>");
    /**/html.push("</div>");
    html.push("</div>");

    html.push("<div class='kgFooterContainer'>");
    /**/html.push("<div class='kgFooters'>");
    /**/html.push("</div>");
    html.push("</div>");

    return html.join("");
};
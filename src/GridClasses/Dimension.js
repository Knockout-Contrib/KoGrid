kg.Dimension = function (options) {
    this.innerHeight = null;
    this.innerWidth = null;
    this.outerHeight = null;
    this.outerWidth = null;
    this.widthDiff = null;
    this.heightDiff = null;

    $.extend(this, options);
};
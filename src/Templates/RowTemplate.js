kg.defaultRowTemplate = function () {
    return '<div data-bind="kgRow: $data">' +
                '<div data-bind="kgCell: { value: \'Sku\' } "></div>' +
                '<div data-bind="kgCell: { value: \'Vendor\' } "></div>' +
                '<div data-bind="kgCell: { value: \'SeasonCode\' } "></div>' +
                '<div data-bind="kgCell: { value: \'Mfg_Id\' } "></div>' +
                '<div data-bind="kgCell: { value: \'UPC\' } "></div>' +
            '</div>';
};

kg.generateRowTemplate = function (cols) {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="kgRow: $data">');

    utils.forEach(cols, function (col, i) {
        b.append('  <div data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
    });
    b.append('</div>');

    return b.toString();
};
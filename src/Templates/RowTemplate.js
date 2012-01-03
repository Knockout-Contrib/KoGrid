kg.defaultRowTemplate = function () {
    return '<div data-bind="kgRow: $data">' +
                '<div data-bind="kgCell: { value: \'Sku\' } "></div>' +
                '<div data-bind="kgCell: { value: \'Vendor\' } "></div>' +
                '<div data-bind="kgCell: { value: \'SeasonCode\' } "></div>' +
                '<div data-bind="kgCell: { value: \'Mfg_Id\' } "></div>' +
                '<div data-bind="kgCell: { value: \'UPC\' } "></div>' +
            '</div>';
};
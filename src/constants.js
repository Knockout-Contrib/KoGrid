var SELECTED_PROP = '__kg_selected__',
    GRID_KEY = '__koGrid__',
    // the # of rows we want to add to the top and bottom of the rendered grid rows 
    EXCESS_ROWS = 8,
    SCROLL_THRESHOLD = 6,
    ASC = "asc", // constant for sorting direction
    DESC = "desc", // constant for sorting direction
    KG_FIELD = '_kg_field_',
    KG_DEPTH = '_kg_depth_',
    KG_HIDDEN = '_kg_hidden_',
    KG_COLUMN = '_kg_column_',
    TEMPLATE_REGEXP = /<.+>/;
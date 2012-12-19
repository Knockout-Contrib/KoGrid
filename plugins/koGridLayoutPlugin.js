koGridLayoutPlugin = function () {
    var self = this;
    this.grid = null;
    // The init method gets called during the koGrid binding handler execution.
    self.onGridInit = function (grid) {
        /* logic */
        self.grid = grid;
    };
    this.updateGridLayout = function(){
        window.kg.domUtilityService.UpdateGridLayout(self.grid);
        self.grid.configureColumnWidths();
        window.kg.domUtilityService.BuildStyles(self.grid);
    };
}

koGridLayoutPlugin = function () {
	var self = this;
	this.grid = null;
    // The init method gets called during the koGrid binding handler execution.
    self.onGridInit = function (grid) {
        /* logic */
		self.grid = grid;
    };
    this.updateGridLayout = function(){
        kg.domUtilityService.UpdateGridLayout(self.grid);
        self.grid.configureColumnWidths();
        kg.domUtilityService.BuildStyles(self.grid);
    };
}

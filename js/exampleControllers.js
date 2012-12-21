var tabs = [{
				index: 0,
				title: "HTML"
			},
			{			
				index: 1,
				title: "CSS"
			},
			{
				index: 2,
				title: "JS"
			}];
			
var gridData = [{name: "Moroni", age: 50},
						 {name: "Tiancum", age: 43},
						 {name: "Jacob", age: 27},
						 {name: "Nephi", age: 29},
						 {name: "Enos", age: 34}];

angular.module('myApp.exampleControllers', [])

.controller('BasicExampleCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/basic/basic" + $scope.selectedBasicTab.title + '.html';};
	}])
	
.controller('ColumnDefsExampleCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/columnDefs/columnDefs" + $scope.selectedBasicTab.title + '.html';};
	}])
	
.controller('GroupingHTML5ExampleCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/grouping/groupByHTML5/groupByHTML5" + $scope.selectedBasicTab.title + '.html';};		
	}])
	
.controller('GroupingJQueryExampleCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/grouping/groupByJQueryUI/groupByJQueryUI" + $scope.selectedBasicTab.title + '.html';};		
	}])
	
.controller('StringCellTemplateCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/templates/cellTemplates/stringCellTemplate/stringCellTemplate" + $scope.selectedBasicTab.title + '.html';};
	}])
	
.controller('FileReferencedCellTemplateCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/templates/cellTemplates/fileReferencedCellTemplate/fileReferencedCellTemplate" + $scope.selectedBasicTab.title + '.html';};
	}])
	
.controller('RowTemplateCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/templates/rowTemplates/rowTemplate" + $scope.selectedBasicTab.title + '.html';};
	}])
		
.controller('ThemesExampleCtrl', ['$scope', function($scope) {
		$scope.basicTabs = tabs;
		$scope.selectedBasicTab = $scope.basicTabs[0];		
		$scope.switchTab = function(tab){
			$scope.selectedBasicTab = $scope.basicTabs[tab];
		};				
		$scope.link = function(){ return "partials/exampleDefinitions/themes/themes" + $scope.selectedBasicTab.title + '.html';};
	}])
	
.controller('PagingExampleCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.basicTabs = tabs;
	$scope.selectedBasicTab = $scope.basicTabs[0];		
	$scope.switchTab = function(tab){
		$scope.selectedBasicTab = $scope.basicTabs[tab];
	};				
	$scope.link = function(){ return "partials/exampleDefinitions/paging/paging" + $scope.selectedBasicTab.title + '.html';};
}])
	
.controller('MasterDetailExampleCtrl', ['$scope', function($scope) {
	$scope.basicTabs = tabs;
	$scope.selectedBasicTab = $scope.basicTabs[0];		
	$scope.switchTab = function(tab){
		$scope.selectedBasicTab = $scope.basicTabs[tab];
	};				
	$scope.angularBindings = "{{mySelections}}";
	$scope.link = function(){ return "partials/exampleDefinitions/masterDetail/masterDetails" + $scope.selectedBasicTab.title + '.html';};	
}]);
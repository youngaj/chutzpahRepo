(function () {
	"use strict";

	var controllerId = 'RiskStateListCntrl';
	angular
        .module('app.modules.risks')
        .controller(controllerId, RiskStateListCntrl);

	RiskStateListCntrl.$inject = ['$scope', 'common', 'riskStateService', 'uiGridConstants'];

	function RiskStateListCntrl($scope, common, riskStateService, uiGridConstants) {
		var vm = this;
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);


		vm.title = 'Risks';
		vm.users = [];

		vm.newItem = newItem;
		vm.goToDetail = goToDetail;
		vm.gridOptions = {
		    enableColumnResizing: true,
		    enableFiltering: true,
		    paginationPageSizes: [50, 100, 500],
		    paginationPageSize: 100,
		    enableRowSelection: true,
		    enableRowHeaderSelection: false,
		    multiSelect: false,
		    columnDefs: [
                { name: 'id', width: 50 },
                { name: 'name', filter: { condition: uiGridConstants.filter.CONTAINS } },
                { name: 'description', filter: { condition: uiGridConstants.filter.CONTAINS } },
                { name: 'isDefault', displayName: 'Default', filter: { condition: uiGridConstants.filter.CONTAINS } },
		    ],
		    onRegisterApi: gridSelectionEventListner
		};

		activate();
		function activate() {
		    var promises = [];
		    common.activateController(promises, controllerId)
				.then(function () {
					getUsers();
				});
		}

		function gridSelectionEventListner(gridApi) {
		    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
		        var riskState = row.entity;
		        goToDetail(riskState.id);
		    });
		}

		function getUsers() {
		    return riskStateService.getAll().then(function (data) {
		        vm.users = data;
		        vm.gridOptions.data = data;
		    });
		}

		function goToDetail(id) {
		    riskStateService.goToDetail(id);
		}

		function newItem() {
		    riskStateService.goToDetail(0);
		}
	}

})();



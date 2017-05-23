(function () {
	"use strict";

	var controllerId = 'RiskStatusListCntrl';
	angular
       .module('app.modules.risks')
       .controller(controllerId, RiskStatusListCntrl);

	RiskStatusListCntrl.$inject = ['$scope', 'common', 'riskStatusService', 'uiGridConstants'];

	function RiskStatusListCntrl($scope, common, riskStatusService, uiGridConstants) {
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
		        var riskStatus = row.entity;
		        goToDetail(riskStatus.id);
		    });
		}

		function getUsers() {
		    return riskStatusService.getAll().then(function (data) {
		        vm.users = data;
		        vm.gridOptions.data = data;
		    });
		}

		function goToDetail(id) {
		    riskStatusService.goToDetail(id);
		}

		function newItem() {
		    riskStatusService.goToDetail(0);
		}
	}

})();



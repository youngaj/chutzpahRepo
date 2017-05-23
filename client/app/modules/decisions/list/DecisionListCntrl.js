(function (){


	"use strict";

	var controllerId = 'DecisionListCntrl';
	angular
        .module('app.modules.decisions')
        .controller(controllerId, DecisionListCntrl);

	DecisionListCntrl.$inject = ['$scope', 'common', 'decisionService', 'uiGridConstants'];

	function DecisionListCntrl($scope, common, decisionService, uiGridConstants) {
		var vm = this;
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);


		vm.title = 'Decisions';
		vm.users = [];

		vm.newDecision = newDecision;
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
                { name: 'author.name', displayName: 'Author', filter: { condition: uiGridConstants.filter.CONTAINS } },
                { name: 'status.name', displayName: 'Status', filter: { condition: uiGridConstants.filter.CONTAINS } },
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
		        var decision = row.entity;
		        goToDetail(decision.id);
		    });
		}

		function getUsers() {
		    return decisionService.getAll().then(function (data) {
		        vm.users = data;
		        vm.gridOptions.data = data;
		    });
		}

		function goToDetail(id) {
		    decisionService.goToDetail(id);
		}

		function newDecision() {
		    decisionService.goToDetail(0);
		}
	}

})();


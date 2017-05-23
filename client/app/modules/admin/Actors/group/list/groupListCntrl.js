(function () {
    "use strict";

	var controllerId = 'GroupListCntrl';
	angular
        .module('app.modules.actors')
        .controller(controllerId, GroupListCntrl);

	GroupListCntrl.$inject = ['$scope', 'common', 'groupService', 'uiGridConstants'];

	function GroupListCntrl($scope, common, groupService, uiGridConstants) {
		var vm = this;
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);


		vm.title = 'Groups';
		vm.users = [];

		vm.newGroup = newGroup;
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
                { name: 'members.length', displayName: 'Members Count', enableFiltering: false },
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
		        var group = row.entity;
		        goToDetail(group.id);
		    });
		}

		function getUsers() {
		    return groupService.getAll().then(function (data) {
		        vm.users = data;
		        vm.gridOptions.data = data;
		    });
		}

		function goToDetail(id) {
		    groupService.goToDetail(id);
		}

		function newGroup() {
		    groupService.goToDetail(0);
		}
	}

})();



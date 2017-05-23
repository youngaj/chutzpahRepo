(function (){

	"use strict";

	var controllerId = 'RoleListCntrl';
	angular
        .module('app.modules.actors')
        .controller(controllerId, RoleSearchCntrl);

	RoleSearchCntrl.$inject = ['$scope', '$state', 'common', 'roleService', 'uiGridConstants'];

	function RoleSearchCntrl($scope, $state, common, roleService, uiGridConstants) {
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);


		vm.title = 'Roles';
		vm.roles = [];

		vm.newRole = newRole;
		vm.gridOptions = {
		    enableColumnResizing: true,
		    enableFiltering: true,
		    paginationPageSizes: [50, 100, 500],
		    paginationPageSize: 100,
		    enableRowSelection: true,
		    enableRowHeaderSelection: false,
		    multiSelect: false,
		    onRegisterApi: gridSelectionEventListner,
		    columnDefs: [
                { name: 'id', width: 50 },
                { name: 'name', filter: { condition: uiGridConstants.filter.CONTAINS } },
                { name: 'description', filter: { condition: uiGridConstants.filter.CONTAINS } },
                { name: 'isActive', displayName: 'Active', enableFiltering: false },
		    ],

		};

		activate();
		function activate() {
		    var promises = [];
		    common.activateController(promises, controllerId)
                .then(function () {
                    getRoles();
                });
		}

		function getRoles() {
		    return roleService.getAll().then(function (data) {
		        vm.gridOptions.data = data;
		    });
		}

		function goToDetail(id) {
		    $state.go("app.actors.roles.edit", { id: id });
		}

		function gridSelectionEventListner(gridApi) {
		    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
		        var role = row.entity;
		        goToDetail(role.id);
		    });
		}

		function newRole() {
		    $state.go("app.actors.roles.edit", { id: 0 });
		}
	}
})();

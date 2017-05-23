(function (){
    "use strict";

	var controllerId = 'UserSearchCntrl';
	angular
        .module('app.modules.actors')
        .controller(controllerId, UserSearchCntrl);

	UserSearchCntrl.$inject = ['$scope', '$state', 'common', 'userService', 'uiGridConstants'];

	function UserSearchCntrl($scope, $state, common, userService, uiGridConstants) {
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);


		vm.title = 'Users';
		vm.users = [];

		vm.newUser = newUser;
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
                { name: 'uupic', displayName: 'UUPIC' },
                { name: 'auId', displayName: 'AUID', filter: { condition: uiGridConstants.filter.CONTAINS } },
                { name: 'person.emailAddress', displayName: 'Email Address', filter: { condition: uiGridConstants.filter.CONTAINS } },
		    ],
		    onRegisterApi: gridSelectionEventListner
		};

		vm.importUsers = importUsers;
		vm.userImport = {
		    buttonText: "Import Users",
		    inProgress: false
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
		        var user = row.entity;
		        goToDetail(user.id);
		    });
		}

		function getUsers() {
		    return userService.getAll().then(function (data) {
		        vm.users = data;
		        vm.gridOptions.data = data;
		    });
		}

		function goToDetail(id) {
		    $state.go("app.actors.users.edit", { id: id });
		}

		function importUsers() {
		    if (vm.userImport.inProgress) {
		        log("Import already in progress... Please wait.");
		        return;
		    }

		    vm.userImport.inProgress = true;
		    vm.userImport.buttonText = "Import in progress...";
		    return userService.importUsers().then(function (newUsers) {
		        if (angular.isDefined(newUsers) && newUsers.length > 0) {
		            logSuccess(newUsers.length + " new Users imported");
		            var data = vm.users.concat(newUsers);
		            vm.gridOptions.data = data;
		        } else {
		            log("No new users");
		        }
		        vm.userImport.inProgress = false;
		        vm.userImport.buttonText = "Import Users";
		        return newUsers;
		    }).catch(function (error) {
		        vm.userImport.inProgress = false;
		        vm.userImport.buttonText = "Import Users";
		    });
		}

		function newUser() {
		    $state.go("app.actors.users.edit", { id: 0 });
		}
	}

})();



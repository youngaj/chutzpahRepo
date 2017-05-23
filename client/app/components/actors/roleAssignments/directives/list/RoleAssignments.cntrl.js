
(function () {
    "use strict";


    angular
        .module('app.components.actors')
        .controller('RoleAssignmentsCntrl', RoleAssignmentsCntrl);

    RoleAssignmentsCntrl.$inject = ['$scope', 'common', 'roleAssignmentService', 'roleService', 'userService'];
    function RoleAssignmentsCntrl($scope, common, roleAssignmentService, roleService, userService) {
        var controllerId = 'RoleAssignmentsCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var allChanges = [];
        var vm = this;
        vm.roleAssignments = [];
        vm.roles = [];
        vm.state = {
            isLoading: false,
            text: "Retrieving role assignments from the server"
        };
        vm.refresh = refresh;
        vm.delete = deleteRoleAssignment;
        vm.getRoleAssignments = getRoleAssignments;
        vm.saveRoleAssignment = saveRoleAssignment;

        activate();

        function activate() {
            if (vm.preload !== true) {
                getRoleAssignments();
                getRoles();
                getUsers();
            }
        }

        if (vm.preload === true) {
            vm.state.isLoading = true;
            $scope.$watch('vm.initialData', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    loadInitialData(newValue);
                }
            });
        }

        function loadInitialData(data) {
            vm.roleAssignments = data.roleAssignments;
            vm.users = _.filter(data.actors, function (actor) { return actor.classType === 'User' });;
            vm.roles = _.filter(data.actors, function (actor) { return actor.classType === 'Role' });;
            vm.state.isLoading = false;
            return;
        }


        function addEntityReference(changeRecord) {
            changeRecord.entityReference = vm.entityReference;
        }

        function getEntityKey() {
            return vm.entityCompositeKey;
        }

        function getRoles() {
            return roleService.getAll().then(function (roles) {
                vm.roles = roles;
            });
        }

        function getRoleAssignments() {
            vm.state.isLoading = true;
            vm.state.text = "Please wait while we retrieve the role assignments from the server.";
            var key = getEntityKey();
            return roleAssignmentService.getByEntityCompositeKey(key).then(function (assignments) {
                    vm.roleAssignments = assignments;
                    vm.state.isLoading = false;
                    return assignments;
            });
        }

        function getUsers() {
            return userService.getAll().then(function (users) {
                vm.users = users;
            });
        }
        function refresh() {
            getRoleAssignments().then(function () {
                log("Role Assignments Updated");
            });
        }

        function deleteRoleAssignment(roleAssignment) {
            return roleAssignmentService.remove(roleAssignment.id)
                .then(function (result) {
                    vm.state.isLoading = false;
                    logSuccess("Role Assignment deleted");
                    _.remove(vm.roleAssignments, function (r) { return r.id === roleAssignment.id; });

                    return result;
                })
                .catch(function (error) {
                    logError("Role Assignment delete failed.", error);
                    vm.state.isLoading = false;
                });
        }

        function saveRoleAssignment(newRoleAssignment) {
            if (angular.isDefined(newRoleAssignment) && angular.isDefined(newRoleAssignment.role) && angular.isDefined(newRoleAssignment.actor)) {
                newRoleAssignment.entityCompositeKey = vm.entityCompositeKey;
                newRoleAssignment.roleId = newRoleAssignment.role.id;
                newRoleAssignment.actorCompositeKey = newRoleAssignment.actor.compositeKey
                return roleAssignmentService.create(newRoleAssignment)
                                .then(function (result) {
                                    vm.state.isLoading = false;
                                    logSuccess("Role Assignment saved");
                                    vm.roleAssignments.push(result);
                                    return result;
                                })
                                .catch(function (error) {
                                    logError("Role Assignment save failed.", error);
                                    vm.state.isLoading = false;
                                });
            } else {
                logError("Invalid input")
            }
        }
    }
})();


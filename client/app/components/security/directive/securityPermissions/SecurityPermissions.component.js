(function () {
    "use strict";


    angular
          .module('app.components.security')
          .component('securityPermissions', {
              templateUrl: 'app/components/security/directive/securityPermissions/SecurityPermissions.component.html',
              controller: SecurityPermissionCntrl,
              controllerAs: 'vm',
              bindings: {
                  entityCompositeKey: '<',
                  allowEdit:'<'
              }
          });

    SecurityPermissionCntrl.$inject = ['common', 'securityPermissionService'];
    function SecurityPermissionCntrl(common, securityPermissionService) {
        var vm = this;

        var controllerId = "SecurityPermissionCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var securityPermissions = [];

        vm.arrangedPermissions = [];
        vm.state = {
            isLoading: true
        };
        vm.removeSelectedSecurityPermissions = removeSelectedSecurityPermissions;
        vm.removeSecurityPermission = removeSecurityPermission;

        vm.$onInit = function () {
            vm.state.isLoading = true;
            getSecurityPermissions(vm.entityCompositeKey)
                .then(function (permissions) {
                    _.map(permissions, function (permission) {
                        permission.removeText = "Remove";
                    });
                    securityPermissions = permissions;
                    vm.arrangedPermissions = arrangeByActor(permissions);
                    vm.state.isLoading = false;
                }, function (errorResponse) {
                    logError("There was a problem retrieving the security permissions from the server.  See the console [F5] for me details.");
                    vm.state.isLoading = false;
                });
        };

        vm.$onChanges = function (changesObj) {
            vm.arrangedPermissions = arrangeByActor(securityPermissions);
        }

        function arrangeByActor(permisisons) {
            var arrangedData = [];
            _.map(permisisons, function (permission) {
                var sublist = _.find(arrangedData, function (curr) {
                    return curr.id === permission.actor.name;
                });
                if (angular.isUndefined(sublist)) {
                    sublist = {
                        id: permission.actor.name,
                        permisisons: []
                    }
                    arrangedData.push(sublist);
                }
                sublist.permisisons.push(permission);
            });
            return arrangedData;
        }

        function getSecurityPermissions(compositeKey) {
            var entityCompositeKey = compositeKey;
            if (angular.isDefined(entityCompositeKey) && entityCompositeKey !== null) {
                return securityPermissionService.getByEntityCompositeKey(entityCompositeKey).then(function (securityPermissions) {
                    return securityPermissions;
                }, function (errorResponse) {
                    logError("Security permissions failed to load. " + errorResponse.message);
                    return $q.reject([]);
                });
            }
        }

        function getSecurityRuleLevels() {
            if (levels === null) {
                levels = [
                        { label: 'required', value: required },
                        { label: 'optional', value: optional },
                        { label: 'denied', value: denied }
                ];
            }
            return levels;
        }

        function getSecurityRuleTypes() {
            if (ruleTypes === null) {
                ruleTypes = [
                    { label: 'User', value: 'User' },
                    { label: 'Role', value: 'Role' },
                    { label: 'Group', value: 'Group' },
                ];
            }
            return ruleTypes;
        }

        function removeSelectedSecurityPermissions(entityCompositeKey) {
            var promises = _.chain(securityPermissions)
                            .filter(function (p) { return p.selected === true })
                            .map(function (securityPermission) { return removeSecurityPermission(entityCompositeKey, securityPermission); })
                            .value();

            if (promises.length > 0) {
                $q.all(promises).then(function () {
                    logSuccess("Security permission(s) removed.");
                }, function (errorResponse) {
                    logError("Security removal failed. " + errorResponse.message);
                });
            } else {
                log("No permissions selected to remove");
            }
        }

        function removeSecurityPermission(entityCompositeKey, securityPermission) {
            securityPermission.removeText = "Removing permission...";
            return securityPermissionService.remove(entityCompositeKey, securityPermission.id)
                    .then(function (data) {
                        deleteSecurityPermission(securityPermission);
                        logSuccess("Permission removed.");
                        return data;
                    }, function (errorResponse) {
                        securityPermission.removeText = "Remove";
                        console.error(errorResponse);
                        return errorResponse;
                    });
        }

        function deleteSecurityPermission(securityPermission) {
            _.remove(securityPermissions, function (currSecurityPermission) { return currSecurityPermission.id === securityPermission.id });
            vm.arrangedPermissions = arrangeByActor(securityPermissions);
        }
    }
})();
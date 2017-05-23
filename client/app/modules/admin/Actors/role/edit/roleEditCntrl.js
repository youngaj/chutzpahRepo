(function (){
    "use strict";

    var controllerId = 'RoleEditCntrl';
    angular
        .module('app.modules.actors')
        .controller(controllerId, RoleEditCntrl);

    RoleEditCntrl.$inject = ['$stateParams', 'common', 'roleService', 'securityPermissionService', 'entity'];

    function RoleEditCntrl($stateParams, common, roleService, securityPermissionService, entity) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.saveRole = saveRole;

        vm.title = 'Role Edit';
        vm.role = entity;
        vm.activeOptions = [
            { name: "Active", value: true },
            { name: "In-Active", value: false },
        ];

        vm.security = {
            allowComments: false,
            allowFileContainer: false,
            allowFollowers: false,
            allowMetaDataEdit: false,
            allowReviews: false,
            allowSecurity: false,
            allowMemberUpdate: false
        };
        vm.options = {
            featureOptions: common.featureOptions,
            allowedFeatures: [],
            availableFeatures: [],
            defaultActiveTab: 'security'
        };
        var securityPermissions = [];

        activate();
        function activate() {

            var promises = [getFeatureOptions(entity.classType), getClearedFeatures(entity.compositeKey)];
            common.activateController(promises, controllerId)
                .then(function () {
                    if (entity.id != 0) {
                        vm.security = roleService.getFeatureSecurity(vm.options);
                    } else {
                        vm.security = newEntitySecurity();
                    }
                });
        }

        function newEntitySecurity() {
            return {
                allowComments: false,
                allowFileContainer: false,
                allowFollowers: false,
                allowMetaDataEdit: true,
                allowReviews: false,
                allowSecurity: false,
                allowMemberUpdate: false
            };
        }

        function getClearedFeatures(compositeKey) {
            return securityPermissionService.getClearedFeatures(compositeKey).then(function (features) {
                securityPermissions = features;
                vm.options.allowedFeatures = features;
                return features;
            });
        }

        function getFeatureOptions(classType) {
            return securityPermissionService.getSecurityPermissionOptions(classType).then(function (availableFeatures) {
                vm.options.availableFeatures = availableFeatures;
                return availableFeatures;
            });
        }

        function saveRole() {
            if (typeof vm.role.id !== 'undefined' && vm.role.id > 0) {
                return roleService.updateRole(vm.role).then(function (role) {
                    logSuccess("Role Updated.");
                });
            } else {
                return roleService.createRole(vm.role).then(function (role) {
                    vm.role = role;
                    logSuccess("Role created.");
                    roleService.goToDetail(role.id);
                });
            }
        }
    }
})();


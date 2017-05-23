(function () {
    "use strict";


    angular
          .module('app.components')
          .component('componentPanel', {
              templateUrl: 'app/components/componentPanel/componentPanel.tpl.html',
              controller: ComponentPanelCntrl,
              controllerAs: 'vm',
              bindings: {
                  entityCompositeKey: '<',
                  entityReference: '<',
                  displayConfig: '<',
                  securityConfig: '='
              }
          });

    ComponentPanelCntrl.$inject = ['common', 'componentPanelService'];
    function ComponentPanelCntrl(common, componentPanelService) {
        var vm = this;

        var controllerId = "ComponentPanelCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.preload = true;
        vm.autoProcess = true;
        vm.data = {};

        vm.$onInit = function () {
            getComponentData(vm.entityCompositeKey);
        };

        function getComponentData(entityCompositeKey) {
            componentPanelService.getByEntityCompositeKey(entityCompositeKey).then(function (data) {
                console.log(data);
                data = adjustRoleAssignments(data);
                data = compileSecurityData(data);
                data = adjustFollowers(data);
                vm.data = data;
            }).catch(errorResponse);
        }

        function adjustRoleAssignments(data) {
            var roleAssignments = data.roleAssignments;
            var actors = data.actors;
            data.roleAssignments = {
                roleAssignments: roleAssignments,
                actors: actors
            };
            return data;
        }

        function adjustFollowers(data) {
            var followers = data.followers;
            var actors = data.actors;
            data.followers = {
                followers: followers,
                actors: actors
            };
            return data;
        }

        function compileSecurityData(data) {
            var security = {
                actors: data.actors,
                securityLock: data.securityRules,
                permissions: data.securityPermissions
            };
            data.security = security;
            return data;
        }

        function errorResponse(error) {
            logError("server error");
        }

        vm.$onChanges = function (changesObj) {
        }

    }
})();
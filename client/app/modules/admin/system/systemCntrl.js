(function () {

    "use strict";

    var controllerId = 'SystemCntrl';
    angular
        .module('app.modules.system')
        .controller(controllerId, SystemCntrl);

    SystemCntrl.$inject = ['$http', 'common', 'systemService', 'securityPermissionService'];

    function SystemCntrl($http, common, systemService, securityPermissionService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'System Cntrl';
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.system = {};
        vm.options = {
            availableFeatures: [],
            defaultActiveTab: 'security'
        };
        vm.security = {
            allowMetaDataEdit: false,
            allowSecurity: false,
            allowFollowers: false,
            allowComments: false
        };

        //-- exposed functions
        vm.save = save;

        activate();

        function activate() {
            return getSystemInfo().then(function (system){
                getFeatureOptions(system.classType);
                getClearedFeatures(system.compositeKey);
            });
        }

        function getClearedFeatures(compositeKey) {
            return securityPermissionService.getClearedFeatures(compositeKey).then(function (allowedFeatures) {
                return setFeaturePermissions(allowedFeatures);
            });
        }

        function getFeatureOptions(classType) {
            return securityPermissionService.getSecurityPermissionOptions(classType).then(function (availableFeatures) {
                return vm.options.availableFeatures = availableFeatures;
            });
        }

        function getSystemInfo() {
            return systemService.get().then(function (system) {
                vm.system = system;
                return system;
            });
        }

        function save() {
            systemService.save(vm.system).then(function (system) {
                logSuccess("System record saved.");
            });
        }

        //--Should this be placed in a central service
        function setFeaturePermissions(allowedFeatures) {
            var defaultTab = null;
            _.map(allowedFeatures, function (securityPermission) {
                switch (securityPermission.name) {
                    case "metadata":
                        vm.security.allowMetaDataEdit = true;
                        break;
                    case "security":
                        vm.security.allowSecurity = true;
                        defaultTab = "security";
                        break;
                    case "followers":
                        vm.security.allowFollowers = true;
                        if (defaultTab === null) {
                            defaultTab = "followers";
                        }
                        break;
                    case "comments":
                        vm.security.allowComments = true;
                        if (defaultTab === null) {
                            defaultTab = "comments";
                        }
                        break;
                };
            });
            vm.options.defaultActiveTab = defaultTab;
            return;
        }

    }
})();

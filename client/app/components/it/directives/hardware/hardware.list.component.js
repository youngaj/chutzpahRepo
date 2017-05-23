(function () {
    "use strict";


    angular
        .module('app.components.it')
          .component('hardwareList', {
              templateUrl: 'app/components/it/directives/hardware/hardware.list.component.html',
              controller: HardwareListCntrl,
              controllerAs: 'vm',
              bindings: {
                  list: '=',
                  searchText:'<',
                  securityConfig: '<'
              }
          });

    HardwareListCntrl.$inject = ['common', 'securityService', 'hardwareService'];
    function HardwareListCntrl(common, securityService, hardwareService) {
        var vm = this;

        var controllerId = "HardwareListCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.$onInit = function () {
        };

        vm.$onChanges = function (changesObj) {
        }
    }
})();
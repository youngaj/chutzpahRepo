(function () {
    "use strict";


    angular
        .module('app.components.it')
          .component('hardwareListItem', {
              templateUrl: 'app/components/it/directives/hardware/hardware.component.html',
              controller: HardwareListItemCntrl,
              controllerAs: 'vm',
              bindings: {
                  item: '=',
                  securityConfig: '<'
              }
          });

    HardwareListItemCntrl.$inject = ['common', 'securityService', 'hardwareService'];
    function HardwareListItemCntrl(common, securityService, hardwareService) {
        var vm = this;

        var controllerId = "HardwareListItemCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.state = {
            view: "collapsed"
        }

        vm.$onInit = function () {
        };

        vm.$onChanges = function (changesObj) {
        }

        function collapseView() {
            vm.state.view = "collapsed";
        }

        function expandView() {
            vm.state.view = "expanded";
        }
    }
})();
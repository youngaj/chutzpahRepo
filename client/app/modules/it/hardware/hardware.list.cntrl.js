(function () {
    'use strict';

    var controllerId = 'HardwareListCntrl';
    angular
        .module('app.modules.it')
        .controller(controllerId, HardwareListCntrl);

    HardwareListCntrl.$inject = ['common', 'hardwareService'];

    function HardwareListCntrl(common, hardwareService) {
        /* jshint validthis:true */
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.assets = [];

        activate();

        function activate() {
            hardwareService.getAll().then(function (hardware) {
                vm.assets = hardware;
            });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'HardwareDetailCntrl';
    angular
        .module('app.modules.it')
        .controller(controllerId, HardwareDetailCntrl);

    HardwareDetailCntrl.$inject = ['common'];

    function HardwareDetailCntrl(common) {
        /* jshint validthis:true */
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        activate();

        function activate() { }
    }
})();

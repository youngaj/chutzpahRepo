(function () {
    'use strict';

    var controllerId = 'SoftwareDetailCntrl';
    angular
        .module('app.modules.it')
        .controller(controllerId, SoftwareDetailCntrl);

    SoftwareDetailCntrl.$inject = ['common'];

    function SoftwareDetailCntrl(common) {
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

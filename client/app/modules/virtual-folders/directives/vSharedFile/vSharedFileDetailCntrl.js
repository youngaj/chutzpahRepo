(function () {
    "use strict";

    vSharedFileDetailCntrl.$inject = ['$scope', 'common'];

    angular
        .module('app.modules.virtualFolders')
        .controller('vSharedFileDetailCntrl', vSharedFileDetailCntrl);

    function vSharedFileDetailCntrl(scope, common) {
        /* jshint validthis:true */

        var controllerId = 'vSharedFileDetailCntrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var vm = this;
        vm.title = 'SharedFile Detail Controller';

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    //debug('Activated Controller! - ' + vm.title);
                    //scope.statuses = _.filter(scope.statuses, function (status) { return status.classType.indexOf('Virtual') > -1; });

                });
        }

    }

})();

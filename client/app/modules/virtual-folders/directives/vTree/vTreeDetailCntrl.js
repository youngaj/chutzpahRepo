(function (){

    "use strict";

    vTreeDetailCntrl.$inject = ['$scope', 'common'];

    angular
        .module('app.modules.virtualFolders')
        .controller('vTreeDetailCntrl', vTreeDetailCntrl);

    function vTreeDetailCntrl(scope, common) {
        /* jshint validthis:true */

        var controllerId = 'vTreeDetailCntrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var vm = this;
        vm.title = 'Tree Detail Controller';

        scope.getDetail = getDetail;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    //debug('Activated Controller! - ' + vm.title);
                });
        }

        function getDetail(item) {
            //debug(item);
        }

    }

})();


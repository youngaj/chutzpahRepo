(function (){
    "use strict";

    vLinkDetailCntrl.$inject = ['$scope', 'common'];

    angular
        .module('app.modules.virtualFolders')
        .controller('vLinkDetailCntrl', vLinkDetailCntrl);

    function vLinkDetailCntrl(scope, common) {
        /* jshint validthis:true */

        var controllerId = 'vLinkDetailCntrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var vm = this;
        vm.title = 'Link Detail Controller';

        scope.getDetail = getDetail;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }

        function getDetail(item) {
            //debug(item);
        }

    }

})();


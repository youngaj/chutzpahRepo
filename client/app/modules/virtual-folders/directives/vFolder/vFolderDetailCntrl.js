(function (){
    "use strict";

    vFolderDetailCntrl.$inject = ['$scope', 'common'];

    angular
        .module('app.modules.virtualFolders')
        .controller('vFolderDetailCntrl', vFolderDetailCntrl);

    function vFolderDetailCntrl(scope, common) {
        /* jshint validthis:true */

        var controllerId = 'vFolderDetailCntrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var vm = this;
        vm.title = 'Folder Detail Controller';

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    //debug('Activated Controller! - ' + vm.title);
                });
        }

    }

})();

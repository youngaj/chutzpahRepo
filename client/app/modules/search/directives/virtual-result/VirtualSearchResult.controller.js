(function (){
    "use strict";


    angular
    .module('app.modules.search')
    .controller('VirtualSearchResultCntrl', VirtualSearchResultCntrl);

    VirtualSearchResultCntrl.$inject = ['$scope', 'common', 'virtualFolderService'];
    function VirtualSearchResultCntrl($scope, common, virtualFolderService) {
        var controllerId = 'VirtualSearchResultCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.like = like;
        $scope.goTo = goTo;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }

        function like(compositeKey) {
            logError("Not implementeted yet");
        }

        function goTo(entity) {
            virtualFolderService.navigateToEdit(entity.id, entity.classType);
        }
    }
})();


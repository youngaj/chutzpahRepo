
(function () {
    "use strict";

    angular
        .module('app.components.review')
        .controller('ReviewListCntrl', ReviewListCntrl);

    ReviewListCntrl.$inject = ['$scope', 'common', 'reviewService'];
    function ReviewListCntrl($scope, common, reviewService) {
        var controllerId = 'ReviewListCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.isLoading = false;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }
    }

})();



(function () {
    "use strict";


    angular
        .module('app.components.review')
        .controller('ReviewCntrl', ReviewCntrl);

    ReviewCntrl.$inject = ['$scope', 'common', 'reviewService'];
    function ReviewCntrl($scope, common, reviewService) {
        var controllerId = 'ReviewCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.removeReviewer = removeReviewer;

        var origReviews = [];
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }

        function removeReviewer(reviewer) {
            reviewService.removeReviewer(reviewer).then(function (result) {
                logSuccess("Reviewer removed");
            }, function (error) {
                logError("Reivewer removal failed.");
            });
        }

    }
})();


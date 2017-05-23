
(function () {
    "use strict";


    angular
        .module('app.components.review')
        .controller('ReviewerCntrl', ReviewerCntrl);

    ReviewerCntrl.$inject = ['$scope', 'common', 'reviewerService'];
    function ReviewerCntrl($scope, common, reviewerService) {
        var controllerId = 'ReviewerCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.approve = approve;
        $scope.disapprove = disapprove;
        $scope.remove = remove;
        $scope.like = like;
        $scope.createReply = createReply;
        $scope.showReplyEntry = false;
        $scope.toggleReplyEntry = toggleReplyEntry;
        $scope.selectedReply = {};
        $scope.isCurrentUser = false;
        $scope.canApprove = false;

        var origReviewers = [];
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    determineCanApprove();
                });
        }

        function approve() {
            return reviewerService.approve($scope.reviewerData).then(function (result) {
                logSuccess("Successfully approved");
            });
        }

        function createNewReply() {
            $scope.selectedReply = {
                id: 0,
                text: '',
                author: {},
            }
            objCompositeKey = $scope.reviewerData.objCompositeKey;
        }

        function createReply() {
            var newReviewer = $scope.selectedReply;
            newReviewer.parentReviewerId = $scope.reviewerData.id;
            if(reviewerService.isValid(newReviewer)){
                reviewerService.createReviewer(newReviewer)
                    .then(function (reply) {
                        if (angular.isUndefined($scope.reviewerData.replies)) {
                            $scope.reviewerData.replies = [];
                        }
                        $scope.reviewerData.replies.push(reply);
                        createNewReply();
                        logSuccess("Reply saved.");
                    });
            } else {
                logError("Please provide a valid reviewer");
            }
        }

        function determineCanApprove() {
            if ($scope.reviewerData.disposition == 0 && $scope.reviewerData.dispositionDate == null) {
                if (angular.isDefined($scope.currUser) && angular.isDefined($scope.reviewerData.actor)) {
                    if ($scope.currUser.compositeKey === $scope.reviewerData.actor.compositeKey) {
                        $scope.canApprove = true;
                    }
                }
            }
        }

        function disapprove() {
            return reviewerService.disapprove($scope.reviewerData).then(function (result) {
                logSuccess("Successfully approved");
            });
        }

        function like(compositeKey) {
            logError("Not implementeted yet");
        }

        function remove() {
            $scope.removeFn($scope.reviewerData);
        }

        function toggleReplyEntry() {
            createNewReply();
            $scope.showReplyEntry = !$scope.showReplyEntry;
        }

    }
})();


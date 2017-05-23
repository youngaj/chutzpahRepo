
(function () {

    "use strict";


    angular
        .module('app.components.review')
        .controller('ReviewManagerCntrl', ReviewManagerCntrl);

    ReviewManagerCntrl.$inject = ['$scope', 'common', 'reviewService', 'reviewerService', 'reviewStatusService', 'actorService', 'securityService'];
    function ReviewManagerCntrl($scope, common, reviewService, reviewerService, reviewStatusService, actorService, securityService) {
        var controllerId = 'ReviewManagerCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.currUser = {};

        $scope.activate = activate;
        $scope.addReview = addReview;
        $scope.deleteReview = deleteReview;
        $scope.getReviews = getReviews;
        $scope.getActors = getActors;
        $scope.clearActors = clearActors;
        $scope.saveReview = saveReview;
        $scope.showList = showList;
        $scope.startReview = startReview;
        $scope.selectActor = selectActor;
        $scope.selectReview = selectReview;

        $scope.state = {
            displayDetail: false,
            isLoading: false,
            isStartable: false,
            isDeleteable : false,
        };
        $scope.selectedReview = {};
        $scope.reviews = [];
        $scope.statuses = [];

        activate();

        function activate() {
            var promises = [getStatuses(), getCurrentUser()];
            common.activateController(promises, controllerId)
                .then(function () {
                    getReviews();
                });
        }

        function addReview() {
            $scope.selectedReview = generateBlankReview();
            $scope.state.displayDetail = true;
        }

        function addReviewer(actor) {
            var reviewer = getOrCreateReviewer(actor);
            var reviewers = getOrCreateReviewerList($scope.selectedReview);
            reviewers.push(reviewer);
            $scope.selectedReview.reviewers = reviewers;
        }

        function clearActors() {
            $scope.actors = [];
        }

        function getCurrentUser() {
            return securityService.getLoggedInUser().then(function (user) {
                $scope.currUser = user;
                return user;
            });
        }

        function getOrCreateReviewerList(review) {
            if (angular.isDefined(review.reviewers) !== true) {
                review.reviewers = [];
            }
            return review.reviewers;
        }

        //TODO: Move this to the service. Pass in reviewId and actor
        function createReviewer(actor) {
            var reviewer = {};
            reviewer.id = 0;
            reviewer.reviewId = $scope.selectedReview.id;
            reviewer.actor = actor;
            reviewer.dispositionDate = null;
            reviewer.disposition = 0;
            reviewer.comment = null;
            return reviewer;
        }

        function deleteReview(review) {
            if ($scope.state.isDeleteable === true) {
                $scope.state.isLoading = true;
                return reviewService.remove(review.id)
                    .then(function (result) {
                        logSuccess(review.title + " deleted successfully.");
                        removeReview(review);
                        $scope.state.displayDetail = false;
                        $scope.state.isLoading = false;
                        return result;
                    }, function (error) {
                        $scope.state.isLoading = false;
                        logError("Review delete failed " + error);

                    });
            } else {
                logError("Sorry you do not have permission to delete this review.");
            }
        }

        //TODO: Move this to the service.  Pass in owner (currUser)
        function generateBlankReview() {
            var review = {
                id : 0,
                title: '',
                owner: $scope.currUser,
                reviewers:[]
            }
            review.status = getDefaultStatus($scope.statuses);
            return review;
        }

        //TODO: Move this to the service
        function getDefaultStatus(statuses) {
            var defaultStatus = _.find(statuses, function (status) {
                return status.isDefault === true;
            });
            return defaultStatus;
        }

        function getActors() {
            return actorService.getAll().then(function (actors) {
                return $scope.actors = actors;
            });
        }

        function getOrCreateReviewer(actor) {
            var reviewers = getOrCreateReviewerList($scope.selectedReview);
            var reviewer = _.find(reviewers, { 'actor.compositeKey': actor.compositeKey });
            if (_.isUndefined(reviewer)) {
                reviewer = createReviewer(actor);
            }
            return reviewer;
        }

        function getReviews() {
            $scope.state.isLoading = true;
            $scope.state.displayDetail = false;
            $scope.selectedReview = generateBlankReview();
            return reviewService.getAllByEntityCompositeKey($scope.entityCompositeKey)
                .then(function (reviews) {
                    $scope.state.isLoading = false;
                    $scope.reviews = reviews;
                    return reviews;
                });
        }

        function getStatuses() {
            return reviewStatusService.getAll().then(function (statuses) {
                $scope.statuses = statuses;
                return statuses;
            });
        }

        function removeReview(review) {
            _.remove($scope.reviews, function (instance) { return instance.id === review.id; });
        }

        function removeReviewer(actor) {
            _.remove($scope.selectedReview.reviewers, function (reviewer) { return reviewer.actor.compositeKey == actor.compositeKey; });
        }

        function saveReview(review) {
            review.entityCompositeKey = $scope.entityCompositeKey;
            var isNew = (review.id > 0) ? false: true;
            return reviewService.save(review)
                .then(function (review) {
                    updateReviewsEntry(review);
                    selectReview(review);
                    logSuccess("Review saved");
                    return review;
                });
        }

        function showList() {
            $scope.state.displayDetail = false;
            $scope.state.isStartable = false;
            $scope.state.isDeleteable = false;
        }

        function startReview(review) {
            return reviewService.start(review, $scope.entity)
                .then(function (startResult) {
                    logSuccess("Review started.");
                    var updatedReview = startResult.obj;
                    updatedReview = updateReviewsEntry(updatedReview);
                    selectReview(updatedReview);
                    return updatedReview;
                }, function (error) {
                    logError("Error while trying to start review. See other error messages for more detailed data.");
                });
        }

        function selectActor(actor) {
            if (actor.isSelected) {
                removeReviewer(actor);
            } else {
                addReviewer(actor);
            }
            actor.isSelected = !actor.isSelected;
            setActionVisibility($scope.selectedReview);
        }

        function selectReview(review) {
            review = setStatus(review);
            $scope.selectedReview = review;
            $scope.state.displayDetail = true;
            setActionVisibility(review);
        }

        //TODO: Move this to the service.  Include list of statuses or get statuses list on service activation
        function setStatus(review){
            review.status = _.find($scope.statuses, function (status) {
                return status.id === review.status.id;
            });

            return review;
        }

        //TODO: Move this to the service
        function setActionVisibility(review) {
            setStartVisibility(review);
            setDeleteVisibility(review);
        }

        function setDeleteVisibility(review) {
            var result = true

            if ($scope.state.displayDetail !== true) {
                result = false;
            }
            if ($scope.currUser.id != review.owner.id) {
                result = false;
            }
            $scope.state.isDeleteable = result;
            return result;
        }

        function setStartVisibility(review) {
            $scope.state.isStartable = true;
            if (review.status.name != "New"){
                $scope.state.isStartable = false;
            }

            if (review.reviewers.length < 1) {
                $scope.state.isStartable = false;
            }
        }

        function updateReviewsEntry(review) {
            for (var i = 0; i < $scope.reviews.length; i++) {
                if ($scope.reviews[i].id === review.id) {
                    $scope.reviews[i] = review;
                    return $scope.reviews[i];
                }
            }
            $scope.reviews.push(review);
            return review;
        }
    }
})();


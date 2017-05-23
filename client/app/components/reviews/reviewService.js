(function () {
    'use strict';

    angular
        .module('app.components.review')
        .factory('reviewService', reviewService);

    reviewService.$inject = ['$http', 'common', 'reviewerService'];


    function reviewService($http, common, reviewerService) {
        var serviceId = 'reviewService';
        var baseUrl = common.baseUrl;

        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);

        var service = {
            getAll : getAll,
            getAllByEntityCompositeKey: getAllByEntityCompositeKey,
            getById: getById,

            remove: remove,
            removeReviewer: reviewerService.remove,
            save: save,
            start: start
        };

        activate();
        return service;

        function activate() {
        }

        function create(review) {
            //var reviewers = review.reviewers;
            //review.reviewers = [];
            return $http.post(baseUrl + 'api/Reviews', review)
                    .then(function (result) {
                        var review = result.data;
                        //if (reviewers.length > 0) {
                        //    return saveReviewers(review, reviewers).then(function (completeReview) {
                        //        return completeReview;
                        //    });
                        //}
                        return review;
                    });
        }

        function saveReviewers(review, reviewers) {
            reviewers = _.map(reviewers, function (reviewer) {
                reviewer.reviewId = review.id;
                return reviewer;
            });
            return reviewerService.saveMultiple(reviewers).then(function (reviewerList) {
                review.reviewers = reviewerList;
                return review;
            });

        }

        function formatReviews(reviews) {
            reviews = _.map(reviews, function (review) {
                formatReviewers(review);
                formatReviewDates(review);
                return review;
            });
            return reviews;
        }


        function formatReviewers(review) {
            if (angular.isDefined(review) && review != null) {
                if (angular.isDefined(review.reviewers) && review.reviewers != null) {
                    for (var i = 0; i < review.reviewers.length; i++) {
                        review.reviewers[i] = reviewerService.addFormatedDates(review.reviewers[i]);
                    }
                }
            }
            return review;
        }

        function formatReviewDates(review) {
            review.formatedStartDate = moment(review.startDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
            review.timeSinceStartDate = moment(review.startDate).fromNow();
            review.formatedEndDate = moment(review.endDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
            review.timeSinceEndDate = moment(review.endDate).fromNow();
        }


        function getAll() {
            return $http.get(baseUrl + 'api/Reviews')
                    .then(function (result) {
                        var reviews = formatReviews(result.data);
                        return reviews;
                    });
        }

        function getAllByEntityCompositeKey(entityCompositeKey) {
            return $http.get(baseUrl + 'api/Entity/'+entityCompositeKey+'/Reviews')
                    .then(function (result) {
                        var reviews = formatReviews(result.data);
                        return reviews;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Reviews/'+id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/Reviews/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function save(review) {
            if (review.id > 0) {
                return update(review);
            } else {
                return create(review);
            }
        }

        function start(review, entity) {
            var id = review.id;
            return $http.post(baseUrl + 'api/Reviews/' + id + '/start', entity)
                    .then(function (result) {
                        return review;
                    });
        }

        function update(review) {
            var id = review.id;
            //var reviewers = review.reviewers;
            //review.reviewers = [];
            return $http.put(baseUrl + 'api/Reviews/' + id, review)
                    .then(function (result) {
                        //if (reviewers.length > 0) {
                        //    return saveReviewers(review, reviewers).then(function (completeReview) {
                        //        return completeReview;
                        //    });
                        //}
                        return review;
                    });
        }
    }

})();



(function () {

    'use strict';

    angular
        .module('app.components.review')
        .factory('reviewerService', reviewerService);

    reviewerService.$inject = ['$http', 'common', 'actorService'];


    function reviewerService($http, common, actorService) {
        var serviceId = 'reviewerService';
        var baseUrl = common.baseUrl;

        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);

        var service = {
            addFormatedDates: addFormatedDates,
            approve: approve,
            getAll: getAll,
            getById: getById,
            disapprove: disapprove,
            remove: remove,
            save: save,
            saveMultiple: saveMultiple
        };

        activate();
        return service;

        function activate() {
        }


        function addFormatedDates(data) {
            var output;
            if (_.isArray(data) === true) {
                output = _.map(data, function (reviewer) { return addFormatedDispositionDate(reviewer); });
            } else {
                output = addFormatedDispositionDate(data);
            }
            return output;
        }

        function verifyReviewerInstance(reviewer) {
            if (angular.isDefined(reviewer) === false) {
                reviewer = {};
            }
            return reviewer;
        }

        function addFormatedDispositionDate(reviewer) {
            reviewer = verifyReviewerInstance(reviewer);
            reviewer.formatedDispositionDate = moment(reviewer.dispositionDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
            reviewer.timeSinceDispositionDate = moment(reviewer.dispositionDate).fromNow();
            return reviewer;
        }

        function approve(reviewer) {
            if (angular.isDefined(reviewer) === true) {
                reviewer.dispositionDate = new Date();
                reviewer.disposition = 1;
                return save(reviewer);
            }
            else {
                return $q.reject("Invalid reviewer");
            }
        }

        function create(reviewer) {
            return $http.post(baseUrl + 'api/Reviewers', reviewer)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function disapprove(reviewer) {
            if (angular.isDefined(reviewer) === true) {
                reviewer.dispositionDate = new Date();
                reviewer.disposition = 2;
                return save(reviewer);
            }
            else {
                return $q.reject("Invalid reviewer");
            }
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Reviewers')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Reviewers/'+id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/Reviewers/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function save(reviewer) {
            if (reviewer.id > 0) {
                return update(reviewer);
            } else {
                return create(reviewer);
            }
        }

        function saveMultiple(reviewers) {
            return $http.post(baseUrl + 'api/Reviewers', reviewers)
                    .then(function (result) {
                        return result.data;
                    });
        }


        function update(reviewer) {
            var id = reviewer.id;
            return $http.put(baseUrl + 'api/Reviewers/' + id, reviewer)
                    .then(function (result) {
                        review = addFormatedDispositionDate(result.data);
                        return review;
                    });
        }
    }
})();



(function () {
    'use strict';

    angular
        .module('app.components.review')
        .factory('reviewStatusService', reviewStatusService);

    reviewStatusService.$inject = ['$http', 'common'];


    function reviewStatusService($http, common) {
        var serviceId = 'reviewStatusService';
        var baseUrl = common.baseUrl;

        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);

        var statusPromise = null;

        var statuses = [];
        var service = {
            getAll: getAll,
            getById: getById,
            getDefault: getDefault,

            remove: remove,
            save: save,
        };

        activate();
        return service;

        function activate() {
        }

        function create(reviewStatus) {
            return $http.post(baseUrl + 'api/ReviewStatus', reviewStatus)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getAll(refresh) {
            if (statusPromise != null || (angular.isDefined(refresh) && refresh === true))
                return statusPromise;

            statusPromise = $http.get(baseUrl + 'api/ReviewStatus')
                    .then(function (result) {
                        statuses = result.data;
                        return statuses;
                    });

            return statusPromise;
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/ReviewStatus/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getDefault() {
            var defaultStatus;

            //-- check local cache for default status
            if (statuses != null){
                defaultStatus = _.find(statuses, function (status) {
                    return status.isDefault === true;
                });
                if (defaultStatus !== undefined) {
                    return $q.when(defaultStatus);
                }

            }
            //-- check the server for the default
            return getAll().then(function (statusResult) {
                defaultStatus = _.find(statusResult, function (status) {
                    return status.isDefault === true;
                });

                return defaultStatus;
            });

        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/ReviewStatus/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function save(reviewStatus) {
            if (angular.isDefined(reviewStatus.id) || reviewStatus.id === 0) {
                return create(reviewStatus);
            } else {
                return udpate(reviewStatus);
            }
        }

        function update(reviewStatus) {
            var id = reviewStatus.id;
            return $http.put(baseUrl + 'api/ReviewStatus/' + id, reviewStatus)
                    .then(function (result) {
                        return reviewStatus;
                    });
        }
    }

})();



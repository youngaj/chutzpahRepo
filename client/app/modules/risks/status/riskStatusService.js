(function () {
    'use strict';

    var serviceId = 'riskStatusService';
    angular
        .module('app.modules.risks')
        .factory(serviceId, riskStatusService);

    riskStatusService.$inject = ['$http', '$state', 'common'];

    function riskStatusService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var riskStatuses = null;

        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            getDefaultStatus: getDefaultStatus,
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
        };

        return service;

        function create(riskStatus) {
            return $http.post(baseUrl + 'api/RiskStatuses/', riskStatus)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        function getAll() {
            if (riskStatuses !== null)
                return $q.when(riskStatuses);


            return $http.get(baseUrl + 'api/RiskStatuses')
                    .then(function (result) {
                        riskStatuses = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/RiskStatuses/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getDefaultStatus(statuses) {
            var defaultStatus = _.find(statuses, function (status) {
                return status.isDefault === true;
            });

            if (defaultStatus === null) {
                defaultStatus = _.find(statuses, function (status) {
                    return status.name === "Open";
                });
            }
            return defaultStatus;
        }

        function goToDetail(id) {
            $state.go("app.risksStatuses.edit", { id: id });
        }

        function goToList() {
            $state.go("app.risksStatuses");
        }


        function update(riskStatus) {
            var id = riskStatus.id;
            return $http.put(baseUrl + 'api/RiskStatuses/' + id, riskStatus)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        //#region Internal Methods
        function updateOrReplace(riskStatus) {
            var index = -1;

            if (riskStatuses === null) {
                riskStatuses = [];
            }

            for (var i = 0; i < riskStatuses.length; i++) {
                if (riskStatuses[i].id === riskStatuses.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                riskStatuses.splice(index, 1);
            }
            riskStatuses.push(riskStatus);

        }
        //#endregion
    }
})();
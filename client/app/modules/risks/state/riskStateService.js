(function () {

    'use strict';

    var serviceId = 'riskStateService';
    angular
        .module('app.modules.risks')
        .factory(serviceId, riskStateService);

    riskStateService.$inject = ['$http', '$state', 'common'];

    function riskStateService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var riskStates = null;

        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            getDefaultState: getDefaultState,
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
        };

        return service;

        function create(riskState) {
            return $http.post(baseUrl + 'api/RiskStates/', riskState)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        function getAll() {
            if (riskStates !== null)
                return $q.when(riskStates);


            return $http.get(baseUrl + 'api/RiskStates')
                    .then(function (result) {
                        riskStates = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/RiskStates/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getDefaultState(statuses) {
            var defaultState = _.find(statuses, function (status) {
                return status.isDefault === true;
            });

            if (defaultState === null) {
                defaultState = _.find(statuses, function (status) {
                    return status.name === "Open";
                });
            }
            return defaultState;
        }

        function goToDetail(id) {
            $state.go("app.riskStates.detail", { id: id });
        }

        function goToList() {
            $state.go("app.riskStates");
        }


        function update(riskState) {
            var id = riskState.id;
            return $http.put(baseUrl + 'api/RiskStates/' + id, riskState)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        //#region Internal Methods
        function updateOrReplace(riskState) {
            var index = -1;

            if (riskStates === null) {
                riskStates = [];
            }

            for (var i = 0; i < riskStates.length; i++) {
                if (riskStates[i].id === riskStates.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                riskStates.splice(index, 1);
            }
            riskStates.push(riskState);

        }
        //#endregion
    }
})();
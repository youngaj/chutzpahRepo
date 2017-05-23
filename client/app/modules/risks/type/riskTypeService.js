(function () {

    'use strict';

    var serviceId = 'riskTypeService';
    angular
        .module('app.modules.risks')
        .factory(serviceId, riskTypeService);

    riskTypeService.$inject = ['$http', '$state', 'common'];

    function riskTypeService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var riskTypes = null;

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

        function create(riskType) {
            return $http.post(baseUrl + 'api/RiskTypes/', riskType)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        function getAll() {
            if (riskTypes !== null)
                return $q.when(riskTypes);


            return $http.get(baseUrl + 'api/RiskTypes')
                    .then(function (result) {
                        riskTypes = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/RiskTypes/' + id)
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
            $state.go("app.riskTypes.detail", { id: id });
        }

        function goToList() {
            $state.go("app.riskTypes");
        }


        function update(riskType) {
            var id = riskType.id;
            return $http.put(baseUrl + 'api/RiskTypes/' + id, riskType)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        //#region Internal Methods
        function updateOrReplace(riskType) {
            var index = -1;

            if (riskTypes === null) {
                riskTypes = [];
            }

            for (var i = 0; i < riskTypes.length; i++) {
                if (riskTypes[i].id === riskTypes.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                riskTypes.splice(index, 1);
            }
            riskTypes.push(riskType);

        }
        //#endregion
    }
})();

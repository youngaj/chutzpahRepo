(function () {
    'use strict';

    var serviceId = 'decisionStatusService';
    angular
        .module('app.modules.decisions')
        .factory(serviceId, decisionStatusService);

    decisionStatusService.$inject = ['$http', '$state', 'common'];

    function decisionStatusService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var decisionStatuses = null;

        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
        };

        return service;

        function create(decisionStatus) {
            return $http.post(baseUrl + 'api/DecisionStatuses/', decisionStatus)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        function getAll() {
            if (decisionStatuses !== null)
                return $q.when(decisionStatuses);


            return $http.get(baseUrl + 'api/DecisionStatuses')
                    .then(function (result) {
                        decisionStatuses = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/DecisionStatuses/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function goToDetail(id) {
            $state.go("app.decisionsStatuses.edit", { id: id });
        }

        function goToList() {
            $state.go("app.decisionsStatuses");
        }


        function update(decisionStatus) {
            var id = decisionStatus.id;
            return $http.put(baseUrl + 'api/DecisionStatuses/' + id, decisionStatus)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        //#region Internal Methods
        function updateOrReplace(decisionStatus) {
            var index = -1;

            if (decisionStatuses === null) {
                decisionStatuses = [];
            }

            for (var i = 0; i < decisionStatuses.length; i++) {
                if (decisionStatuses[i].id === decisionStatuses.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                decisionStatuses.splice(index, 1);
            }
            decisionStatuses.push(decisionStatus);

        }
        //#endregion
    }

})();
(function () {
    'use strict';

    var serviceId = 'decisionService';
    angular
        .module('app.modules.decisions')
        .factory(serviceId, decisionService);

    decisionService.$inject = ['$http', '$state', 'common'];

    function decisionService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var decisions = null;

        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
        };

        return service;

        function create(decision) {
            var validationResult = validate(decision);
            if (validationResult.isSuccessful) {
                return $http.post(baseUrl + 'api/Decisions/', decision)
                        .then(function (result) {
                            updateOrReplaceDecision(result.data);
                            $state.go("app.decisions.edit", { id: result.data.id}, {location: 'replace' });
                            return result.data;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function formatErrorsForDisplay(msgs) {
            var formatedMsg = msgs.length + " validation errors found. <ul>";
            for (var i = 0; i < msgs.length; i++) {
                formatedMsg = formatedMsg + "<li>" + msgs[i] + "</li>";
            }
            formatedMsg = formatedMsg + "</ul>";
            return formatedMsg;
        }

        function getAll() {
            if (decisions !== null && decisions.length > 0)
                return $q.when(decisions);


            return $http.get(baseUrl + 'api/Decisions')
                    .then(function (result) {
                        decisions = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Decisions/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function goToDetail(id) {
            $state.go("app.decisions.edit", { id: id });
        }

        function goToList() {
            $state.go("app.decisions");
        }

        function update(decision) {
            var validationResult = validate(decision);
            if (validationResult.isSuccessful) {
                var id = decision.id;
                return $http.put(baseUrl + 'api/Decisions/' + id, decision)
                        .then(function (result) {
                            updateOrReplaceDecision(result.data);
                            return result.data;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        //#region Internal Methods
        function updateOrReplaceDecision(decision) {
            var index = -1;

            if (decisions === null) {
                decisions = [];
            }

            for (var i = 0; i < decisions.length; i++) {
                if (decisions[i].id === decision.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                decisions.splice(index, 1);
            }
            decisions.push(decision);

        }

        function validate(decision) {
            var result = {
                isSuccessful: true,
                msgs: []
            };

            if (angular.isDefined(decision) === true && decision !== null) {
                if (angular.isDefined(decision.name) === false || decision.name === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Decision name empty");
                }
                if (angular.isDefined(decision.status) === false || decision.status === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Decision status not set");
                }
                if (angular.isDefined(decision.decidedDate) === false || decision.decidedDate === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Decision 'date decided' not set");
                }
                if (angular.isDefined(decision.effectiveDate) === false || decision.effectiveDate === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Decision 'effective date' not set");
                }
            } else {
                result.isSuccessful = false;
                result.msgs.push("Decision empty");
            }
            return result;
        }
        //#endregion
    }
})();
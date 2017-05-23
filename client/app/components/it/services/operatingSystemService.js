(function(){
    'use strict';

    var serviceId = 'operationSystemService';

    angular
        .module('app.components.it')
        .factory('operationSystemService', operationSystemService);

    operationSystemService.$inject = ['$http', '$location', 'common', 'securityService', 'actorService'];

    function operationSystemService($http, $location, common, securityService, actorService) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var _currUser = null;

        var service = {
            get: get,
            getAll: getAll,
            getUserOperationSystem: getUserOperationSystem,
            remove: remove,
            save: save
        };

        activate();
        return service;

        function activate() {
            securityService.getLoggedInUser().then(function (user) {
                _currUser = user;
            });
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/OperationSystems/' + id)
                .then(function (result) {
                    return result;
                });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/OperationSystems/' + id)
                .then(function (result) {
                    var operationSystem = result.data;
                    return operationSystem;
                });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/OperationSystems')
                .then(function (result) {
                    return operationSystems;
                });
        }


        function getUserOperationSystem(userId) {
            if (angular.isDefined(userId) && userId != null) {
                return $http.get(baseUrl + 'api/User/' + userId + '/OperationSystems')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid user reference.");
        }

        function save(operationSystem) {
            if (angular.isDefined(operationSystem.id) || operationSystem.id === 0) {
                return create(operationSystem);
            } else {
                return udpate(operationSystem);
            }
        }

        function create(operationSystem) {
            operationSystem.entityReference.pageUrl = $location.absUrl();
            return $http.post(baseUrl + 'api/OperationSystems', operationSystem)
                .then(function (result) {
                    operationSystem = result.data;
                    actorService.formatAvatars(operationSystem.user);
                    return operationSystem;
                });
        }

        function update(operationSystem) {
            var id = operationSystem.id;
            return $http.put(baseUrl + 'api/OperationSystems/' + id, operationSystem)
                .then(function (result) {
                    operationSystem = result.data;
                    actorService.formatAvatars(operationSystem.user);
                    return operationSystem;
                });
        }

    }
})();
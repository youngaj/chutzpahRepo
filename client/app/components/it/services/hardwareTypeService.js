(function(){
    'use strict';

    var serviceId = 'hardwareTypeService';

    angular
        .module('app.components.it')
        .factory('hardwareTypeService', hardwareTypeService);

    hardwareTypeService.$inject = ['$http', '$location', 'common', 'securityService', 'actorService'];

    function hardwareTypeService($http, $location, common, securityService, actorService) {
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
            getUserHardwareType: getUserHardwareType,
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
            return $http.delete(baseUrl + 'api/HardwareTypes/' + id)
                .then(function (result) {
                    return result;
                });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/HardwareTypes/' + id)
                .then(function (result) {
                    var hardwareType = result.data;
                    return hardwareType;
                });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/HardwareTypes')
                .then(function (result) {
                    return hardwareTypes;
                });
        }


        function getUserHardwareType(userId) {
            if (angular.isDefined(userId) && userId != null) {
                return $http.get(baseUrl + 'api/User/' + userId + '/HardwareTypes')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid user reference.");
        }

        function save(hardwareType) {
            if (angular.isDefined(hardwareType.id) || hardwareType.id === 0) {
                return create(hardwareType);
            } else {
                return udpate(hardwareType);
            }
        }

        function create(hardwareType) {
            hardwareType.entityReference.pageUrl = $location.absUrl();
            return $http.post(baseUrl + 'api/HardwareTypes', hardwareType)
                .then(function (result) {
                    hardwareType = result.data;
                    actorService.formatAvatars(hardwareType.user);
                    return hardwareType;
                });
        }

        function update(hardwareType) {
            var id = hardwareType.id;
            return $http.put(baseUrl + 'api/HardwareTypes/' + id, hardwareType)
                .then(function (result) {
                    hardwareType = result.data;
                    actorService.formatAvatars(hardwareType.user);
                    return hardwareType;
                });
        }

    }
})();
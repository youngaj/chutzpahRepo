(function(){
    'use strict';

    var serviceId = 'hardwareService';

    angular
        .module('app.components.it')
        .factory('hardwareService', hardwareService);

    hardwareService.$inject = ['$http', '$location', 'common', 'securityService', 'actorService'];

    function hardwareService($http, $location, common, securityService, actorService) {
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
            getUserHardware: getUserHardware,
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
            return $http.delete(baseUrl + 'api/HardwareAssets/' + id)
                .then(function (result) {
                    return result;
                });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/HardwareAssets/' + id)
                .then(function (result) {
                    var hardware = result.data;
                    return hardware;
                });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/HardwareAssets')
                .then(function (result) {
                    return result.data;
                });
        }


        function getUserHardware(userId) {
            if (angular.isDefined(userId) && userId != null) {
                return $http.get(baseUrl + 'api/User/' + userId + '/HardwareAssets')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid user reference.");
        }

        function save(hardware) {
            if (angular.isDefined(hardware.id) || hardware.id === 0) {
                return create(hardware);
            } else {
                return udpate(hardware);
            }
        }

        function create(hardware) {
            hardware.entityReference.pageUrl = $location.absUrl();
            return $http.post(baseUrl + 'api/HardwareAssets', hardware)
                .then(function (result) {
                    hardware = result.data;
                    actorService.formatAvatars(hardware.user);
                    return hardware;
                });
        }

        function update(hardware) {
            var id = hardware.id;
            return $http.put(baseUrl + 'api/HardwareAssets/' + id, hardware)
                .then(function (result) {
                    hardware = result.data;
                    actorService.formatAvatars(hardware.user);
                    return hardware;
                });
        }

    }
})();
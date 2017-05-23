(function(){
    'use strict';

    var serviceId = 'softwareInstallService';

    angular
        .module('app.components.it')
        .factory('softwareInstallService', softwareInstallService);

    softwareInstallService.$inject = ['$http', '$location', 'common', 'securityService', 'actorService'];

    function softwareInstallService($http, $location, common, securityService, actorService) {
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
            return $http.delete(baseUrl + 'api/SoftwareInstalls/' + id)
                .then(function (result) {
                    return result;
                });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/SoftwareInstalls/' + id)
                .then(function (result) {
                    var softwareInstall = result.data;
                    return softwareInstall;
                });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/SoftwareInstalls')
                .then(function (result) {
                    return softwareInstalls;
                });
        }


        function getUserHardware(userId) {
            if (angular.isDefined(userId) && userId != null) {
                return $http.get(baseUrl + 'api/User/' + userId + '/SoftwareInstalls')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid user reference.");
        }

        function save(softwareInstall) {
            if (angular.isDefined(softwareInstall.id) || softwareInstall.id === 0) {
                return create(softwareInstall);
            } else {
                return udpate(softwareInstall);
            }
        }

        function create(softwareInstall) {
            softwareInstall.entityReference.pageUrl = $location.absUrl();
            return $http.post(baseUrl + 'api/SoftwareInstalls', softwareInstall)
                .then(function (result) {
                    softwareInstall = result.data;
                    actorService.formatAvatars(softwareInstall.user);
                    return softwareInstall;
                });
        }

        function update(softwareInstall) {
            var id = softwareInstall.id;
            return $http.put(baseUrl + 'api/SoftwareInstalls/' + id, softwareInstall)
                .then(function (result) {
                    softwareInstall = result.data;
                    actorService.formatAvatars(softwareInstall.user);
                    return softwareInstall;
                });
        }

    }
})();
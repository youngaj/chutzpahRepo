(function(){
    'use strict';

    var serviceId = 'softwareLicenseService';

    angular
        .module('app.components.it')
        .factory('softwareLicenseService', softwareLicenseService);

    softwareLicenseService.$inject = ['$http', '$location', 'common', 'securityService', 'actorService'];

    function softwareLicenseService($http, $location, common, securityService, actorService) {
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
            return $http.delete(baseUrl + 'api/SoftwareLicenses/' + id)
                .then(function (result) {
                    return result;
                });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/SoftwareLicenses/' + id)
                .then(function (result) {
                    var softwareLicense = result.data;
                    return softwareLicense;
                });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/SoftwareLicenses')
                .then(function (result) {
                    return softwareLicenses;
                });
        }


        function getUserHardware(userId) {
            if (angular.isDefined(userId) && userId != null) {
                return $http.get(baseUrl + 'api/User/' + userId + '/SoftwareLicenses')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid user reference.");
        }

        function save(softwareLicense) {
            if (angular.isDefined(softwareLicense.id) || softwareLicense.id === 0) {
                return create(softwareLicense);
            } else {
                return udpate(softwareLicense);
            }
        }

        function create(softwareLicense) {
            softwareLicense.entityReference.pageUrl = $location.absUrl();
            return $http.post(baseUrl + 'api/SoftwareLicenses', softwareLicense)
                .then(function (result) {
                    softwareLicense = result.data;
                    actorService.formatAvatars(softwareLicense.user);
                    return softwareLicense;
                });
        }

        function update(softwareLicense) {
            var id = softwareLicense.id;
            return $http.put(baseUrl + 'api/SoftwareLicenses/' + id, softwareLicense)
                .then(function (result) {
                    softwareLicense = result.data;
                    actorService.formatAvatars(softwareLicense.user);
                    return softwareLicense;
                });
        }

    }
})();
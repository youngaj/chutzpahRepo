(function(){
    'use strict';

    var serviceId = 'softwareService';

    angular
        .module('app.components.it')
        .factory('softwareService', softwareService);

    softwareService.$inject = ['$http', '$location', 'common', 'securityService', 'actorService'];

    function softwareService($http, $location, common, securityService, actorService) {
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
            getUserSoftware: getUserSoftware,
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
            return $http.delete(baseUrl + 'api/Software/' + id)
                .then(function (result) {
                    return result;
                });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/Software/' + id)
                .then(function (result) {
                    var software = result.data;
                    return software;
                });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Software')
                .then(function (result) {
                    return result.data;
                });
        }


        function getUserSoftware(userId) {
            if (angular.isDefined(userId) && userId != null) {
                return $http.get(baseUrl + 'api/User/' + userId + '/Software')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid user reference.");
        }

        function save(software) {
            if (angular.isDefined(software.id) || software.id === 0) {
                return create(software);
            } else {
                return udpate(software);
            }
        }

        function create(software) {
            software.entityReference.pageUrl = $location.absUrl();
            return $http.post(baseUrl + 'api/Software', software)
                .then(function (result) {
                    software = result.data;
                    actorService.formatAvatars(software.user);
                    return software;
                });
        }

        function update(software) {
            var id = software.id;
            return $http.put(baseUrl + 'api/Software/' + id, software)
                .then(function (result) {
                    software = result.data;
                    actorService.formatAvatars(software.user);
                    return software;
                });
        }

    }
})();
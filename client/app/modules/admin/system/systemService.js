(function () {

    'use strict';

    angular
        .module('app.modules.system')
        .factory('systemService', systemService);

    systemService.$inject = ['$http', 'common'];

    function systemService($http, common) {
        var serviceId = 'systemService';
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var securityPermissions = [];
        var system = null;

        var service = {
            get: get,
            getFeatureOptions: getFeatureOptions,
            remove: remove,
            save: save,


        };

        return service;

        function createVirtualObj(entity) {
            var result = isValid(entity);
            if (result.isSuccessful === true) {
                var url = baseUrl + 'api/SystemInfo';
                return $http.post(url, entity)
                        .then(function (result) {
                            return result.data;
                        });
            } else {
                var msg = result.msgs.join();
                logError("Validation error: " + msg);
                return $q.reject(msg);
            }
        }


        function get() {
            return $http.get(baseUrl + 'api/SystemInfo/Active')
                    .then(function (result) {
                        system = result.data;
                        return system;
                    });
        }

        function getFeatureOptions(entity) {
            return $http.get(baseUrl + 'api/SystemInfo/AvailableSecurityPermissions')
                    .then(function (result) {
                        var securityPermissions = result.data;
                        return securityPermissions;
                    });

        }

        function isValid(obj) {
            var result = {
                isSuccessful: true,
                msgs: []
            }
            if (angular.isDefined(obj) === false) {
                result.isSuccessful = false;
                result.msgs.push("Object is not defined.");
            }

            if (angular.isDefined(obj.name) === false || obj.name === '') {
                result.isSuccessful = false;
                result.msgs.push("Name/Title is not valid.  Please provide a valid value");
            }

            if (angular.isDefined(obj.version) === false || obj.version === '') {
                result.isSuccessful = false;
                result.msgs.push("Version is not valid.  Please provide a valid value");
            }

            return result;
        }

        function remove(id) {
            //return $http.delete(baseUrl + 'api/VirtualObjs/' + id)
            return $http.delete(baseUrl + 'api/SystemInfo')
                    .then(function (result) {
                        return result;
                    });
        }

        function save(obj) {
            if (obj !== null) {
                var result = isValid(obj);
                if (result.isSuccessful === true) {
                    if (angular.isUndefined(obj.id) || obj.id === 0) {
                        return createVirtualObj(obj);
                    } else {
                        return updateVirtualObj(obj);
                    }
                } else {
                    var msg = result.msgs.join();
                    return $q.reject(msg);
                }

            }
        }

        function updateVirtualObj(entity) {
            var id = entity.id;
            var url = baseUrl + 'api/SystemInfo/';
            var result = isValid(entity);
            if (result.isSuccessful === true) {
                return $http.put(url + id, entity)
                        .then(function (result) {
                            return entity;
                        });
            } else {
                var msg = result.msgs.join();
                logError("Validation error: " + msg);
                return $q.reject(msg);
            }
        }

    }

})();

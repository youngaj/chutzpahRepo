(function () {
    'use strict';

    var serviceId = 'configService';
    angular
        .module("app.components.common")
        .factory(serviceId, configService);

    configService.$inject = ['$http', 'common'];
    function configService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var config = {};
        var configPromise = null;
        var service = {
            getAll: getAll,
            save: save
        };

        activate();

        return service;

        function activate() {
            config = getDefaultConfig();
        }

        function getAll(userCompositeKey) {
            if (configPromise != null)
                return configPromise;

            configPromise = $http.get(baseUrl + 'api/users/' + userCompositeKey + '/config')
                   .then(function (result) {
                       config = result.data;
                       return config;
                   });

            return configPromise;
        }

        function getDefaultConfig() {
            var defaultConfig = {
                security: {
                    displayWizard: false,
                    displayHelp: false
                },
                woa: {
                    isVisible: false
                },
            }

            return defaultConfig;
        }

        function save(userId, entity) {
            var result = isValid(userId, entity);
            if (result.isSuccessful === true) {
                if (angular.isDefined(entity.id) === false || entity.id === 0) {
                    return createConfig(userId, obj);
                } else {
                    return updateConfig(userId, obj);
                }
            } else {
                var msg = result.msgs.join();
                return $q.reject(msg);
            }
        }

        function createConfig(userId, entity) {
            var result = isValid(userId, entity);
            if (result.isSuccessful === true) {
                var url = baseUrl + 'api/users/' + userId + '/config';
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

        function isValid(userId, obj) {
            var result = {
                isSuccessful: true,
                msgs: []
            }

            if (angular.isDefined(obj) === false || obj === null) {
                result.isSuccessful = false;
                result.msgs.push("Confguration object is not defined.");
            }

            if (angular.isDefined(userId) === false || userId === null || userId === 0) {
                result.isSuccessful = false;
                result.msgs.push("A valid user reference is required.");
            }

            return result;
        }

        function updateVirtualObj(userId, entity) {
            var id = entity.id;
            var url = baseUrl + 'api/users/' + userId + '/config';
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
  (function () {
      'use strict';

      var serviceId = 'securityPermissionService';
      angular
          .module('app.components.security')
          .factory(serviceId, securityPermissionService);

    securityPermissionService.$inject = ['$http', 'common'];

    function securityPermissionService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var securityPermissions = null;
        var currentClassType = null;
        var securityPermissionOptionPromise = null;


        var service = {
            get: get,
            getAll: getAll,
            getByEntityCompositeKey: getByEntityCompositeKey,
            getClearedFeatures: getClearedFeatures,
            getSecurityPermissionOptions: getSecurityPermissionOptions,
            remove: remove,
            save: save,
            saveMultiple: saveMultiple
        };

        return service;

        function create(securityPermission) {
            return $http.post(baseUrl + 'api/SecurityPermissions', securityPermission)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/SecurityPermissions/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/SecurityPermissions')
                    .then(function (result) {
                        securityPermissions = result.data;
                        return result.data;
                    });
        }

        function getByEntityCompositeKey(entityCompositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + entityCompositeKey + '/SecurityPermissions')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getClearedFeatures(entityCompositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + entityCompositeKey + '/ClearedFeatures')
                    .then(function (result) {
                        var securityPermissions = result.data;
                        return securityPermissions;
                    });
        }

        function getSecurityPermissionOptions(classType) {
            if (classType === currentClassType && securityPermissionOptionPromise != null){
                return securityPermissionOptionPromise;
            }

            var apiEndPoint = applyPluralizationRules(classType);
            securityPermissionOptionPromise = $http.get(baseUrl + 'api/' + apiEndPoint + '/SecurityPermissionOptions')
                    .then(function (result) {
                        var securityPermissionOptions = result.data;
                        return securityPermissionOptions;
                    });
            currentClassType = classType;
            return securityPermissionOptionPromise;
        }

        function applyPluralizationRules(classType) {
            var result = classType;
            switch (classType) {
                case "SystemInfo":
                    result = classType;
                    break;
                case "DecisionStatus":
                    result = classType + "es";
                    break;
                default:
                    result = classType + "s";
            }
            return result;
        }

        function remove(entityCompositeKey, id) {
            return $http.delete(baseUrl + 'api/Entity/' + entityCompositeKey + '/SecurityPermissions/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function save(securityPermission) {
            if (angular.isDefined(securityPermission.id) == false || securityPermission.id == 0) {
                return create(securityPermission);
            } else {
                return update(securityPermission);
            }
        }

        function saveMultiple(entityCompositeKey, securityPermissions) {
            return $http.post(baseUrl + 'api/Entity/'+entityCompositeKey+'/SecurityPermissions', securityPermissions)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function update(securityPermission) {
            var id = securityPermission.id;
            return $http.put(baseUrl + 'api/SecurityPermissions/' + id, securityPermission)
                    .then(function (result) {
                        return result.data;
                    });
        }

    }
  })();
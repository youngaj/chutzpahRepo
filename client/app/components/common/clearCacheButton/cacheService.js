(function () {
    'use strict';

    var serviceId = 'cacheService';
    angular
        .module("app.components.common")
        .factory(serviceId, cacheService);

    cacheService.$inject = ['$http', 'common'];
    function cacheService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var service = {
            clearAll: clearAll,
            clearByEntityCompsiteKey: clearByEntityCompsiteKey
        };

        return service;

        function clearAll() {
            var url = baseUrl + 'api/RedisCache/Clear';
            return $http.post(url, null)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function clearByEntityCompsiteKey(entityCompositeKey) {
            var url = baseUrl + 'api/RedisCache/'+entityCompositeKey+'/Clear';
            return $http.post(url, null)
                    .then(function (result) {
                        return result.data;
                    });
        }

    }

})();
(function () {
    'use strict';

    var serviceId = 'entityGraphService';
    angular.module('app.components.entityGraph').factory(serviceId, entityGraphService);

    entityGraphService.$inject = ['$http', 'common'];

    function entityGraphService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var entityGraphs = null;

        var service = {
            getParentPath: getParentPath,
            getRelatedEntities: getRelatedEntities,
        };

        return service;

        function getParentPath(compositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + compositeKey + "/Parents")
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getRelatedEntities(compositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + compositeKey + "/RelatedItems")
                    .then(function (result) {
                        return result.data;
                    });
        }

    }
})();
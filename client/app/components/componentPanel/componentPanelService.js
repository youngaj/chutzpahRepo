(function () {
    'use strict';

    var serviceId = 'componentPanelService';
    angular
        .module('app.components')
        .factory(serviceId, componentPanelService);

    componentPanelService.$inject = ['$http', 'common'];

    function componentPanelService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var service = {
            getByEntityCompositeKey: getByEntityCompositeKey,
        };

        return service;

        function getByEntityCompositeKey(entityCompositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + entityCompositeKey + '/ComponentPanel')
                    .then(function (result) {
                        return result.data;
                    });
        }
    }
})();
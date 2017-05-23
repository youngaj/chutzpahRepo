(function () {
    'use strict';

    var serviceId = 'serverEventService';
    angular
        .module("app.components.common")
        .factory(serviceId, serverEventService);

    serverEventService.$inject = ['$http', 'common'];
    function serverEventService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var service = {
            registerEvents: registerEvents,
        };

        activate();

        return service;

        function activate() {
        }

        function registerEvents() {
            return $http.get(baseUrl + 'api/EventServices')
                   .then(function (result) {
                       return result;
                   });
        }
    }

})();
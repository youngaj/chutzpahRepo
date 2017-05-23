(function (){


    'use strict';

    angular
        .module('app.modules.virtualFolders')
        .factory('entityStatusService', entityStatusService);

    entityStatusService.$inject = ['$http', 'common'];

    function entityStatusService($http, common) {
        var serviceId = 'entityStatusService';
        var baseUrl = common.baseUrl;
        var getLogFn = common.logger.getLogFn;
        var $q = common.$q;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var statuses = null;

        var service = {
            getAll: getAll
        };

        return service;

        function getAll() {
            if (statuses != null ){
                return $q.when(statuses);
            }

            return $http.get(baseUrl + 'api/Status')
                           .then(function (result) {
                               statuses = result.data;
                               return statuses;
                           });
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('app.components.common')
        .factory('userTrackingService', userTrackingService);

    userTrackingService.$inject = ['$rootScope', 'common'];


    function userTrackingService($rootScope, common) {
        var serviceId = 'userTrackingService';
        var baseUrl = common.baseUrl;

        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);

        var onlineUsers = [];
        var connectionPromise = $q.defer();

        var service = {
            connectionPromise: connectionPromise,
        };

        // Declare a proxy to reference the hub.
        var trackingHub = $.connection.userTrackingHub;

        trackingHub.client.updateUser = function (user) {
            common.$broadcast("user_updated", user);
            log(user.name + " has updated.");
        };

        // Start the connection.
        $.connection.hub.start()
            .done(function () { connectionPromise.resolve(true); })
            .fail(function (err) { connectionPromise.reject(err); });

        return service;
    }

})();
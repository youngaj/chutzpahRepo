(function () {
    'use strict';

    angular
        .module('app.components.common')
        .factory('common', common);

    common.$inject = ['$q', '$rootScope', '$timeout', 'logger'];

    function common($q, $rootScope, $timeout, logger) {
        var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,

            // generic
            emptyGuid: '00000000-0000-0000-0000-000000000000',
            activateController: activateController,
            logger: logger, // for accessibility
            baseUrl: "/",
            featureOptions: {
                comments: "comments",
                delete: "delete",
                fileContainer: "fileContainer",
                followers: "followers",
                metadata: "metadata",
                reviews: "reviews",
                security: "security",
                memberUpdate: "memberUpdate"
            }
        };

        return service;

        function activateController(promises, controllerId) {
            return $q.all(promises).then(function (eventArgs) {
                var data = { controllerId: controllerId };
                //$broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
            });
        }

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }
    }
})();

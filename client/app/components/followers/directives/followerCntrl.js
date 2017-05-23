
(function () {
    'use strict';

    angular
        .module('app.components.followers')
        .controller('FollowerCntrl', FollowerCntrl);

    FollowerCntrl.$inject = ['$scope', 'common', 'followerService'];
    function FollowerCntrl($scope, common, followerService) {
        var controllerId = 'FollowerCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.remove = remove;
        $scope.like = like;

        var origFollowers = [];
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }

        function like(compositeKey) {
            logError("Not implemented yet");
        }

        function remove() {
            $scope.removeFn($scope.followerData);
        }
    }
})();


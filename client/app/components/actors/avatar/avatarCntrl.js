(function () {

    "use strict";


    angular
        .module('app.components.actors')
        .controller('AvatarCntrl', AvatarCntrl);

    AvatarCntrl.$inject = ['$scope', 'common', 'actorService'];
    function AvatarCntrl($scope, common, actorService) {
        var controllerId = 'AvatarCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        vm.state = {
            isLoading: false,
        };

        activate();

        function activate() {
            if(angular.isDefined(vm.size) === false || vm.size === '')
                vm.size = 60;
        }

        $scope.$on("user_updated", function (event, user) {
            debug("user_updated event detected", user);

            if (angular.isDefined(user) && user.compositeKey === vm.actor.compositeKey) {
                vm.actor.state.status = user.state.status;
                //statuses: ['online', 'busy', away', 'offline'],
            }
        });

        $scope.$watch('vm.actor', function (newValue, oldValue) {
            if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                if (newValue !== oldValue) {
                    if (angular.isDefined(newValue.avatar) === false || newValue.avatar === null) {
                        vm.actor = actorService.formatAvatars(newValue);
                    }
                }
            }
        });

    }

})();


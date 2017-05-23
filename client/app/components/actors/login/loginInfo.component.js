(function () {
    "use strict";

    angular
        .module('app.components.actors')
        .component('loginInfo', {
            templateUrl: 'app/components/actors/login/login-info.tpl.html',
            controller: LoginInfoCntrl,
            controllerAs: 'vm',
            bindings: {
            }
        });

    LoginInfoCntrl.$inject = ['common', 'securityService', 'userService'];

    function LoginInfoCntrl(common, securityService, userService) {
        /* jshint validthis:true */
        var controllerId = 'LoginInfoCntrl';

        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.goToUserProfile = goToUserProfile;

        vm.$onInit = function () {
            activate();
        };
        function activate() {
            vm.user = { gender: 'Male' };
            securityService.getLoggedInUser().then(function (user) {
                vm.user = user;
            });
        }

        function goToUserProfile(user) {
            if (angular.isDefined(user) && user != null)
                userService.goToDetail(user.id);
            else {
                logError("User reference not found.");
            }
        }
    }
})();

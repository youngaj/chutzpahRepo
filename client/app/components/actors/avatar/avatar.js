(function () {
    "use strict";

    angular
        .module('app.components.actors')
        .directive('avatar', avatar);

    avatar.$inject = [];

    function avatar() {
        // Usage:
        //<avatar> </avatar>
        // Creates:
        //
        var directive = {
            restrict: 'AE',
            bindToController: {
                actor: '=',
                size: '=?',
                additionalClass: '@'
            },
            scope: {},
            controller: 'AvatarCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/actors/avatar/avatar.html'
        };
        return directive;
    }

})();

(function () {
    "use strict";

    angular
        .module('app.components.followers')
        .directive('follower', follower);

    follower.$inject = [];

    function follower() {
        // Usage:
        //<follower> </follower>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                followerData: '=?',
                removeFn: '&'
            },
            controller: 'FollowerCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/followers/directives/follower.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

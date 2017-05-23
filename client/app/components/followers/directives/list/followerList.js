(function () {
    "use strict";

    angular
        .module('app.components.followers')
        .directive('followerList', followerList);

    followerList.$inject = [];

    function followerList() {
        // Usage:
        //<follower-list> </follower-list>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            bindToController: {
                preload: '=?',
                initialData: '=?',
                entityCompositeKey: '=?',
                entityReference: '=?',
                allowEdit: '=?',
                action: '=?'
            },
            scope: {},
            controller: 'FollowerListCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/followers/directives/list/followerList.html'
        };
        return directive;
        function link(scope, element, attrs) {

        }
    }
})();

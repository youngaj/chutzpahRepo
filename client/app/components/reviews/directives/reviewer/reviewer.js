(function () {
    "use strict";

    angular
        .module('app.components.review')
        .directive('reviewer', reviewer);

    reviewer.$inject = [];

    function reviewer() {
        // Usage:
        //<reviewer> </reviewer>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                reviewerData: '=?',
                currUser: '=?',
                removeFn: '&'
            },
            controller: 'ReviewerCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/reviews/directives/reviewer/reviewer.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }
})();

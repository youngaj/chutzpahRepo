(function () {
    "use strict";

    angular
        .module('app.components.review')
        .directive('review', review);

    review.$inject = [];

    function review() {
        // Usage:
        //<review> </review>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                reviewData: '=?',
                statuses: '=?',
                currUser: '=?'
            },
            controller: 'ReviewCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/reviews/directives/review/review.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

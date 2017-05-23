(function () {
    "use strict";

    angular
        .module('app.components.review')
        .directive('reviewList', reviewList);

    reviewList.$inject = [];

    function reviewList() {
        // Usage:
        //<review-list> </review-list>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                reviews: '=?',
                selectedReview: '=?',
                isLoading : '=?'
            },
            controller: 'ReviewListCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/reviews/directives/list/reviewList.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

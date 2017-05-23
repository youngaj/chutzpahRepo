(function () {
    "use strict";

    angular
         .module('app.components.review')
         .directive('reviewManager', reviewManager);

    reviewManager.$inject = [];

    function reviewManager() {
        // Usage:
        //<review-manager> </review-manager>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                allowEdit: '=?',
                entityCompositeKey: '=?',
                entity: '=?'
            },
            controller: 'ReviewManagerCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/reviews/directives/manager/reviewManager.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('entityCompositeKey', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    if (newValue != oldValue) {
                        scope.activate();
                        console.log("Review Manager Directive Triggered ", newValue);
                    }
                }
            });
        }
    }

})();

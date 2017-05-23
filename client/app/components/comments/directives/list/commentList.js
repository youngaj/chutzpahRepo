(function(){

    "use strict";

    angular
         .module('app.components.comments')
         .directive('commentList', commentList);

    commentList.$inject = [];

    function commentList() {
        // Usage:
        //<comment-list> </comment-list>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                preload: '=?',
                initialData: '=?',
                entityCompositeKey: '=?',
                allowEdit: '=?',
                entityReference:'=?'
            },
            controller: 'CommentListCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/comments/directives/list/commentList.html'
        };
        return directive;
        function link(scope, element, attrs) {
            scope.$watch('entityCompositeKey', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    if (newValue != oldValue) {
                        scope.setUp(newValue);
                        console.log("Comments Directive Triggered ", newValue);
                    }
                    else
                        console.log("CommentList Directive NOT triggered", newValue, oldValue)
                } else {
                    console.log("Comment Watch triggered but setUp Not called");

                }
            });

            if (scope.preload === true) {
                scope.$watch('initialData', function (newValue, oldValue) {
                    if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                        scope.loadInitialData(newValue);
                    }
                });
            }
        }
    }

})();

(function (){

    "use strict";

    angular
        .module('app.components.comments')
        .directive('comment', comment);

    comment.$inject = [];

    function comment() {
        // Usage:
        //<comment> </comment>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                commentData: '=?',
                removeFn: '&',
                editFn: '&',
                entityReference: '=?'
            },
            controller: 'CommentCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/comments/directives/comment/comment.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

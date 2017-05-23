(function (){


    "use strict";

    angular
        .module('app.components.comments')
        .directive('commentReply', commentReply);

    commentReply.$inject = [];

    function commentReply() {
        // Usage:
        //<comment-reply> </comment-reply>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                reply: '=',
            },
            //controller: 'CommentCntrl',
            //controllerAs: 'vm',
            templateUrl: 'app/components/comments/directives/comment/reply/commentReply.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

(function (){


    "use strict";


    angular
        .module('app.components.comments')
        .controller('CommentCntrl', CommentCntrl);

    CommentCntrl.$inject = ['$scope', 'common', 'commentService'];
    function CommentCntrl($scope, common, commentService) {
        var controllerId = 'CommentCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.createReply = createReply;
        $scope.edit = edit;
        $scope.like = like;
        $scope.remove = remove;
        $scope.selectedReply = {};
        $scope.showReplyEntry = false;
        $scope.toggleReplyEntry = toggleReplyEntry;
        $scope.update = update;

        var origComments = [];
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }

        function addEntityReference(comment) {
            comment.entityReference = $scope.entityReference;
        }

        function createNewReply() {
            $scope.selectedReply = {
                id: 0,
                text: '',
                author: {},
                entityCompositeKey: $scope.commentData.entityCompositeKey
            }
        }

        function createReply() {
            var newComment = $scope.selectedReply;
            newComment.parentCommentId = $scope.commentData.id;
            var validationResult = commentService.isValid(newComment);
            if (validationResult.isSuccessful) {
                addEntityReference(newComment);
                commentService.save(newComment)
                    .then(function (reply) {
                        if (angular.isUndefined($scope.commentData.replies)) {
                            $scope.commentData.replies = [];
                        }
                        $scope.commentData.replies.push(reply);
                        createNewReply();
                        logSuccess("Reply saved.");
                    });
            } else {
                logError(validationResult.msg);
            }
        }

        function edit(comment) {
            comment.showEdit = true;
            $scope.editFn(comment);
        }

        function like(compositeKey) {
            logError("Not implementeted yet");
        }

        function remove(comment) {
            $scope.removeFn(comment);
        }

        function toggleReplyEntry() {
            createNewReply();
            $scope.showReplyEntry = !$scope.showReplyEntry;
        }

        function update(comment) {
            commentService.save(comment)
                    .then(function (updateResult) {
                        comment = updateResult;
                        comment.showEdit = false;
                    }, function (errorResponse) {
                        comment.showEdit = false;
                    });
        }
    }
})();

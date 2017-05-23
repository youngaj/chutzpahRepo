(function (){
    "use strict";


    angular
        .module('app.components.comments')
        .controller('CommentListCntrl', CommentListCntrl);

    CommentListCntrl.$inject = ['$scope', 'common', 'commentService'];
    function CommentListCntrl($scope, common, commentService) {
        var controllerId = 'CommentListCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        $scope.comments = [];
        $scope.comment = {};
        $scope.state = {
            isLoading: false,
            text: "Retrieving comments from the server"
        };

        $scope.addFile = addFile;
        $scope.edit = edit;
        $scope.getComments = getComments;
        $scope.hideEdit = hideEdit;
        $scope.remove = remove;
        $scope.save = save;
        $scope.selectComment = selectComment;
        $scope.setUp = setUp;
        $scope.showEdit = showEdit;
        $scope.loadInitialData = loadInitialData;

        var origComments = [];
        activate();

        function activate() {
            if ($scope.preload !== true) {
                var promises = [getComments()];
                common.activateController(promises, controllerId)
                    .then(function () {
                        resetComment();
                        origComments = $scope.comments;
                    });
            }
        }

        function addEntityReference(comment) {
            comment.entityReference = $scope.entityReference;
            comment.entityCompositeKey = $scope.entityReference.compositeKey;
        }

        function addFile() {
            log("This feature is not available yet.");
        }

        function edit(comment) {
            if (angular.isDefined(comment)) {
                $scope.comment = comment;
            }
        }

        function getEntityKey() {
            return $scope.entityCompositeKey;
        }

        function getComments() {
            $scope.state.isLoading = true;
            $scope.state.text = "Please wait while we retrieve the comments from the server.";
            var key = getEntityKey();
            return commentService.getAllByEntity(key).then(function (comments) {
                $scope.comments = commentService.filterReplies(comments);
                $scope.state.isLoading = false;
            });
        }

        function loadInitialData(comments) {
            origComments = comments;
            $scope.comments = commentService.filterReplies(comments);
        }

        function getComment(id) {
            return _.find($scope.comments, { 'id': id });
        }

        function hideEdit() {
            $scope.displayEdit = false;
        }

        function remove(comment) {
            $scope.state.isLoading = true;
            $scope.state.text = "Please wait while we remove this comment from the server.";
            return commentService.remove(comment.id)
                .then(function (result) {
                    $scope.state.isLoading = false;
                    removeComment(comment);
                    logSuccess("Comment deleted.");
                    resetComment();
                });
        }

        function removeComment(target) {
            _.remove($scope.comments, function (comment) { return comment.id == target.id; });
        }

        function resetComment() {
            $scope.comment = {
                id: 0,
                text: '',
                author: {}
            }
            $scope.comment.entityCompositeKey = getEntityKey();
        }

        function save() {
            var comment = $scope.comment;
            if (angular.isDefined(comment) && comment != null) {
                addEntityReference(comment);
                $scope.state.isLoading = true;
                $scope.state.text = "Please wait while we save your comment to the server.";
                var isNewComment = true;
                if (comment.id > 0) {
                    isNewComment = false;
                }

                return commentService.save(comment)
                    .then(function (result) {
                        $scope.state.isLoading = false;
                        if (isNewComment) {
                            $scope.comments.push(result);
                        }
                        logSuccess("Comment saved.");
                        resetComment();
                    });
            } else {
                logError("No comment found.");
            }
            }

        function selectComment(id) {
            commentService.findById(id, $scope.comments)
                .then(function (comment) {
                    $scope.comment = comment;
                });
        }

        function setUp(entityCompositeKey) {
            if ($scope.preload !== true) {
                return getComments().then(function (comments) {
                    resetComment();
                    origComments = $scope.comments;
                });
            }
        }

        function showEdit() {
            $scope.displayEdit = true;
        }


    }
})();


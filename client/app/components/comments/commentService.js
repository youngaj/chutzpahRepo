(function () {
    'use strict';

    var serviceId = 'commentService';

    angular
        .module('app.components.comments')
        .factory('commentService', commentService);

    commentService.$inject = ['$http', '$location', '$q', 'logger', 'common', 'securityService', 'userService'];

    function commentService($http, $location, $q, logger, common, securityService, userService) {
        var getLogFn = logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;
        var comments = [];

        var _currUser = null;

        var service = {
            canDelete: canDelete,
            canEdit: canEdit,
            createComment: createComment,
            filterReplies: filterReplies,
            findById: findById,
            getAll: getAll,
            getAllByEntity: getAllByEntity,
            getById: getById,
            getReplies: getReplies,
            remove: remove,
            save: save,
            saveReply: saveReply,
            updateComment: updateComment,
            isValid: isValid,
        };

        activate();

        return service;

        function activate() {
            securityService.getLoggedInUser().then(function (user) {
                _currUser = user;
            });
        }

        function applyFilters(input) {
            if (angular.isDefined(input)) {
                if (_.isArray(input) === true) {
                    return _.map(input, function (comment) {
                        formatComment(comment);
                        return comment;
                    });
                } else {
                    formatComment(input);
                }
            }
        }

        function canDelete(comment) {
            var result = false;
            if (angular.isDefined(comment) && angular.isDefined(comment.author)) {
                if (angular.isDefined(_currUser) && _currUser != null && angular.isDefined(_currUser)) {
                    if (comment.author.id === _currUser.id) {
                        result = true;
                    }
                    return $q.when(result);
                } else {
                    return securityService.getLoggedInUser().then(function (user) {
                        _currUser = user;
                        if (comment.author.id === _currUser.id) {
                            result = true;
                        }
                        return result;
                    });
                }
            }
            return $q.when(result);
        }

        function canEdit(comment) {
            var result = false;
            if (angular.isDefined(comment) && angular.isDefined(comment.author)) {
                if (angular.isDefined(_currUser) && _currUser != null && angular.isDefined(_currUser)) {
                    if (comment.author.id === _currUser.id) {
                        return $q.when(result);
                    }
                } else {
                    return securityService.getLoggedInUser().then(function (user) {
                        _currUser = user;
                        if (comment.author.id === _currUser.id) {
                            result = true;
                        }
                        return result;
                    });
                }
            }
            return $q.when(result);
        }

        function createComment(obj) {
            var validationResult = isValid(obj);
            if (validationResult.isSuccessful === true) {
                var url = baseUrl + 'api/Comments/';
                return $http.post(url, obj)
                    .then(function (result) {
                        var comment = result.data
                        comment = formatComment(comment);
                        comments.push(comment);
                        return comment;
                    });
            } else {
                logError(validationResult.msg);
                return $q.reject(validationResult.msg);
            }
        }

        function filterReplies(comments) {
            var filteredComments = [];
            if (angular.isDefined(comments) && comments != null) {
                _.map(comments, function (comment) {
                    if (comment.parentCommentId === null) {
                        filteredComments.push(comment);
                    }
                });
            }
            return filteredComments;
        }

        function findById(id, suggestedComments) {
            var comment;
            //-- look in suggested comments first
            comment = _.find(suggestedComments, { 'id': id });
            if (angular.isDefined(comment) === true) {
                return $q.when(comment);
            }
            //-- look in local comments
            comment = _.find(comments, { 'id': id });
            if (angular.isDefined(comment) === true) {
                return $q.when(comment);
            }

            //-- look on the server
            return getById(id);
        }

        function formatDate(comment) {
            comment.formatedTimeStamp = moment(comment.timeStamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
            comment.timeSince = moment(comment.timeStamp).fromNow();
        }

        function formatComment(comment) {
            comment.replies = applyFilters(comment.replies);
            userService.formatAvatars(comment.author);
            formatDate(comment);
            canEdit(comment).then(function (editResult) {
                comment.canEdit = editResult;
            });

            canDelete(comment).then(function (deleteResult) {
                comment.canDelete = deleteResult;
            });
            comment.showReplies = false;
            return comment;
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Comments')
                .then(function (result) {
                    comments = applyFilters(result.data);
                    return comments;
                });
        }

        function getAllByEntity(key) {
            if (angular.isDefined(key) && key != null) {
                return $http.get(baseUrl + 'api/Entity/' + key + '/comments')
                    .then(function (result) {
                        comments = applyFilters(result.data);
                        return comments;
                    });
            } else {
                return $q.reject("Invalid entity key");
            }
        }

        function getById(id) {
            //-- if we don't find the item locally check the server
            return $http.get(baseUrl + 'api/Comments/' + id)
                .then(function (result) {
                    obj = result.data;
                    obj = formatComment(obj);
                    comments.push(obj);
                    return obj;
                }, function (errorResponse) {
                    //Generic error handling in app.js
                });
        }

        function getReplies(id) {
            //-- if we don't find the item locally check the server
            return $http.get(baseUrl + 'api/Comments/' + id + '/Replies')
                .then(function (result) {
                    obj = result.data;
                    applyFilters(obj);
                    comments.push(obj);
                    return obj;
                });
        }

        function isValid(comment) {
            var result = {
                isSuccessful: true,
                msg: ""
            }
            if (_.isUndefined(comment) || _.isNull(comment)) {
                result.isSuccessful = false;
                result.msg = "Comment reference not found.";
            }
            if (_.isUndefined(comment.text) || _.isEmpty(comment.text)) {
                result.isSuccessful = false;
                result.msg = "Comment text not found.";
            }
            return result;
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/Comments/' + id)
                .then(function (result) {
                    removeComment(id);
                    return result;
                });
        }

        function removeComment(id) {
            _.remove(comments, function (comment) { return comment.id === id; });
        }

        function save(obj) {
            if (angular.isDefined(obj) && obj !== null) {
                addEntityLink(obj);
                if (angular.isUndefined(obj.id) || obj.id == 0) {
                    return createComment(obj);
                } else {
                    return updateComment(obj);
                }
            }
        }

        function saveReply(parentId, obj) {
            obj.parentCommentId = parentId;
            if (angular.isDefined(obj) && obj !== null) {
                addEntityLink(obj);
                if (angular.isUndefined(obj.id) || obj.id == 0) {
                    return createComment(obj);
                } else {
                    return updateComment(obj);
                }
            }
        }

        function addEntityLink(comment) {
            comment.entityReference.pageUrl = $location.absUrl();
        }

        function updateComment(entity) {
            var id = entity.id;
            var url = baseUrl + 'api/Comments/';
            var validationResult = isValid(entity);
            if (validationResult.isSuccessful === true) {
                return $http.put(url + id, entity)
                    .then(function (result) {
                        var comment = result.data;
                        removeComment(result.data);
                        formatDate(comment);
                        comments.push(comment);
                        return comment;
                    });
            } else {
                var msg = "Updated failed. " + validationResult.msg;
                return $q.reject(msg);
                logError(msg);
            }
        }
    }
})();
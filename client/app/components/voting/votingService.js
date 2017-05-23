(function(){
    'use strict';

    var serviceId = 'votingService';

    angular
        .module('app.components.voting')
        .factory('votingService', votingService);

    votingService.$inject = ['$http', '$location', 'common', 'securityService', 'userService'];

    function votingService($http, $location, common, securityService, userService) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var _currUser = null;
        var LIKE = 1;
        var DISLIKE = -1;

        var service = {
            deleteVote: deleteVote,
            downVote: downVote,
            upVote: upVote,
            getEntityVotes: getEntityVotes
        };

        activate();
        return service;

        function activate() {
            securityService.getLoggedInUser().then(function (user) {
                _currUser = user;
            });
        }

        function deleteVote(id) {

        }

        function downVote(entityCompositeKey, entity) {
            var vote = {
                entityCompositeKey: entityCompositeKey,
                entityReference: entity,
                Disposition: DISLIKE
            };
            return $http.post(baseUrl + 'api/Votes', vote)
                .then(function (result) {
                    return result.data;
                });
        }

        function upVote(entityCompositeKey, entity) {
            var vote = {
                entityCompositeKey: entityCompositeKey,
                entityReference: entity,
                Disposition: LIKE
            };
            return $http.post(baseUrl + 'api/Votes', vote)
                .then(function (result) {
                    return result.data;
                });
        }

        function getEntityVotes(entityCompositeKey) {
            if (angular.isDefined(entityCompositeKey) && entityCompositeKey != null) {
                return $http.get(baseUrl + 'api/Entity/' + entityCompositeKey + '/votes')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid entity key");
        }

        function getUserVotes(userId) {
            if (angular.isDefined(userId) && userId != null) {
                return $http.get(baseUrl + 'api/User/' + userId + '/votes')
                    .then(function (result) {
                        return result.data;
                    });
            }

            return $q.reject("Invalid user reference.");
        }

    }
})();
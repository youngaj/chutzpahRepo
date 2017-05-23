(function () {
    'use strict';

    var serviceId = 'followerService';
    angular
       .module('app.components.common')
       .factory(serviceId, followerService);

    followerService.$inject = ['$http', '$location', 'common', 'securityService', 'actorService'];

    function followerService($http, $location, common, securityService, actorService) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var followers = null;

        var service = {
            followEntity: followEntity,
            get: get,
            getAll: getAll,
            getAllByEntity: getAllByEntity,
            isFollowing:isFollowing,
            remove: remove,
            save: save,
            saveMultiple: saveMultiple
        };

        return service;

        function formatAvatars(followers) {
            _.map(followers, function (follower) {
                actorService.formatAvatars(follower.actor);
            });
            return followers;
        }

        function followEntity(entityCompositeKey) {
            return $http.post(baseUrl + 'api/Follow/Entity/' + entityCompositeKey)
                    .then(function (result) {
                        var follower = result.data;
                        actorService.formatAvatars(follower.actor);
                        return follower;
                    });
        }

        function get(id) {
            return $http.get(baseUrl + 'api/Followers/' + id)
                    .then(function (result) {
                        var follower = result.data;
                        actorService.formatAvatars(follower.actor);
                        return follower;
                    });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Followers')
                    .then(function (result) {
                        var followers = formatAvatars(result.data);
                        return followers;
                    });
        }

        function getAllByEntity(entityCompositeKey) {
            if (angular.isDefined(entityCompositeKey) && entityCompositeKey != null) {
                return $http.get(baseUrl + 'api/Entity/' + entityCompositeKey + '/Followers')
                        .then(function (result) {
                            var followers = formatAvatars(result.data);
                            return followers;
                        });
            } else {
                return $q.when([]);
            }
        }

        function isFollowing(entityCompositeKey, followers) {
            var result = false;
            if (angular.isDefined(entityCompositeKey) && entityCompositeKey != null) {
                return securityService.getLoggedInUser().then(function (currUser) {
                    var actorCompositeKey = currUser.compositeKey;
                    if (angular.isDefined(followers) && followers.length > 0) {
                        result = isActorInFollowers(actorCompositeKey, followers);
                        return $q.when(result);
                    } else {
                        return getAllByEntity(entityCompositeKey).then(function (followers) {
                            result = isActorInFollowers(currUser, followers);
                            return $q.when(result);
                        });
                    }
                });
            } else {
                return $q.when(result);
            }
        }

        function isActorInFollowers(actorCompositeKey, followers) {
            var result = false;
            var follower = findActorInFollowers(actorCompositeKey, followers);
            if (angular.isDefined(follower) || follower != null)
                result = true;

            return result;
        }

        function findActorInFollowers(actorCompositeKey, followers) {
            return _.find(followers, function (follower) {
                return follower.actor.compositeKey === actorCompositeKey;
            });
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/Followers/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function save(follower) {
            if (angular.isDefined(follower.id) || follower.id === 0) {
                return create(follower);
            } else {
                return udpate(follower);
            }
        }

        function saveMultiple(entityCompositeKey, entityReference, followers) {
            if (angular.isDefined(entityReference)) {
                followers = _.map(followers, function (follower) {
                    follower.entityReference = entityReference;
                    follower.entityReference.pageUrl = $location.absUrl();
                    return follower;
                });
            }
            return $http.post(baseUrl + 'api/Entity/'+entityCompositeKey+'/Followers', followers)
                    .then(function (result) {
                        var followers = formatAvatars(result.data);
                        return followers;
                    });
        }

        function create(follower) {
            follower.entityReference.pageUrl = $location.absUrl();
            return $http.post(baseUrl + 'api/Followers', follower)
                    .then(function (result) {
                        follower = result.data;
                        actorService.formatAvatars(follower.actor);
                        return follower;
                    });
        }

        function update(follower) {
            var id = follower.id;
            return $http.put(baseUrl + 'api/Followers/' + id, follower)
                    .then(function (result) {
                        follower = result.data;
                        actorService.formatAvatars(follower.actor);
                        return follower;
                    });
        }

    }

})();
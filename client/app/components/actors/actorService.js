(function () {
    'use strict';

    var serviceId = 'actorService';
    angular
        .module('app.components.actors')
        .factory(serviceId, actorService);

    actorService.$inject = ['$http', 'common'];

    function actorService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var actors = null;
        var actorsPromise = null;

        var service = {
            formatAvatars: formatAvatars,
            get: get,
            getAll: getAll,
            getGroups: getGroups,
            getRoles: getRoles,
            getUsers: getUsers,
            getAllByType: getAllByType
        };

        return service;

        function formatAvatars(actor) {
            if (actor.avatar !== null) {
                actor.avatar.largeImageUrl = baseUrl + actor.avatar.largeImageUrl;
                actor.avatar.smallImageUrl = baseUrl + actor.avatar.smallImageUrl;
            }
            actor.genericImageUrl = baseUrl + "api/Generic/male/Avatar";
            return actor;
        }

        function get(id) {
            return $http.get(baseUrl + 'api/Actors/' + id)
                    .then(function (result) {
                        var actor = formatAvatars(result.data);
                        return actor;
                    }, function (errorResponse) {
                        logError("The requested actor could not be retrieved from the server.  Error: "+ errorResponse.message, errorResponse);
                    });
        }

        function getAll() {
            if (actorsPromise !== null)
                return actorsPromise;

            actorsPromise = $http.get(baseUrl + 'api/Actors')
                    .then(function (result) {
                        actors = result.data;
                        _.map(actors, function (actor) {
                            return formatAvatars(actor);
                        });
                        return actors;
                    }, function (errorResponse) {
                        logError("Actors could not be retrieved from the server.  Error: "+ errorResponse.message, errorResponse);
                    });

            return actorsPromise;
        }

        function getAllByType(type) {
            return $http.get(baseUrl + 'api/'+type+'/Actors')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getGroups() {
            return getAll().then(function (actors) {
                        var users = _.filter(actors, { 'classType': 'Group' });
                        return users;
                    });
        }

        function getRoles() {
            return getAll().then(function (actors) {
                var users = _.filter(actors, { 'classType': 'Role' });
                return users;
            });
        }

        function getUsers() {
            return getAll().then(function (actors) {
                var users = _.filter(actors, { 'classType': 'User' });
                return users;
            });
        }
    }
})();
(function () {
    'use strict';

    var serviceId = 'userService';
    angular
        .module('app.components.actors')
        .factory(serviceId, userService);

    userService.$inject = ['$http', '$state', 'common'];

    function userService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;
        var featureOptions = common.featureOptions;

        // Define the functions and properties to reveal.
        var service = {
            createUser: createUser,
            formatAvatars: formatAvatars,
            getById: getById,
            getAll: getAll,
            getClearedFeatures: getClearedFeatures,
            getFeatureSecurity: getFeatureSecurity,
            getUserGroups: getUserGroups,
            getUserRoles: getUserRoles,
            goToDetail: goToDetail,
            importUsers: importUsers,
            updateUser: updateUser,
        };

        return service;

        function getAll() {
            return $http.get(baseUrl + 'api/Users')
                .then(function (result) {
                    var users = result.data;
                    _.map(users, function (user) {
                        return formatAvatars(user);
                    });
                    return users;
                });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Users/' + id)
                .then(function (result) {
                    var user = result.data;
                    formatAvatars(user);
                    return user;
                });
        }

        function formatAvatars(user) {
            if (user.avatar !== null) {
                user.avatar.largeImageUrl = baseUrl + user.avatar.largeImageUrl;
                user.avatar.smallImageUrl = baseUrl + user.avatar.smallImageUrl;
            }
            user.genericImageUrl = baseUrl + "api/Generic/" + user.gender + "/Avatar";
            return user;
        }

        function getClearedFeatures(compositeKey) {
            return $http.get(baseUrl + 'api/Users/' + compositeKey + '/permissions')
                .then(function (result) {
                    return result.data;
                });
        }

        function getFeatureSecurity(options) {
            var security = {
                allowComments: false,
                allowFileContainer: false,
                allowFollowers: false,
                allowMetaDataEdit: false,
                allowReviews: false,
                allowSecurity: false,
            };

            var defaultTab = null;
            _.map(options.allowedFeatures, function (securityPermission) {
                switch (securityPermission.name) {
                    case featureOptions.comments:
                        security.allowComments = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.comments;
                        }
                        break;
                    case featureOptions.metadata:
                        security.allowMetaDataEdit = true;
                        break;
                    case featureOptions.fileContainer:
                        security.allowFileContainer = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.fileContainer;
                        }
                        break;
                    case featureOptions.followers:
                        security.allowFollowers = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.followers;
                        }
                        break;
                    case featureOptions.reviews:
                        security.allowReviews = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.reviews;
                        }
                        break;
                    case featureOptions.security:
                        security.allowSecurity = true;
                        defaultTab = featureOptions.security;
                        break;
                };
            });
            options.defaultActiveTab = defaultTab;
            return security;
        }

        function getUserGroups(userId) {
            return $http.get(baseUrl + 'api/Users/' + userId + '/Groups')
                .then(function (result) {
                    return result.data;
                });
        }

        function getUserRoles(userId) {
            return $http.get(baseUrl + 'api/Users/' + userId + '/Roles')
                .then(function (result) {
                    return result.data;
                });
        }

        function goToDetail(id) {
            $state.go("app.actors.users.edit", { id: id });
        }

        function importUsers() {
            return $http.get(baseUrl + 'api/Migrate/NewUsers')
                .then(function (result) {
                    var newUsers = result.data;
                    _.map(newUsers, function (user) {
                        return formatAvatars(user);
                    });
                    return newUsers;
                });
        }

        function createUser(user) {
            return $http.post(baseUrl + 'api/Users/', user)
                .then(function (result) {
                    return result.data;
                });
        }

        function updateUser(user) {
            var id = user.id;
            return $http.put(baseUrl + 'api/Users/' + id, user)
                .then(function (result) {
                    return result.data;
                });
        }
    }
})();
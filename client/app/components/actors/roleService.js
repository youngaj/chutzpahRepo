(function (){

    'use strict';

    var serviceId = 'roleService';
    angular
        .module('app.components.actors')
        .factory(serviceId, roleService);

    roleService.$inject = ['$http', 'common'];


    function roleService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;
        var featureOptions = common.featureOptions;


        // Define the functions and properties to reveal.
        var roles = null;

        var service = {
            createRole: createRole,
            getById: getById,
            getAll: getAll,
            getFeatureSecurity: getFeatureSecurity,
            goToDetail:goToDetail,
            updateRole: updateRole,
        };

        return service;

        function createRole(role) {
            return $http.post(baseUrl + 'api/Roles/', role).then(function (result) {
                updateOrReplaceRole(result.data);
                return result.data;
            });
        }

        function getAll() {
            if (roles !== null)
                return $q.when(roles);

            return $http.get(baseUrl + 'api/Roles')
                    .then(function (result) {
                        roles = result.data;
                        return roles;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Roles/' + id)
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

        function goToDetail(id) {
            $state.go("app.actors.roles.edit", { id: id });
        }

        function updateRole(role) {
            var id = role.id;
            return $http.put(baseUrl + 'api/Roles/' + id, role).then(function (result) {
                updateOrReplaceRole(result.data);
                return result.data;
            });
        }

        //#region Internal Methods
        function updateOrReplaceRole(role) {
            var index = -1;

            if (roles === null) {
                roles = [];
            }

            for (var i = 0; i < roles.length; i++) {
                if (roles[i].id === role.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                roles.splice(index, 1);
            }
            roles.push(role);

        }
        //#endregion
    }
})();
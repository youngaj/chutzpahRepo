(function (){

    'use strict';

    var serviceId = 'groupService';
    angular
        .module('app.components.actors')
        .factory(serviceId, groupService);

    groupService.$inject = ['$http', '$state', 'common'];

    function groupService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;
        var featureOptions = common.featureOptions;

        // Define the functions and properties to reveal.
        var groups = null;

        var service = {
            createGroup: createGroup,
            getById: getById,
            getAll: getAll,
            getGroupMembers: getGroupMembers,
            getFeatureSecurity: getFeatureSecurity,
            goToDetail: goToDetail,
            updateGroup: updateGroup,
        };

        return service;

        function getAll() {
            if (groups !== null)
                return $q.when(groups);


            return $http.get(baseUrl + 'api/Groups')
                    .then(function (result) {
                        groups = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Groups/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getGroupMembers(groupId) {
            return $http.get(baseUrl + 'api/Groups/' + groupId + '/Members')
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
                    case featureOptions.memberUpdate:
                        security.allowMemberUpdate = true;
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
            $state.go("app.actors.groups.edit", { id: id });
        }

        function createGroup(group) {
            return $http.post(baseUrl + 'api/Groups/', group)
                    .then(function (result) {
                        updateOrReplaceGroup(result.data);
                        return result.data;
                    });
        }

        function updateGroup(group) {
            var id = group.id;
            return $http.put(baseUrl + 'api/Groups/' + id, group)
                    .then(function (result) {
                        updateOrReplaceGroup(result.data);
                        return result.data;
                    });
        }

        //#region Internal Methods
        function updateOrReplaceGroup(group) {
            var index = -1;

            if (groups === null) {
                groups = [];
            }

            for (var i = 0; i < groups.length; i++) {
                if (groups[i].id === group.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                groups.splice(index, 1);
            }
            groups.push(group);

        }
        //#endregion
    }
})();
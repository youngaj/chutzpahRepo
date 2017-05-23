(function () {

    'use strict';

    var serviceId = 'groupMemberService';
    angular
        .module('app.components.actors')
        .factory(serviceId, groupMemberService);

    groupMemberService.$inject = ['$http', 'common'];

    function groupMemberService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var groupMembers = null;

        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            getByGroupId: getByGroupId,
            remove: remove,
        };

        return service;

        function create(groupMember) {
            return $http.post(baseUrl + 'api/GroupMembers/', groupMember)
                    .then(function (result) {
                        updateOrReplaceGroup(result.data);
                        return result.data;
                    });
        }

        function getAll() {
            if (groupMembers !== null)
                return $q.when(groupMembers);


            return $http.get(baseUrl + 'api/GroupMembers')
                    .then(function (result) {
                        groupMembers = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/GroupMembers/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getByGroupId(id) {
            return $http.get(baseUrl + 'api/GroupMembers/' + id+ '/Members')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/GroupMembers/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        //#region Internal Methods
        function updateOrReplaceGroup(groupMember) {
            var index = -1;

            if (groupMembers === null) {
                groupMembers = [];
            }

            for (var i = 0; i < groupMembers.length; i++) {
                if (groupMembers[i].id === groupMember.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                groupMembers.splice(index, 1);
            }
            groupMembers.push(groupMember);

        }
        //#endregion
    }
})();
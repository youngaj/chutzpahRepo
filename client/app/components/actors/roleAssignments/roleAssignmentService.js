(function () {

    'use strict';

    var serviceId = 'roleAssignmentService';
    angular
        .module('app.components.actors')
        .factory(serviceId, roleAssignmentService);

    roleAssignmentService.$inject = ['$http', 'common'];

    function roleAssignmentService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            getByRoleId: getByRoleId,
            getByEntityCompositeKey: getByEntityCompositeKey,
            remove: remove,
        };

        return service;

        function create(roleAssignment) {
            return $http.post(baseUrl + 'api/RoleAssignments', roleAssignment)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getAll() {
            if (roleAssignments !== null)
                return $q.when(roleAssignments);


            return $http.get(baseUrl + 'api/RoleAssignments')
                    .then(function (result) {
                        roleAssignments = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/RoleAssignments/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getByEntityCompositeKey(entityCompositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + entityCompositeKey + '/RoleAssignments')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getByRoleId(id) {
            return $http.get(baseUrl + 'api/Role/' + id+ '/Assignments')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/RoleAssignments/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

    }
})();
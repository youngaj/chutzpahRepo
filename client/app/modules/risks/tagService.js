(function () {
    'use strict';

    var serviceId = 'tagService';
    angular
        .module('app.modules.risks')
        .factory(serviceId, tagService);

    tagService.$inject = ['$http', '$state', 'common'];

    function tagService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            getAllByEntityCompositeKey: getAllByEntityCompositeKey,
            getAllByClassType: getAllByClassType,
            search: search,
            searchType: searchType,
            update: update,
        };

        return service;

        function create(tag) {
            return $http.post(baseUrl + 'api/Tags/', tag)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Tags')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getAllByEntityCompositeKey(entityCompositeKey) {
            return $http.get(baseUrl + 'api/Entity/'+entityCompositeKey+'/Tags')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getAllByClassType(classType) {
            return $http.get(baseUrl + 'api/EntityType/'+classType+'/Tags')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Tags/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function search(query) {
            return $http.post(baseUrl + 'api/Tag-Search/', query)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function searchType(classType, query) {
            return $http.post(baseUrl + 'api/Search/EntityType/' + classType + '/Tags', { query: query })
                    .then(function (result) {
                        return result.data;
                    });
        }

        function update(tag) {
            var id = tag.id;
            return $http.put(baseUrl + 'api/Tags/' + id, tag)
                    .then(function (result) {
                        return result.data;
                    });
        }
    }
})();
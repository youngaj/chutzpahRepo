(function () {
    'use strict';

    var serviceId = 'searchService';
    angular
        .module('app.modules.search')
        .factory(serviceId, searchService);

    searchService.$inject = ['$http', '$state', 'common', 'userService'];

    function searchService($http, $state, common, userService) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var service = {
            bulkInsert: bulkInsert,
            search: search,
        };

        return service;

        function search(type, searchText, page, size) {

            //elasticSearch(searchText);
            return $http.get(baseUrl + 'api/Search?type=' + type + '&queryText=' + searchText + '&page=' + page)
                    .then(function (result) {
                        var searchResponse = result.data;
                        _.map(searchResponse.results, function (item) {
                            if (item.class === 'User') {
                                userService.formatAvatars(item.entity);
                            }
                            return item;
                        });
                        setSearchQuery(searchText);
                        return searchResponse;
                    });
        }

        function setSearchQuery(searchText) {
            $state.go('.', { q: searchText }, { notify: false });
        }

        function bulkInsert() {
            return $http.post(baseUrl + 'api/Search/BulkInsert')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function elasticSearch(text) {
            return $http.get(baseUrl + 'api/Search/ElasticSearch', text)
                    .then(function (result) {
                        return result.data;
                    });
        }
    }
})();
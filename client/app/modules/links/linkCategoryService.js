(function () {
    'use strict';

    var serviceId = 'linkCategoryService';
    angular
        .module('app.modules.links')
        .factory(serviceId, linkCategoryService);

    linkCategoryService.$inject = ['$http', '$state', 'common'];

    function linkCategoryService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var linkCategories = null;

        var service = {
            create: create,
            getById: getById,
            getAll: getAll,
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
        };

        return service;

        function create(linkCategory) {
            return $http.post(baseUrl + 'api/LinkCategories/', linkCategory)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        function getAll() {
            if (linkCategories !== null)
                return $q.when(linkCategories);


            return $http.get(baseUrl + 'api/LinkCategories')
                    .then(function (result) {
                        linkCategories = result.data;
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/LinkCategories/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function goToDetail(id) {
            $state.go("app.linksCategories.edit", { id: id });
        }

        function goToList() {
            $state.go("app.linksCategories");
        }


        function update(linkCategory) {
            var id = linkCategory.id;
            return $http.put(baseUrl + 'api/LinkCategories/' + id, linkCategory)
                    .then(function (result) {
                        updateOrReplace(result.data);
                        return result.data;
                    });
        }

        function updateOrReplace(linkCategory) {
            var index = -1;

            if (linkCategories === null) {
                linkCategories = [];
            }

            for (var i = 0; i < linkCategories.length; i++) {
                if (linkCategories[i].id === linkCategories.id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                linkCategories.splice(index, 1);
            }
            linkCategories.push(linkCategory);

        }
    }

})();
(function () {
    var serviceId = 'projectService';
    angular
        .module("app.components.common")
        .factory(serviceId, projectService);

    projectService.$inject = ['$http', 'common'];

    function projectService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var projects = null;

        var service = {
            get: get,
            getAll: getAll,
            remove: remove,
            save: save,
            saveMultiple: saveMultiple
        };

        return service;

        function get(id) {
            return $http.get(baseUrl + 'api/Projects/' + id)
                    .then(function (result) {
                        var project = result.data;
                        return project;
                    });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Projects')
                    .then(function (result) {
                        var projects = result.data;
                        return projects;
                    });
        }

        function remove(id) {
            return $http.delete(baseUrl + 'api/Projects/' + id)
                    .then(function (result) {
                        return result.data;
                    });
        }

        function save(project) {
            if (angular.isDefined(project.id) || project.id === 0) {
                return create(project);
            } else {
                return udpate(project);
            }
        }

        function saveMultiple(entityCompositeKey, projects) {
            return $http.post(baseUrl + 'api/Entity/' + entityCompositeKey + '/Projects', projects)
                    .then(function (result) {
                        var projects = formatAvatars(result.data);
                        return projects;
                    });
        }

        function create(project) {
            return $http.post(baseUrl + 'api/Projects', project)
                    .then(function (result) {
                        var project = result.data;
                        return project;
                    });
        }

        function update(project) {
            var id = project.id;
            return $http.put(baseUrl + 'api/Projects/' + id, project)
                    .then(function (result) {
                        return project;
                    });
        }

    }
})();
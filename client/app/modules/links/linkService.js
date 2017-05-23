(function () {
    'use strict';

    var serviceId = 'linkService';
    angular
        .module('app.modules.links')
        .factory(serviceId, linkService);

    linkService.$inject = ['$http', '$state', 'common'];

    function linkService($http, $state, common) {
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
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
        };

        return service;

        function create(link) {
            var validationResult = validate(link);
            if (validationResult.isSuccessful) {
                return $http.post(baseUrl + 'api/Links/', link)
                        .then(function (result) {
                            $state.go("app.links.detail", { id: result.data.id}, {location: 'replace' });
                            return result.data;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function formatErrorsForDisplay(msgs) {
            var formatedMsg = msgs.length + " validation errors found. <ul>";
            for (var i = 0; i < msgs.length; i++) {
                formatedMsg = formatedMsg + "<li>" + msgs[i] + "</li>";
            }
            formatedMsg = formatedMsg + "</ul>";
            return formatedMsg;
        }

        function formatDates(link) {
            var serverformat = moment.ISO_8601;
            link.created = formatDate(link.created, serverformat, "MM-DD-YYYY");
            return link;
        }

        function formatDate(date, currentFormat, desiredFormat) {
            if (moment(date, currentFormat).isValid()) {
                date = moment(date, currentFormat).format(desiredFormat);
                return date;
            }
            return null;
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Links')
                    .then(function (result) {
                        return result.data;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Links/' + id)
                    .then(function (result) {
                        var link = result.data;
                        link = formatDates(link);
                        return link;
                    });
        }

        function goToDetail(id) {
            $state.go("app.links.detail", { id: id });
        }

        function goToList() {
            $state.go("app.links");
        }

        function update(link) {
            var validationResult = validate(link);
            if (validationResult.isSuccessful) {
                var id = link.id;
                return $http.put(baseUrl + 'api/Links/' + id, link)
                        .then(function (result) {
                            return result.data;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function validate(link) {
            var result = {
                isSuccessful: true,
                msgs: []
            };

            if (angular.isDefined(link) === true && link !== null) {
                if (angular.isDefined(link.text) === false || link.text === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Link text empty");
                }
                if (angular.isDefined(link.href) === false || link.href === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Link href not set");
                }
            } else {
                result.isSuccessful = false;
                result.msgs.push("Link empty");
            }
            return result;
        }
    }
})();
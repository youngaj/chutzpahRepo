(function () {
    'use strict';

    var serviceId = 'photoService';
    angular
        .module('app.modules.photos')
        .factory(serviceId, photoService);

    photoService.$inject = ['$http', '$location', '$state', 'common'];

    function photoService($http, $location, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var service = {
            create: create,
            getAll: getAll,
            getPage: getPage,
            download: download,
        };

        return service;

        function create(photo) {
            var validationResult = validate(photo);
            if (validationResult.isSuccessful) {
                return $http.post(baseUrl + 'api/Photos/', photo)
                        .then(function (result) {
                            photo = result.data;
                            return photo;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function download(photo) {
            window.location = baseUrl + 'api/Photos/' + photo.compositeKey + '/Download';
            return $q.when(true);
        }

        function formatErrorsForDisplay(msgs) {
            var formatedMsg = msgs.length + " validation errors found. <ul>";
            for (var i = 0; i < msgs.length; i++) {
                formatedMsg = formatedMsg + "<li>" + msgs[i] + "</li>";
            }
            formatedMsg = formatedMsg + "</ul>";
            return formatedMsg;
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Photos')
                    .then(function (result) {
                        var data = result.data;
                        _.map(data.models, function (photo) {
                            formatUrls(photo);
                        });
                        return data;
                    });
        }

        function getPage(searchText, offset, limit) {

            if (angular.isUndefined(offset) || offset === null)
                offset = 0;

            var url = baseUrl + 'api/Photos?searchText='+searchText+'&offset='+offset+ '&limit=' + limit;
            if (angular.isDefined(limit) && offset !== limit)
                url = url + '&limit=' + limit;

            return $http.get(url)
                    .then(function (result) {
                        var data = result.data;
                        _.map(data.models, function (photo) {
                            formatUrls(photo);
                        });
                        return data;
                    });
        }

        function formatUrls(photo) {
            if (photo !== null) {
                photo.thumbnailUrl = baseUrl + photo.thumbnailUrl;
                photo.imageUrl = baseUrl + photo.imageUrl;
                photo.img_thumb = photo.thumbnailUrl;
                photo.img_full = photo.imageUrl;
            }
            return photo;
        }

        function goToDetail(photo) {
            var stateName = "app.photos.detail";
            if (angular.isDefined(photo.project) && photo.project !== null) {
                var stateParams = { project: photo.project.name, num: photo.num };
                return $state.go(stateName, stateParams, {}).then(function (state) {
                    return $location.absUrl();
                });
            } else {
                return goToDetailById(photo.id);
            }
        }

        function goToList() {
            $state.go("app.photos");
        }

        function remove(photoId) {
            return $http.delete(baseUrl + 'api/Photos/' + photoId)
                .then(function (result) {
                    return result;
                });
        }
    }
})();
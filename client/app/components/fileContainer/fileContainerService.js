
(function () {
    'use strict';

            var serviceId = 'fileContainerService';

    angular
        .module('app.components.fileContainer')
        .factory('fileContainerService', fileContainerService);

    fileContainerService.$inject = ['$http', '$location', 'common'];
    function fileContainerService($http, $location, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);

        var baseUrl = common.baseUrl;
        var dropZoneIds = [];
        var containers = [];

        // Define the functions and properties to reveal.

        var service = {
            getFileContainers: getFileContainers,
            getFileContainerById: getFileContainerById,
            getFiles: getFiles,
            getEntityFiles: getEntityFiles,
            downloadSymphonyFile: downloadSymphonyFile,
            createDefaultContainer: createDefaultContainer,
            registerSendingDropZoneEvent: registerSendingDropZoneEvent,
            isDropZonePresent: isDropZonePresent,
            attachDropzone: attachDropzone,
            createDropZone: createDropZone,
            resetDropZones: resetDropZones,
            removeFile: removeFile,
            setUpDropZone: setUpDropZone,
            formatFile: formatFile,
            updateFileMetaData: updateFileMetaData
        };

        return service;

        function setUpDropZone() {
            resetDropZones();
            createDropZone();
        }

        function createDropZone(container, entityCompositeKey, autoProcess, entityReference) {
            var dropzoneId = null;
            if (angular.isUndefined(entityCompositeKey))
                entityCompositeKey = '';

            if (!container) {
                container = getContainerOrDefault();
            }

            dropzoneId = "#uploadContainer_" + container.id;
            var myDropzone = attachDropzone(dropzoneId, entityCompositeKey, autoProcess);
            registerSendingDropZoneEvent(myDropzone, entityReference);
            registerSuccessDropZoneEvent(myDropzone);
            return myDropzone;
        }

        function attachDropzone(dropzoneId, entityCompositeKey, autoProcess) {
            var myDropzone = null;
            var uploadContainer = $(dropzoneId);
            if (angular.isUndefined(autoProcess) || autoProcess === null) {
                autoProcess = true;
            }
            if (isDropZonePresent(uploadContainer) === false) {
                myDropzone = new Dropzone(dropzoneId, {
                    url: baseUrl + "api/Entities/" + entityCompositeKey + "/Files",
                    clickable: true,
                    dictDefaultMessage: '<span class="text-center"><span class="font-lg visible-xs-block visible-sm-block visible-lg-block"><span class="font-lg"><i class="fa fa-caret-right text-danger"></i> Drop files <span class="font-xs">to upload</span></span><span>&nbsp&nbsp<h4 class="display-inline"> (Or Click)</h4></span>',
                    autoProcessQueue: autoProcess,
                    uploadMultiple: true,
                    parallelUploads: 4,
                    withCredentials: true,
                    maxFilesize: 4000,
                    init: function () {
                        //debug("inside dropzone init");
                    }
                });
            }
            return myDropzone;
        }

        function registerSendingDropZoneEvent(myDropzone, entityReference) {
            //-- register file sending listener
            if (angular.isDefined(myDropzone) && myDropzone !== null) {
                var uri = $location.absUrl();
                myDropzone.on("sending", function (file, xhr, formData) {
                    formData.append("uri", uri);
                    formData.append("compositeKey", entityReference.name);
                    formData.append("id", entityReference.id);
                    formData.append("classType", entityReference.classType);
                    formData.append("name", entityReference.name);
                    formData.append("title", entityReference.title)
                    formData.append("text", entityReference.text);
                    formData.append("entityReference", entityReference);
                });
            }
        }

        function registerSuccessDropZoneEvent(myDropzone) {
            //-- register upload success listener
            if (angular.isDefined(myDropzone) && myDropzone !== null) {
                myDropzone.on("success", handleSuccessfulFileUpload);
                //myDropzone.on("successmultiple", handleSuccessfulFileUpload);
                myDropzone.on("complete", function (file) {
                    myDropzone.removeAllFiles();
                });
            }
        }

        function handleSuccessfulFileUpload(file, serverResponse) {
            if (angular.isDefined(serverResponse) && serverResponse != null) {
                var uploadedFiles = serverResponse;
                var containerId = uploadedFiles[0].containerId;
                common.$broadcast("container_updated", containerId);
            }
        }

        function isDropZonePresent(element) {
            var result = false;
            if (element.children().length > 0)
                result = true;
            return result;
        }

        function doesDropZoneExists(container) {
            var result = false;
            var dropzoneId = "#uploadContainer_" + container.id;
            for (var i = 0; i < dropZoneIds.length; i++) {
                if (dropZoneIds[i] === dropzoneId) {
                    return result;
                }
            }
            return result;
        }

        function resetDropZones() {
            dropZoneIds = [];
            containers = [];
        }

        function getContainer(containerId) {
            var container = {};
            for (var i = 0; i < containers.length; i++) {
                container = containers[i];
                if (container.id === containerId) {
                    return $q.when(container);
                }
            }
            return getFileContainerById(containerId).then(function (data) {
                return data;
            })
        }

        function getContainerOrDefault() {
            var container = {};
            if (containers != 'undefined' && containers.length > 0) {
                contianer = containers[0];
            } else {
                container = createDefaultContainer();
            }
            return container;
        }

        function createDefaultContainer() {
            var defaultContainer = {
                id: 0,
                name: 'Default Container',
                activeView: "uploadView",
                files: []
            };
            return defaultContainer;
        }

        function getFiles() {
            return $http.get(baseUrl + 'api/Files')
                .then(function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        result.data[i] = formatFile(result.data[i]);
                    }
                    return result.data;
                });
        }

        function getEntityFiles(compositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + compositeKey + '/Files')
                .then(function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        result.data[i] = formatFile(result.data[i]);
                    }
                    return result.data;
                });
        }

        function formatFile(file) {
            file.dateUpload = moment(file.dateUpload).format("MMM Do YYYY");
            file.dateCreated = moment(file.dateCreated).format("MMM Do YYYY");
            file = formatIcon(file);
            return file;
        }

        function formatIcon(file) {
            if (file.hasThumbnail) {
                file.thumbnailImageUrl = baseUrl + file.thumbnailImageUrl;
            }
            return file;
        }

        function downloadSymphonyFile(entity) {
            return $q.when(downloadTest(entity));
        }

        function downloadTest(entity) {
            window.location = baseUrl + 'api/Files/' + entity.id + '/Download';
        }

        function getFileContainers(compositeKey) {
            return $http.get(baseUrl + 'api/Entities/' + compositeKey + '/FileContainers')
                .then(function (result) {
                    var data = result.data;
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var container = {};
                            container = data[i];
                            _.map(container.files, function (file) {
                                formatFile(file);
                            })
                            container.activeView = "iconView";
                            container.displayFileEdit = false;
                            container.selectedFile = {};
                            containers.push(container);
                        }
                    }
                    return data;
                    //return result.data;
                });
        }

        function getFileContainerById(id) {
            var container = {};
            return $http.get(baseUrl + 'api/FileContainers/' + id)
                .then(function (result) {
                    var data = result.data;
                    if (angular.isDefined(data)) {
                        container = data;
                        container.activeView = "iconView";
                        container.displayFileEdit = false;
                        container.selectedFile = {};
                        containers.push(container);
                    }
                    return container;
                });
        }

        function removeFile(id, entityReference) {
            return $http.delete(baseUrl + 'api/Files/' + id, entityReference)
                    .then(function (result) {
                        removeFileFromContainer(id);
                        return result;
                    });
        }

        function removeFileFromContainer(id) {
            if (angular.isDefined(containers[0])) {
                var files = containers[0].files;
                _.remove(files, function (file) { return file.id === id; });
            }
        }

        function updateFileMetaData(file) {
            var id = file.id;
            return $http.put(baseUrl + 'api/Files/' + id, file)
                .then(function (result) {
                    return result;
                });

        }

    }

})();
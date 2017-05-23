  (function () {
      "use strict";

    var controllerId = 'FileContainerCntrl';
    angular
        .module('app.components.fileContainer')
        .controller(controllerId, FileContainerCntrl);

    FileContainerCntrl.$inject = ['$scope', '$filter', 'common', 'fileContainerService'];

    function FileContainerCntrl($scope, $filter, common, fileContainerService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var dropZoneCreated = false;

        var myDropzone = null;

        $scope.title = 'FileContainerCntrl';
        $scope.latestRevisions = [];
        activate();

        function activate() {
            if ($scope.preload !== true) {
                if (angular.isUndefined($scope.entityCompositeKey) == false) {
                    return getFileContainers($scope.entityCompositeKey);
                }
            }
        }

        $scope.getFileContainers = getFileContainers;
        $scope.displayRevisions = displayRevisions;
        $scope.container = fileContainerService.createDefaultContainer();
        $scope.downloadSelectedFile = downloadSelectedFile;
        $scope.deleteFile = deleteFile;
        $scope.saveFile = saveFile;
        $scope.selectFile = selectFile;
        $scope.updateContainerView = updateContainerView;
        $scope.loadInitialData = loadInitialData;
        $scope.dropZoneDisplayed = false;
        $scope.emptyGuid = common.emptyGuid;
        $scope.executeAction = executeAction;
        $scope.updateAutoProcess = updateAutoProcess;
        $scope.updateConfig = updateConfig;

        $scope.$on("container_updated", function (event, containerId) {
            if (angular.isDefined(containerId) && containerId === $scope.container.id) {
                getFileContainers($scope.entityCompositeKey).then(function (containers) {
                    var container = containers[0];
                    $scope.container.activeView = 'iconView';
                    if (angular.isDefined($scope.selectedRevision)) {
                        $scope.selectedRevision = _.find(container.files, function (file) {
                            return file.id === $scope.selectedRevision.id;
                        });
                        displayRevisions($scope.selectedRevision);
                        $scope.revisionView = 'view';
                    }
                });

            }
        });

        function loadInitialData(data) {
            processContainerData(data);
            $scope.container.activeView = 'iconView';
        }

        function getFileContainers(entityCompositeKey) {
            if (entityCompositeKey != null) {
                return fileContainerService.getFileContainers(entityCompositeKey)
                    .then(processContainerData);
            }
        }

        function processContainerData(data) {
            $scope.container = fileContainerService.createDefaultContainer();
            if (data.length > 0) {
                $scope.container = data[0];
                setLatestRevisions($scope.container);
                for (var j = 0; j < $scope.container.files.length; j++) {
                    var file = $scope.container.files[j];
                    wireUpFileWatcher(file);
                }
            }
            else {
                var defaultContainer = fileContainerService.createDefaultContainer();
                updateContainerView(defaultContainer, 'uploadView');
                $scope.container = defaultContainer;
            }

            return data;
        }

        function setLatestRevisions(container) {
            $scope.latestRevisions = _.filter(container.files, function (currFile) {
                return currFile.state === "Current";
            });
        }
        //-- Trying to wire up a watcher to determine when the parent file reference is changed.
        function wireUpFileWatcher(file) {
            if (file !== null) {
                $scope.$watch(function () { return file.ParentFile },
                    function (newValue, oldValue) {
                        if (oldValue !== newValue) {
                            if (oldValue !== null) {
                                file.previousParent = oldValue;
                                file.previousParentId = oldValue.id;
                            }
                            else {
                                file.previousParent = null;
                                file.previousParentId = null;
                            }
                            file.parentChanged = true;

                            var oldValueName = '';
                            var newValueName = '';
                            if (oldValue !== null) {
                                oldValueName = oldValue.name;
                            }
                            if (newValue !== null) {
                                newValueName = newValue.name;
                            }
                        }
                    });
            }
        }

        function deleteFile(file) {
            return fileContainerService.removeFile(file.id, $scope.entityReference)
                .then(function (response) {
                    _.remove($scope.container.files, function (currFile) { return currFile.id === file.id; });
                    if (file.revision > 0) {
                        var revGroup = _.filter($scope.container.files, function (currfile) { return currfile.revGroup == file.revGroup });
                        var latestRev = _.max(revGroup, function (currFile) { return currFile.revision });
                        latestRev.state = "Current";
                    }
                    setLatestRevisions($scope.container);
                    logSuccess(file.name + " deleted.");
                    common.$broadcast("container_updated", $scope.container.id);
                }, function (errorResponse) {
                    logError("Problem deleting the file");
                    console.error(errorResponse);
                });
        }

        function selectFile(file){
            $scope.selectedFile = file;
        }

        function saveFile(file) {
            if (angular.isDefined(file) && file != null) {
                fileContainerService.updateFileMetaData(file)
                    .then(function (result) {
                        logSuccess("File metadata updated.");
                    })
                    .catch(function (error) {
                        logError("Error saving file metadata");
                    });
            }
        }

        function displayRevisions(file) {
            $scope.revisions = [file];
            $scope.selectedRevision = file;
            if (file.revGroup !== common.emptyGuid) {
                $scope.revisions = _.filter($scope.container.files, function (currFile) {
                    return currFile.revGroup === file.revGroup;
                });
            }
        }

        function downloadSelectedFile(file) {
            log("Requesting file: '" + file.name+ "' from the server.");
            return fileContainerService.downloadSymphonyFile(file)
                .then(function (response) {
                });
        }

        function updateContainerView(container, view) {
            container.activeView = view;
            if (view === 'uploadView') {
                var compositeKey = $scope.entityCompositeKey;
                myDropzone = fileContainerService.createDropZone(container, compositeKey, $scope.autoProcess, $scope.entityReference);
            }
        }

        function executeAction(action) {
            if (action === 'submit') {
                if (angular.isDefined(myDropzone) && myDropzone != null) {
                    myDropzone.processQueue();
                } else {
                    logError("myDropzone is null", myDropzone);
                }
            }
        }

        function updateAutoProcess(autoProcess){
            if(myDropzone != null){
                myDropzone.autoProcessQueue = autoProcess;
            }
        }

        function updateConfig(config){
            //TODO: Implement configuration
        }
    }

  })();

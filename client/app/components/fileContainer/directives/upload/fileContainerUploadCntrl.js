(function () {
    "use strict";

    var controllerId = 'FileContainerUploadCntrl';
    angular
        .module('app.components.common')
        .controller(controllerId, FileContainerUploadCntrl);

    FileContainerUploadCntrl.$inject = ['$scope', '$filter', '$timeout', 'common', 'fileContainerService'];

    function FileContainerUploadCntrl($scope, $filter, $timeout, common, fileContainerService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var myDropzone = null;
        $scope.dropZoneId = "uploadContainer_0";
        $scope.title = 'FileContainer Upload Cntrl';
        activate();

        function activate() {
        }

        $scope.container = {};
        $scope.executeAction = executeAction;

        function createDropzone() {
            if (angular.isDefined($scope.entityCompositeKey) && $scope.entityCompositeKey != null) {
                fileContainerService.getFileContainers($scope.entityCompositeKey).then(function (containers) {
                    if (containers.length > 0) {
                        var container = _.first(containers);
                        $scope.dropZoneId = "uploadContainer_" + container.id;
                        //delay the creation until the dom element can be updated with the new id
                        $timeout(function () {
                            myDropzone = fileContainerService.createDropZone(container, $scope.entityCompositeKey, $scope.autoProcess, $scope.entityReference);
                        });
                    }
                    else
                        myDropzone = newDropzone();
                });
            } else {
                myDropzone = newDropzone();
            }
        }

        function executeAction(action) {
            if (action === 'create') {
                createDropzone();
            }

            if (action === 'submit') {
                //sendFiles();
                if (angular.isDefined(myDropzone) && myDropzone != null) {
                    myDropzone.processQueue();
                } else {
                    logError("myDropzone is null", myDropzone);
                }
            }
        }

        function newDropzone() {
            var dropZoneElementId = "#" + $scope.dropZoneId;
            return fileContainerService.attachDropzone(dropZoneElementId, $scope.entityCompositeKey, $scope.autoProcess);
        }

        function sendFiles() {
            if (angular.isDefined(myDropzone) && myDropzone != null) {
                myDropzone.processQueue();
            } else {
                logError("myDropzone is null", myDropzone);
            }
        }

    }


})();

(function () {
    'use strict';

    angular
          .module('app.components.fileContainer')
          .component('fileRevision', {
              templateUrl: 'app/components/fileContainer/directives/revision/fileRevision.component.html',
              controller: FileRevisionCntrl,
              controllerAs: 'vm',
              bindings: {
                  entityCompositeKey: '<',
                  entityReference: '<',
                  originalFile:'<',
                  container: '<',
                  revisionView:'='
              }
          });

    FileRevisionCntrl.$inject = ['common', 'fileContainerService'];
    function FileRevisionCntrl(common, fileContainerService) {
        /* jshint validthis:true */
        var vm = this;
        var controllerId = "FileRevisionCntrl";
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var dropZoneCreated = false;

        var baseUrl = common.baseUrl;

        vm.$onInit = function () {
            if (angular.isDefined(vm.originalFile))
                createDropZone(vm.container, vm.originalFile, vm.autoProcess, vm.entityReference);
        };

        vm.$onChanges = function (changesObj) {
            if (angular.isDefined(vm.originalFile))
                createDropZone(vm.container, vm.originalFile, vm.autoProcess, vm.entityReference);
        }

        function createDropZone(container, originalFile, autoProcess, entityReference) {
            var dropzoneId = null;

            if (!container) {
                container = getContainerOrDefault();
            }

            dropzoneId = "#revisionContainer";
            var myDropzone = attachDropzone(dropzoneId, originalFile, autoProcess);
            fileContainerService.registerSendingDropZoneEvent(myDropzone, entityReference);
            registerSuccessDropZoneEvent(myDropzone);
            return myDropzone;
        }

        function attachDropzone(dropzoneId, originalFile, autoProcess) {
            var myDropzone = null;
            var uploadContainer = $(dropzoneId);
            if (angular.isUndefined(autoProcess) || autoProcess === null) {
                autoProcess = true;
            }
            if (fileContainerService.isDropZonePresent(uploadContainer) === false) {
                myDropzone = new Dropzone(dropzoneId, {
                    url: baseUrl + "api/Files/" + originalFile.id + "/Revision",
                    clickable: true,
                    dictDefaultMessage: '<span class="text-center"><span class="font-lg visible-xs-block visible-sm-block visible-lg-block"><span class="font-lg"><i class="fa fa-caret-right text-danger"></i> Drop file <span class="font-xs">to upload your revision</span></span><span>&nbsp&nbsp<h4 class="display-inline"> (Or Click)</h4></span>',
                    autoProcessQueue: autoProcess,
                    uploadMultiple: false,
                    withCredentials: true,
                    maxFilesize: 4000,
                    init: function () {
                        //debug("inside dropzone init");
                    }
                });
            }
            return myDropzone;
        }

        function registerSuccessDropZoneEvent(myDropzone) {
            //-- register upload success listener
            if (angular.isDefined(myDropzone) && myDropzone !== null) {
                myDropzone.on("success", function (file, serverResponse) {
                    for (var i = 0; i < serverResponse.length; i++) {
                        var currFile = serverResponse[i];
                        logSuccess("Revision upload successful");
                        vm.container.files.push(currFile);
                        common.$broadcast("container_updated", vm.container.id);
                    }
                });
            }
        }
    }

})();
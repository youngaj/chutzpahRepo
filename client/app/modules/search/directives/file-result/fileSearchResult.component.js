(function () {
    "use strict";


    angular
        .module('app.modules.search')
          .component('fileSearchResult', {
              templateUrl: 'app/modules/search/directives/file-result/fileSearchResult.component.html',
              controller: FileSearchResultCntrl,
              controllerAs: 'vm',
              bindings: {
                  file: '<',
              }
          });

    FileSearchResultCntrl.$inject = ['common', 'fileContainerService', 'virtualFolderService'];
    function FileSearchResultCntrl(common, fileContainerService, virtualFolderService) {
        var vm = this;

        var controllerId = "FileSearchResultCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var fileSearchResult = [];

        vm.goTo = goTo;
        vm.state = {
            isLoading: true
        };

        vm.$onInit = function () {
        };

        vm.$onChanges = function (changesObj) {
        } 

        function goTo(entity) {
            var entityCompositeKey = entity.parentCompositeKey;
            if(entityCompositeKey.includes("Virtual")){
                var components = entityCompositeKey.split('-');
                var id = components[1];
                var classType = components[0];
                virtualFolderService.navigateToEdit(id, classType);
            }

            if(entityCompositeKey.includes("User")){
            }

        }

    }
})();
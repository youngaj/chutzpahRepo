(function (){

    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .controller('VirtualFolderCntrl', VirtualFolderCntrl);

    VirtualFolderCntrl.$inject = ['common', 'virtualFolderService',];

    function VirtualFolderCntrl(common, virtualFolderService) {
        var controllerId = 'VirtualFolderCntrl';
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.seletedNode = {};
        vm.title = 'Virtual Folders';
        vm.addVirtualTree = addVirtualTree;
        vm.treeView = {
            showArchived: false,
            archiveBtnText: "Show Archived Trees"
        }
        vm.toogleArchived = toogleArchived;

        function addVirtualTree() {
            var id = null;
            var wizardType = 'VirtualTree';
            virtualFolderService.navigateToWizard(id, wizardType);
        }

        function toogleArchived() {
            if (vm.treeView.showArchived)
            {
                vm.treeView.showArchived = false;
                vm.treeView.archiveBtnText = " Show Archived Trees";
            } else {
                vm.treeView.showArchived = true;
                vm.treeView.archiveBtnText = " Hide Archived Trees";
            }
        }
    }

})();
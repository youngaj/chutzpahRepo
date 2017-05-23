(function () {
    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .directive('treeView', treeView);

    treeView.$inject = ['$window'];

    function treeView($window) {
        // Usage:
        //     <treeView></treeView>
        // Creates:
        //
        var directive = {
            controller: 'TreeViewCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/modules/virtual-folders/directives/treeView/treeView.html',
            link: link,
            restrict: 'EA',
            bindToController: {
                showArchived: '=?'
            },
            scope: {},
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();


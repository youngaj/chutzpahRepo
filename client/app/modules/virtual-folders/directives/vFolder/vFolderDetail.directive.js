(function () {
    "use strict";

    angular
         .module('app.modules.virtualFolders')
         .directive('vFolderDetail', vFolderDetail);

    vFolderDetail.$inject = ['$window'];

    function vFolderDetail($window) {
        // Usage:
        //     <vFolderDetail></vFolderDetail>
        // Creates:
        //

        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                entity: '=',
                allowEdit: '=',
                statuses: '='
            },
            controller: 'vFolderDetailCntrl',
            templateUrl: 'app/modules/virtual-folders/directives/vFolder/vFolderDetail.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();

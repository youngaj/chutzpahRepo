(function () {
    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .directive('vLibraryDocDetail', vLibraryDocDetail);

    vLibraryDocDetail.$inject = ['$window'];

    function vLibraryDocDetail($window) {
        // Usage:
        //     <vLibraryDocDetail></vLibraryDocDetail>
        // Creates:
        //

        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                entity: '=',
                allowEdit: '=',
                statuses: '=',
                parent: '='
            },
            controller: 'vLibraryDocDetailCntrl',
            templateUrl: 'app/modules/virtual-folders/directives/vLibraryDoc/vLibraryDocDetail.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();

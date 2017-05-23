(function (){
    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .directive('vLinkDetail', vLinkDetail);

    vLinkDetail.$inject = ['$window'];

    function vLinkDetail($window) {
        // Usage:
        //     <vLinkDetail></vLinkDetail>
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
            controller: 'vLinkDetailCntrl',
            templateUrl: 'app/modules/virtual-folders/directives/vLink/vLinkDetail.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();

(function (){
    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .directive('vPhotoDetail', vPhotoDetail);

    vPhotoDetail.$inject = ['$window'];

    function vPhotoDetail($window) {
        // Usage:
        //     <vPhotoDetail></vPhotoDetail>
        // Creates:
        //

        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                entity: '=',
                allowEdit: '=',
                users: '=',
                statuses: '=',
            },
            controller: 'vPhotoDetailCntrl',
            templateUrl: 'app/modules/virtual-folders/directives/vPhoto/vPhotoDetail.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();

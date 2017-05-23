(function() {
    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .directive('vTreeDetail', vTreeDetail);

    vTreeDetail.$inject = ['$window'];

    function vTreeDetail($window) {
        // Usage:
        //     <vTreeDetail></vTreeDetail>
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
            controller: 'vTreeDetailCntrl',
            templateUrl: 'app/modules/virtual-folders/directives/vTree/vTreeDetail.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();

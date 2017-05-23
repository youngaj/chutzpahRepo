
(function () {

    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .directive('vSharedFileDetail', vSharedFileDetail);

    vSharedFileDetail.$inject = ['$window'];

    function vSharedFileDetail($window) {
        // Usage:
        //     <vSharedFileDetail></vSharedFileDetail>
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
            controller: 'vSharedFileDetailCntrl',
            templateUrl: 'app/modules/virtual-folders/directives/vSharedFile/vSharedFileDetail.html'
        };
        return directive;

        function link(scope, element, attrs) {
            //scope.$watch('entity', function (newValue, oldValue) {
            //    if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
            //        scope.getDetail(newValue);
            //    }
            //}, true);
        }
    }

})();

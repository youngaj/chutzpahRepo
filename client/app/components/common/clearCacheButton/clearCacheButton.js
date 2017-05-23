(function () {
    'use strict';

    angular
        .module("app.components.common")
        .directive('clearCacheButton', clearCacheButton);

    clearCacheButton.$inject = [];

    function clearCacheButton() {
        // Usage:
        //     <clear-cache-button></clear-cache-button>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                entityCompositeKey: '=?'
            },
            controller: 'ClearCacheButtonCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/common/clearCacheButton/clearCacheButton.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }
})();
(function () {
    "use strict";

    angular
        .module('app.components.changeHistory')
        .directive('changeHistory', changeHistory);

    changeHistory.$inject = [];

    function changeHistory() {
        // Usage:
        //<change-history> </change-history>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            bindToController: {
                preload: '=?',
                initialData: '=?',
                entityCompositeKey: '=?',
                entityReference: '=?',
                triggerUpdate: '=?'
            },
            scope: {},
            controller: 'ChangeHistoryCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/changeHistory/directives/list/changeHistory.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

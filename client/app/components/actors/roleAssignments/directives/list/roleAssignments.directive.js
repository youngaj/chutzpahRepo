(function () {
    "use strict";

    angular
        .module('app.components.actors')
        .directive('roleAssignments', roleAssignment);

    roleAssignment.$inject = [];

    function roleAssignment() {
        // Usage:
        //<role-assignments> </role-assignments>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            bindToController: {
                preload: '=?',
                initialData: '=?',
                entityCompositeKey: '=?',
                allowEdit: '=?'
            },
            scope: {},
            controller: 'RoleAssignmentsCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/actors/roleAssignments/directives/list/roleAssignments.html'

        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

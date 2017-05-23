(function () {

    "use strict";

    angular
          .module('app.components.security')
          .directive('symphonySecurity', symphonySecurity);

    symphonySecurity.$inject = [];

    function symphonySecurity() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                preload: '=?',
                initialData: '=?',
                action: '=?',
                allowEdit: '=?',
                autoProcess:'=?',
                entityCompositeKey: '=?',
                securityPermissions: '=?'
            },
            controller: 'SecurityCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/components/security/directive/security.html'
        };
        return directive;
        function link(scope, element, attrs) {
            scope.$watch('action', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    scope.executeAction(newValue);
                    console.log("Directive - action  called" + newValue);
                }
            });

            if (scope.preload === true) {
                scope.$watch('initialData', function (newValue, oldValue) {
                    if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                        scope.loadInitialData(newValue);
                    }
                });
            }

            scope.$watch('entityCompositeKey', function (newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue !== oldValue) {
                    if (scope.preload !== true) {
                        scope.getSecurityLock(newValue);
                        var classType = newValue.split("-")[0];
                        scope.classType = classType;
                        console.log("Directive - SecurityLookup called by compositeKey " + newValue);
                    }
                }
            });
        }
    }

  })();

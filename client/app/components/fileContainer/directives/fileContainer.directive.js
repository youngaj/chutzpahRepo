(function () {
    "use strict";

    angular
       .module('app.components.fileContainer')
       .directive('fileContainer', fileContainer);

    fileContainer.$inject = ['$timeout', 'fileContainerService'];

    function fileContainer($timeout, fileContainerService) {
        // Usage:
        //     <file-container></file-container>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                preload: '=?',
                initialData: '=?',
                allowEdit: '=?',
                entityCompositeKey: '=',
                entityReference: '=?',
                autoProcess: '=?',
                action: '=?',
                config: '=?'
            },
            controller: 'FileContainerCntrl',
            templateUrl: 'app/components/fileContainer/directives/fileContainer.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('entityCompositeKey', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    if (newValue != oldValue) {
                        if (scope.preload !== true) {
                            scope.getFileContainers(newValue);
                            console.log("FileContainer Directive triggered", newValue);
                        }
                    } else {
                        console.log("FileContainer Directive NOT triggered", newValue, oldValue)
                    }
                }
            });

            if (scope.preload === true) {
                scope.$watch('initialData', function (newValue, oldValue) {
                    if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                        scope.loadInitialData(newValue);
                    }
                });
            }

            scope.$watch('autoProcess', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    scope.updateAutoProcess(newValue);
                }
            });

            scope.$watch('action', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    scope.executeAction(newValue);
                    scope.action = null;
                }
            });

            scope.$watch('config', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    scope.updateConfig(newValue);
                }
            }, true);

        }
    }

})();

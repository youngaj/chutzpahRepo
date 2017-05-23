(function () {
    "use strict";

    angular
      .module('app.components.fileContainer')
      .directive('fileContainerUpload', fileContainerUpload);

    fileContainerUpload.$inject = ['$timeout', 'fileContainerService'];

    function fileContainerUpload($timeout, fileContainerService) {
        // Usage:
        //     <file-container-upload></file-container-upload>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                entityCompositeKey: '=',
                entityReference: '=?',
                autoProcess: '=?',
                action: '=?'
            },
            controller: 'FileContainerUploadCntrl',
            //controllerAs: 'vm',
            templateUrl: 'app/components/fileContainer/directives/upload/fileContainerUpload.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('action', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    scope.executeAction(newValue);
                    scope.action = null;
                }
            });

        }

    }

        })();

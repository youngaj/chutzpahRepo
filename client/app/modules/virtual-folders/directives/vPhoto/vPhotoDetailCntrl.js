(function (){

    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .controller('vPhotoDetailCntrl', vPhotoDetailCntrl);

    vPhotoDetailCntrl.$inject = ['$scope', 'common'];

    function vPhotoDetailCntrl($scope, common) {
        /* jshint validthis:true */

        var controllerId = 'vPhotoDetailCntrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var vm = this;
        vm.title = 'Photo Detail Controller';

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    if(isValid($scope.entity)){
                        $scope.entity.dateTaken = moment($scope.entity.dateTaken).toDate();
                    }
                });
        }

        function isValid(obj) {
            var result = true;
            if (_.isUndefined(obj) || _.isNull(obj)) {
                result = false;
            }
            return result;
        }

    }
        })();


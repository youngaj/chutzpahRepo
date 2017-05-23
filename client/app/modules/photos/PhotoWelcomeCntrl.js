(function () {

    "use strict";

    var controllerId = 'PhotoWelcomeCntrl';
    angular
        .module('app.modules.photos')
        .controller(controllerId, PhotoWelcomeCntrl);

    PhotoWelcomeCntrl.$inject = ['$scope', 'common'];

    function PhotoWelcomeCntrl($scope, common) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.title = 'Photos Gallery';
        vm.photos = [];

        vm.state = {
            isLoading: false,
            loadingMsg: 'Default loading msg',
        };

        activate();
        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }

    }
})();



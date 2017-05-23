(function () {
    "use strict";

    var controllerId = 'RiskStatusDetailCntrl';
    angular
       .module('app.modules.risks')
       .controller(controllerId, RiskStatusDetailCntrl);

    RiskStatusDetailCntrl.$inject = ['$stateParams', 'common', 'riskStatusService'];

    function RiskStatusDetailCntrl($stateParams, common, riskStatusService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.save = save;
        vm.goToList = goToList;

        vm.title = 'Risk Status Detail';
        vm.newRiskStatus = { };
        vm.defaultOptions = [
            { name: "Yes", value: true },
            { name: "No", value: false },
        ];
        activate();
        function activate() {
            var id = parseInt($stateParams.id);
            if (id !== 0) {
                getRiskStatus(id)
            }
        }

        function getRiskStatus(id) {
            return riskStatusService.getById(id).then(function (riskStatus) {
                vm.riskStatus = riskStatus;
            });
        }

        function goToList() {
            riskStatusService.goToList();
        }

        function save(riskStatus) {
            if (typeof riskStatus.id !== 'undefined' && riskStatus.id > 0) {
                return riskStatusService.update(riskStatus).then(function (result) {
                    logSuccess("Risk Status Updated.");
                });
            } else {
                return riskStatusService.create(riskStatus).then(function (result) {
                    vm.riskStatus = result;
                    logSuccess("Risk Status created.");
                });
            }
        }
    }
})();


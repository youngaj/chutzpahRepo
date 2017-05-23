(function () {
    "use strict";

    var controllerId = 'RiskStateDetailCntrl';
    angular
       .module('app.modules.risks')
       .controller(controllerId, RiskStateDetailCntrl);

    RiskStateDetailCntrl.$inject = ['$stateParams', 'common', 'riskStateService'];

    function RiskStateDetailCntrl($stateParams, common, riskStateService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.save = save;
        vm.goToList = goToList;

        vm.title = 'Risk State Detail';
        vm.newRiskState = { };
        vm.defaultOptions = [
            { name: "Yes", value: true },
            { name: "No", value: false },
        ];
        activate();
        function activate() {
            var id = parseInt($stateParams.id);
            if (id !== 0) {
                getRiskState(id)
            }
        }

        function getRiskState(id) {
            return riskStateService.getById(id).then(function (riskState) {
                vm.riskState = riskState;
            });
        }

        function goToList() {
            riskStateService.goToList();
        }

        function save(riskState) {
            if (typeof riskState.id !== 'undefined' && riskState.id > 0) {
                return riskStateService.update(riskState).then(function (result) {
                    logSuccess("Risk State Updated.");
                });
            } else {
                return riskStateService.create(riskState).then(function (result) {
                    vm.riskState = result;
                    logSuccess("Risk State created.");
                });
            }
        }
    }
  })();

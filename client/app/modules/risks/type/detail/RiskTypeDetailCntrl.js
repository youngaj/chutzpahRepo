(function () {

    "use strict";

    var controllerId = 'RiskTypeDetailCntrl';
    angular
        .module('app.modules.risks')
        .controller(controllerId, RiskTypeDetailCntrl);

    RiskTypeDetailCntrl.$inject = ['$stateParams', 'common', 'riskTypeService'];

    function RiskTypeDetailCntrl($stateParams, common, riskTypeService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.save = save;
        vm.goToList = goToList;

        vm.title = 'Risk State Detail';
        vm.newRiskType = { };
        vm.defaultOptions = [
            { name: "Yes", value: true },
            { name: "No", value: false },
        ];
        activate();
        function activate() {
            var id = parseInt($stateParams.id);
            if (id !== 0) {
                getRiskType(id)
            }
        }

        function getRiskType(id) {
            return riskTypeService.getById(id).then(function (riskType) {
                vm.riskType = riskType;
            });
        }

        function goToList() {
            riskTypeService.goToList();
        }

        function save(riskType) {
            if (typeof riskType.id !== 'undefined' && riskType.id > 0) {
                return riskTypeService.update(riskType).then(function (result) {
                    logSuccess("Risk Type Updated.");
                });
            } else {
                return riskTypeService.create(riskType).then(function (result) {
                    vm.riskType = result;
                    logSuccess("Risk Type created.");
                });
            }
        }
    }
})();
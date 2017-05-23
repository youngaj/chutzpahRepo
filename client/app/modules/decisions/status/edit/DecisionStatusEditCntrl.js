(function () {

    "use strict";

    var controllerId = 'DecisionStatusEditCntrl';
    angular
        .module('app.modules.decisions')
        .controller(controllerId, DecisionStatusEditCntrl);

    DecisionStatusEditCntrl.$inject = ['$stateParams', 'common', 'decisionStatusService'];

    function DecisionStatusEditCntrl($stateParams, common, decisionStatusService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.save = save;
        vm.goToList = goToList;

        vm.title = 'Decision Status Edit';
        vm.newDecisionStatus = { };
        vm.defaultOptions = [
            { name: "Yes", value: true },
            { name: "No", value: false },
        ];
        activate();
        function activate() {
            var id = parseInt($stateParams.id);
            if (id !== 0) {
                getDecisionStatus(id)
            }
        }

        function getDecisionStatus(id) {
            return decisionStatusService.getById(id).then(function (decisionStatus) {
                vm.decisionStatus = decisionStatus;
            });
        }

        function goToList() {
            decisionStatusService.goToList();
        }

        function save(decisionStatus) {
            if (typeof decisionStatus.id !== 'undefined' && decisionStatus.id > 0) {
                return decisionStatusService.update(decisionStatus).then(function (result) {
                    logSuccess("Decision Status Updated.");
                });
            } else {
                return decisionStatusService.create(decisionStatus).then(function (result) {
                    vm.decisionStatus = result;
                    logSuccess("Decision Status created.");
                });
            }
        }
    }
})();

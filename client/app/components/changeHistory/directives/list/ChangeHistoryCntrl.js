
(function () {
    "use strict";


    angular
        .module('app.components.changeHistory')
        .controller('ChangeHistoryCntrl', ChangeHistoryCntrl);

    ChangeHistoryCntrl.$inject = ['$scope', '$timeout', 'common', 'changeHistoryService'];
    function ChangeHistoryCntrl($scope, $timeout, common, changeHistoryService) {
        var controllerId = 'ChangeHistoryCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var allChanges = [];
        var vm = this;
        vm.changeRecords = [];
        vm.comment = {};
        vm.state = {
            isLoading: false,
            text: "Retrieving change history from the server"
        };
        vm.refresh = refresh;

        vm.getChangeHistory = getChangeHistory;

        activate();

        if (vm.preload === true) {
            vm.state.isLoading = true;
            $scope.$watch('vm.initialData', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    loadInitialData(newValue);
                }
            });
        }

        $scope.$on("changeHistoryUpdate", function (event, historyUpdate) {
            if (angular.isDefined(historyUpdate) && vm.entityCompositeKey === historyUpdate.entityCompositeKey) {
                var allChanges = changeHistoryService.format(historyUpdate.history);
                var displayChanges = _.filter(allChanges, 'useForDisplay');
                vm.changeRecords = displayChanges;
                vm.state.isLoading = false;
                log("Change History Updated", displayChanges);
            }
        });

        function activate() {
            if (vm.preload !== true) {
                getChangeHistory();
            }
        }

        function addEntityReference(changeRecord) {
            changeRecord.entityReference = vm.entityReference;
        }

        function getEntityKey() {
            return vm.entityCompositeKey;
        }

        function getChangeHistory() {
            vm.state.isLoading = true;
            vm.state.text = "Please wait while we retrieve the change history from the server.";
            var key = getEntityKey();
            return changeHistoryService.getByEntityCompositeKey(key).then(function (changeRecords) {
                    allChanges = changeRecords;
                    var displayChanges = _.filter(allChanges, 'useForDisplay');
                    vm.changeRecords = displayChanges;
                    vm.state.isLoading = false;
                    return changeRecords;
            });
        }

        function loadInitialData(changeRecords) {
            allChanges = changeRecords;
            var displayChanges = _.filter(allChanges, 'useForDisplay');
            vm.changeRecords = displayChanges;
            vm.state.isLoading = false;
            return changeRecords;
        }

        function refresh() {
            getChangeHistory().then(function () {
                log("Change History Updated");
            });
        }
    }
})();


(function (){
    "use strict";

    var controllerId = 'DecisionEditCntrl';
    angular
        .module('app.modules.decisions')
        .controller(controllerId, DecisionEditCntrl);

    DecisionEditCntrl.$inject = ['$stateParams', 'common', 'actorService', 'decisionService', 'decisionStatusService', 'userService', 'securityPermissionService'];

    function DecisionEditCntrl($stateParams, common, actorService, decisionService, decisionStatusService, userService, securityPermissionService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.goToList = goToList;
        vm.openCalendar = openCalendar;
        vm.save = save;

        vm.author = {
            options: []
        };
        vm.decision = null;
        vm.decisionStatuses = [];
        vm.newDecision = {};
        vm.title = 'Decision Edit';
        vm.state = {
            isLoading: false,
            loadingMsg: 'Default loading msg',
            decidedDateCalendarOpened: false,
            effectiveDateCalendarOpened: false,
        };


        activate();
        function activate() {
            getPeople();
            getDecisionStatuses();

            var decisionId = parseInt($stateParams.id);
            if (decisionId !== 0) {
                getDecision(decisionId);
            }
        }

        function getPeople() {
            userService.getAll().then(function (people) {
                vm.author.options = people;
            });
        }

        function getClearedFeatures(entityCompositeKey) {
            return securityPermissionService.getClearedFeatures(entityCompositeKey).then(function (features) {
                vm.options.allowedFeatures = features;
                return features;
            });
        }

        function getFeatureOptions(classType) {
            return securityPermissionService.getSecurityPermissionOptions(classType).then(function (availableFeatures) {
                vm.options.availableFeatures = availableFeatures;
                return availableFeatures;
            });
        }

        function getDecision(id) {
            vm.state.isLoading = true;
            vm.state.loadingMsg = "Getting the decision data from the server...";
            return decisionService.getById(id).then(function (decision) {
                vm.decision = decision;
                loadSecurityPermissions(decision);
                vm.state.isLoading = false;
            }, function (errorResponse) {
                vm.state.isLoading = false;
            });
        }

        function getDecisionStatuses(id) {
            return decisionStatusService.getAll().then(function (statuses) {
                vm.decisionStatuses = statuses;
            });
        }

        function goToList() {
            decisionService.goToList();
        }

        function loadSecurityPermissions(decision) {
            getFeatureOptions(decision.classType);
            getClearedFeatures(decision.compositeKey);
        }

        function openCalendar($event, calendar) {
            $event.preventDefault();
            $event.stopPropagation();
            if (calendar === 'effectiveDate') {
                vm.state.decidedDateCalendarOpened = false;
                vm.state.effectiveDateCalendarOpened = true;
            } else {
                vm.state.decidedDateCalendarOpened = true;
                vm.state.effectiveDateCalendarOpened = false;
            }
        };

        function save(decision) {
            vm.state.isLoading = true;
            if (typeof decision.id !== 'undefined' && decision.id > 0) {
                vm.state.loadingMsg = "Updating the decision data on the server...";
                return decisionService.update(decision).then(function (result) {
                    logSuccess("Decision Updated.");
                    loadSecurityPermissions(decision);
                    vm.state.isLoading = false;
                }, function (errorResponse) {
                    vm.state.isLoading = false;
                });
            } else {
                vm.state.loadingMsg = "Creating the decision on the server...";
                return decisionService.create(decision).then(function (result) {
                    vm.decision = result;
                    loadSecurityPermissions(result);
                    logSuccess("Decision created.");
                    vm.state.isLoading = false;
                }, function (errorResponse) {
                    vm.state.isLoading = false;
                });;
            }
        }
    }
})();

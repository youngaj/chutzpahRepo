(function () {
    'use strict';

    var controllerId = 'RiskDetailCntrl';
    angular
        .module('app.modules.risks')
        .controller(controllerId, RiskDetailCntrl);

    RiskDetailCntrl.$inject = ['$scope', 'common', 'actorService', 'riskService', 'riskStatusService', 'riskStateService', 'riskTypeService', 'tagService', 'projectService', 'securityPermissionService', 'entity'];

    function RiskDetailCntrl($scope, common, actorService, riskService, riskStatusService, riskStateService, riskTypeService, tagService, projectService, securityPermissionService, entity) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var $q = common.$q;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var unModifiedRisk = null;

        vm.calculateTotalRisk = calculateTotalRisk;
        vm.goToList = goToList;
        vm.loadTagOptions = loadTagOptions;
        vm.save = save;
        vm.deleteRisk = deleteRisk;
        vm.setStatus = setStatus;

        vm.options = {
            assignees: [],
            scores: []
        };

        vm.risk = entity;
        vm.riskStatuses = [];
        vm.riskTypes = [];
        vm.projects = [];
        vm.title = 'Risk Detail';
        vm.state = {
            isDirty: false,
            isLoading: false,
            isLocked: false,
            isProjectLocked: false,
            isSaveable: false,
            isDeletable: false,
            loadingMsg: 'Default loading msg',
            saveButtonText:"Save",

        };
        vm.entityReference = {};

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (angular.equals(unModifiedRisk, vm.risk) == false) {
                event.preventDefault();
                var reset = function () {
                    setPrestine(vm.risk);
                };
                riskService.handleUnsavedChanges(event, toState, toParams, reset);
            }

        });

        activate();
        function activate() {
            getActors();
            getProjects();
            var statusPromise = getRiskStatuses();
            getRiskStates();
            getRiskTypes();
            vm.options.scores = getScores();

            var risk = vm.risk;
            if (angular.isDefined(risk.id) && risk.id !== 0) {
                vm.entityReference = createEntityReference(vm.risk);
                triggerChangeHistoryUpdate(risk);
                var securityPromise = loadSecurityPermissions(risk);
                getFeatureOptions(risk.classType);
                getClearedFeatures(risk.compositeKey);
                setLockState(risk);
                setPrestine(risk);
                securityPromise.then(function () {
                    applySecurity();
                    setButtonStates();
                });
            } else {
                statusPromise.then(function (statuses) {
                    setNewState(statuses);
                });
            }
        }

        function setPrestine(risk) {
            unModifiedRisk = angular.copy(risk);
        }

        function applySecurity() {
            vm.security = riskService.getFeatureSecurity(vm.options);
        }

        function calculateTotalRisk(likelihoodScore, consequenceScore) {
            vm.risk.riskScore = Math.round(100 * ((0.35 * consequenceScore) + (0.65 * likelihoodScore)))/100;
        }

        function createEntityReference(entity) {
            var entityReference = {};
            angular.copy(entity, entityReference);
            entityReference.name = "("+ entity.project.name + "-" + entity.num + ") " + entity.title;
            return entityReference;
        }

        function deleteRisk(risk) {
            return riskService.remove(risk.id).then(function (result) {
                logSuccess("Risk deleted");
                goToList();
            }).catch(function (rejection) {
                var status = rejection.status;
                if (status === 403) {
                    logError("You are not authorized to delete this risk.");
                }
            });
        }

        function getActors() {
            actorService.getAll().then(function (actors) {
                var users = _.filter(actors, { 'classType': 'User' });
                vm.options.assignees = users;
            });
        }

        function getProjects() {
            projectService.getAll().then(function (projects) {
                vm.projects = projects;
            });
        }

        function getScores() {
            var scores  =[1, 2, 3, 4, 5];
            return scores;
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

        function getRiskStatuses() {
            return riskStatusService.getAll().then(function (statuses) {
                vm.riskStatuses = statuses;
                return statuses;
            });
        }

        function getRiskStates() {
            return riskStateService.getAll().then(function (states) {
                vm.riskStates = states;
                return states;
            });
        }

        function getRiskTypes() {
            return riskTypeService.getAll().then(function(types) {
                vm.riskTypes = types;
                return types;
            });
        }

        function goToList() {
            riskService.goToList();
        }

        function loadSecurityPermissions(risk) {
            var availableOptionsPromise = getFeatureOptions(risk.classType);
            var clearedOptionsPromise = getClearedFeatures(risk.compositeKey);
            return $q.all([availableOptionsPromise, clearedOptionsPromise]);
        }

        function loadTagOptions(query) {
            return tagService.search(query);
        }

        function save(risk) {
            if (vm.state.isLoading !== true) {
                vm.state.isLoading = true;
                if (typeof risk.id !== 'undefined' && risk.id > 0) {
                    return updateRisk(risk);
                } else {
                    return createRisk(risk);
                }
            }
        }

        function createRisk(risk) {
            vm.state.loadingMsg = "Creating the risk on the server...";
            vm.state.saveButtonText = "Saving...";
            formatTags(risk);
            return riskService.create(risk)
                .then(function (newRisk) {
                    return createRiskSuccess(newRisk);
                })
                .catch(function (errorResponse) {
                    vm.state.isLoading = false;
                    vm.state.saveButtonText = "Create";
                });
        }

        function createRiskSuccess(risk) {
            logSuccess("Risk created.");
            vm.risk = risk;
            setPrestine(risk);
            return riskService.goToDetail(risk).then(function (pageUrl) {
                return riskService.creationMessage(risk, pageUrl);
            });
            vm.state.saveButtonText = "Redirecting...";
        }

        function updateRisk(risk) {
            vm.state.loadingMsg = "Updating the risk data on the server...";
            vm.state.saveButtonText = "Updating...";
            formatTags(risk);
            return riskService.update(risk)
                .then(function (updatedRisk) {
                    updateRiskSuccess(updatedRisk);
                })
                .catch(function (errorResponse) {
                    vm.state.isLoading = false;
                    vm.state.saveButtonText = "Save";
                });
        }

        function updateRiskSuccess(risk) {
            logSuccess("Risk Updated.");
            loadSecurityPermissions(risk);
            vm.entityReference = createEntityReference(risk);
            setLockState(risk);
            setButtonStates();
            vm.state.isLoading = false;
            vm.state.saveButtonText = "Save";
            setPrestine(risk);
            vm.risk = risk;
        }

        function setNewState(statuses) {
            vm.state.isSaveable = true;
            vm.state.saveButtonText = "Create";
            vm.risk.status = riskStatusService.getDefaultStatus(statuses);
            setPrestine(vm.risk);
            //riskService.handleUnsavedChanges($scope, unModifiedRisk, vm.risk);
        }

        function setButtonStates() {
            setSaveableState();
            setDeletableState();
        }

        function setDeletableState() {
            vm.state.isDeletable = vm.risk != null && vm.security.allowDelete;
        }

        function setSaveableState() {
            vm.state.isSaveable = vm.risk != null && !vm.state.isLocked && vm.security.allowMetaDataEdit;
            if (!vm.state.isSaveable)
                vm.state.isLocked = true;
        }

        function setStatus(risk, status) {
            return riskService.setStatus(risk.id, status)
                        .then(function (updatedRisk) {
                            return updateRiskSuccess(updatedRisk);
                        })
                        .catch(function (errorResponse) {
                            logError("Status update failed");
                        });
        }

        function setLockState(risk) {
            vm.state.isLocked = !risk.status.isOpen;
            vm.state.isProjectLocked = vm.state.isLocked || (vm.risk.id > 0 && vm.risk.project.id > 0);
        }

        function formatTags(risk) {
            if (angular.isDefined(risk.tags) && risk.tags != null && risk.tags.length > 0) {
                _.map(risk.tags, function (tag) {
                    tag.entityCompositeKey = risk.compositeKey;
                    tag.entityClassType = risk.classType;
                });
            }
        }

        function triggerChangeHistoryUpdate(risk) {
            common.$broadcast("entityCompositeKey_Updated", risk.compositeKey);
        }
    }
})();

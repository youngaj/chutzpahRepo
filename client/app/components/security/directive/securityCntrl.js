(function () {
    "use strict";

    angular
        .module('app.components.security')
        .controller('SecurityCntrl', SecurityCntrl);

    SecurityCntrl.$inject = ['$scope', '$filter', 'common', 'actorService', 'securityService', 'securityPermissionService', 'configService'];
    function SecurityCntrl($scope, $filter, common, actorService, securityService, securityPermissionService, configService) {
        var controllerId = 'SecurityCntrl';

        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var securityKey = null;
        var ruleTypes = null;
        var levels = null;
        var actors = [];

        $scope.executeAction = executeAction;
        $scope.displayClearedUsers = displayClearedUsers;
        $scope.loadInitialData = loadInitialData;

        $scope.getSecurityLockByEntity = getSecurityLockByEntity;
        $scope.getSecurityLock = getSecurityLock;
        $scope.actorTypeUpdated = actorTypeUpdated;
        $scope.openCalendar = openCalendar;
        $scope.state = {
            view: 'viewAccess',
            calendarOpened: false,
            isLoading: true,
            progressBanner: {
                active: false,
                percentageComplete: 0,
            }
        };
        $scope.securityRules = [];
        $scope.options = {
            levels: [],
            types: [],
            ruleTypes: [],
            filteredActors: [],
            selectedActors: [],
            featureOptions: []
        };

        $scope.selectedSecurityRule = {
            actor: {},
            level: {},
            type: {}
        };

        $scope.removeSecurityRule = removeSecurityRule;
        $scope.toggleDisplay = toggleDisplay;
        $scope.newSecurityRules = [];

        //--TODO separate permission stuff from Access stuff
        //-- SecurityPermission related exposed ViewModel Items
        $scope.permissionTypes = [
            { id: 1, name: 'Granted' },
            { id: -1, name: 'Excluded' },
            { id: -2, name: 'Denied' },
        ];
        $scope.newSecurityPermission = {
            id: 0,
            entityCompositeKey: '',
            actor: {},
            permissionType: 1,
            feature: '',
            preview: ''
        };

        //-- Exposed SecurityPermission functions
        $scope.saveSecurityPermission = saveSecurityPermission;
        $scope.setSecurityPermissionOptions = setSecurityPermissionOptions;
        $scope.classType = '';

        $scope.config = {};

        activate();

        //------ wizard functions
        $scope.wizard = {
            step: 1,
            avatarSize: 30,
            unSelected: {},
            selected: {},
            actorFilter: actorFilter,
            unSelectedFilter: unSelectedFilter,
            moved: moved,
            assignCategory: assignCategory,
            submit: submitWizard,
            submitText: "Submit",
            nextStep: nextStep,
            prevStep: prevStep,
        };

        $scope.primeWizard = primeWizard;

        $scope.$on("progressUpdate", function (event, progressUpdate) {
            $scope.state.progressBanner.percentageComplete = progressUpdate.percentageComplete;
            $scope.state.progressBanner.msg = progressUpdate.percentageComplete + "% complete. " + progressUpdate.msg;
        })

        function submitWizard(entityCompositeKey, wizard) {
            //-- need to be able to mark rules as added, edited or deleted.
            var rules = [];
            wizard.submitText = "Processing ...";
            markDeletedSecurityRules(entityCompositeKey, wizard, rules);
            markNewOrUpdatedSecurityRules(entityCompositeKey, wizard, rules);

            return securityService.saveMultipleSecurityRules(entityCompositeKey, rules)
                .then(function (serverSecurityRules) {
                    setSecurityTag(serverSecurityRules);
                    $scope.state.view = "viewAccess";
                    wizard.submitText = "Operation Complete!";
                    wizard.step = 5;
                    logSuccess("Security updated!");
                }, function (errorResponse) {
                    logError("Submission failed.");
                    wizard.submitText = "Re-Submit";
                });
        }

        function markDeletedSecurityRules(entityCompositeKey, wizard, rules) {
            _.map(wizard.unSelected.removed, function (rule) {
                if (rule.id > 0) {
                    rule.databaseAction = "delete";
                    setEntityCompositeKey(entityCompositeKey, rule);
                    rules.push(rule);
                }
            });
        }

        function setEntityCompositeKey(entityCompositeKey, rule) {
            if (angular.isDefined(rule.entityCompositeKey) === false || rule.entityCompositeKey === "") {
                rule.entityCompositeKey = entityCompositeKey;
            }
        }

        function markNewOrUpdatedSecurityRules(entityCompositeKey, wizard, rules) {
            _.map(wizard.selected.rules, function (rule) {
                if (angular.isDefined(rule.id) && rule.id > 0) {
                    rule.databaseAction = "edit";
                } else {
                    rule.databaseAction = "insert";
                }
                setEntityCompositeKey(entityCompositeKey, rule);
                rules.push(rule);
            });
        }

        function assignCategory(rules, rule) {
            var removedRules = _.remove(rules, function (r) { return r.actor.compositeKey === rule.actor.compositeKey; });
            //-- if we drop it on the same area/list there will be more than one.  In that case we don't want to remove both items.
            if (removedRules.length > 1) {
                rules.push(rule);
                rules = _.sortBy(rules, function (rule) {
                    return rule.actor.name;
                });
            }
        }

        function primeWizard(securityRules) {
            var rules = [];
            for (var i = 0; i < actors.length; i++) {
                var currActor = actors[i];
                var existingRule = _.find(securityRules, function (rule) {
                    return rule.actor.compositeKey === currActor.compositeKey;
                });
                if (angular.isDefined(existingRule) === false) {
                    var newRule = {
                        id: 0,
                        actor: currActor,
                        actorCompositeKey: currActor.compositeKey
                    };
                    rules.push(newRule);
                }
            }
            $scope.wizard.selected = createWizardGrouping(securityRules);
            $scope.wizard.step = 1;
            var unSelected = createWizardGrouping(rules);
            actorFilter(unSelected);
            $scope.wizard.unSelected = unSelected;
        }

        function createWizardGrouping(rules) {
            rules = _.sortBy(rules, function (rule) {
                return rule.actor.name;
            });
            return {
                rules: rules,
                visibleRules: rules,
                filterText: '',
                actorTypes: [
                    { label: 'User', value: 'User', isSelected: true },
                    { label: 'Role', value: 'Role', isSelected: true },
                    { label: 'Group', value: 'Group', isSelected: true },
                ]
            };
        }

        function setUpCategorySelections(selected) {
            selected.required = [];
            selected.denied = [];
            selected.optional = [];
            var rules = _.union(selected.rules, selected.visibleRules);
            _.map(rules, function (rule) {
                switch (rule.ruleType) {
                    case "Denied":
                        selected.denied.push(rule);
                        break;
                    case "Required":
                        selected.required.push(rule);
                        break;
                    default: // "Optional":
                        rule.rultType = 'Optional';
                        selected.optional.push(rule);
                        break;
                }
            });
        }

        function setUpExpireationSelection() {
            var rules = [];
            var selected = $scope.wizard.selected;
            _.map(selected.optional, function (rule) {
                rule.ruleType = "Optional"
                rule.expiration = getSecurityRuleExpiration(rule);
                rules.push(rule);
            });
            _.map(selected.denied, function (rule) {
                rule.ruleType = "Denied"
                rule.expiration = getSecurityRuleExpiration(rule);
                rules.push(rule);
            });
            _.map(selected.required, function (rule) {
                rule.ruleType = "Required"
                rule.expiration = getSecurityRuleExpiration(rule);
                rules.push(rule);
            });
            $scope.wizard.selected.rules = rules;
        }

        function getSecurityRuleExpiration(securityRule) {
            var expirationText = "";
            if (angular.isDefined(securityRule.expiration) && securityRule.expiration !== null && securityRule.expiration !== "") {
                expirationText = moment(securityRule.expiration).format("MM-DD-YYYY");
            }
            return expirationText;
        }

        function setUpPreview() {
            var rules = $scope.wizard.selected.rules;
            _.map(rules, function (rule) {
                securityService.formatSecurityRuleText(rule);
            });
        }

        function moved(grouping, rule) {
            var removedVisibleRules = _.remove(grouping.visibleRules, function (r) { return r.actor.compositeKey === rule.actor.compositeKey; });

            //-- if we drop it on the same area/list there will be more than one.  In that case we don't want to remove both items.
            if (removedVisibleRules.length > 1) {
                grouping.visibleRules.push(rule);
                grouping.visibleRules = _.sortBy(grouping.visibleRules, function (rule) { return rule.actor.name; });
            } else {
                var removedRules = _.remove(grouping.rules, function (r) { return r.actor.compositeKey === rule.actor.compositeKey; });
            }
            //wizard.unSelected.rules.splice($index, 1)
        }

        function prevStep(wizard) {
            wizard.step--;
        }

        function nextStep(wizard) {
            console.log("Next Wizard step triggered");
            wizard.step++;
            if (wizard.step === 2) {
                setUpCategorySelections(wizard.selected);
                determineRemoved(wizard);
            }

            if (wizard.step === 3) {
                console.log("about to set up  expiration");
                setUpExpireationSelection();
                console.log("expiration set up complete");
            }

            if (wizard.step === 4) {
                setUpPreview();
            }
            console.log("Next Wizard step complete");
        }

        function determineRemoved(wizard) {
            wizard.unSelected.removed = [];
            _.map(wizard.unSelected.visibleRules, function (rule) {
                if (rule.id > 0) {
                    rule.databaseAction = "delete";
                    wizard.unSelected.removed.push(rule);
                }
            });
            _.map(wizard.unSelected.rules, function (rule) {
                if (rule.id > 0) {
                    rule.databaseAction = "delete";
                    wizard.unSelected.removed.push(rule);
                }
            });
        }

        function unSelectedFilter(grouping) {
            actorFilter(grouping);
            filterSelected(grouping)
        }

        function filterSelected(grouping) {
            _.map($scope.wizard.selected.visibleRules, function (rule) {
                _.remove(grouping.visibleRules, function (r) { return r.actor.compositeKey === rule.actor.compositeKey; });
                //_.remove(grouping.rules, function (r) { return r.actor.compositeKey === rule.actor.compositeKey; });
            });
        }
        function actorFilter(grouping) {
            actorTypeFilter(grouping);
            textFilter(grouping.visibleRules, grouping);
        }

        function actorTypeFilter(grouping) {
            grouping.visibleRules = _.filter(grouping.rules, function (rule) {
                var isMatch = true;
                var actorType = _.find(grouping.actorTypes, function (type) {
                    return type.value === rule.actor.classType;
                });
                if (angular.isDefined(actorType)) {
                    isMatch = actorType.isSelected;
                }
                return isMatch;
            });
        }

        function textFilter(initialRules, grouping) {
            grouping.visibleRules = $filter('filter')(initialRules, grouping.filterText);
        }

        //----- end wizard functions

        function loadInitialData(data) {
            actors = data.actors;
            var securityRules = securityService.formatSecurityRules(data.securityLock);
            $scope.state.isLoading = true;
            securitySetUp();
            setSecurityTag(securityRules);
            $scope.securityRules = securityRules;
            $scope.state.isLoading = false;
        }

        function setConfig() {
            securityService.getLoggedInUser().then(function (user) {
                configService.getAll(user.compositeKey).then(function (config) {
                    $scope.config = config;
                });
            });
        }
        function displayClearedUsers() {
            $scope.retrievingClearedUsers = true;
            if (securityKey === null)
                securityKey = $scope.entityCompositeKey;
            setClearedUsers(securityKey).then(function (data) {
                $scope.retrievingClearedUsers = false;
            });
        }

        function activate() {
            if ($scope.preload !== true) {
                var promises = [getActors()];
                common.activateController(promises, controllerId)
                    .then(function () {
                        securitySetUp();
                        getSecurityLock($scope.entityCompositeKey);
                    });
            }
        }

        function actorTypeUpdated(type) {
            setFilteredSecurityActorOptions(type);
        }

        function openCalendar($event, rule) {
            $event.preventDefault();
            $event.stopPropagation();
            rule.calendarOpened = true;
            $scope.state.calendarOpened = true;
        }

        function executeAction(action) {
            debug("Security action called with " + action);
            logError("Not implemented yet.");
        }

        function securitySetUp() {
            getSecurityRuleTypes();
            getSecurityRuleLevels();

            $scope.selectedSecurityRule.type = ruleTypes[0];
            setFilteredSecurityActorOptions(ruleTypes[0]);

            $scope.options.ruleTypes = ruleTypes;
            $scope.options.levels = levels;
            setConfig();
        }

        function getSecurityRuleLevels() {
            if (levels === null) {
                levels = [
                    { label: 'required', value: required },
                    { label: 'optional', value: optional },
                    { label: 'denied', value: denied }
                ];
            }
            return levels;
        }

        function getSecurityRuleTypes() {
            if (ruleTypes === null) {
                ruleTypes = [
                    { label: 'User', value: 'User' },
                    { label: 'Role', value: 'Role' },
                    { label: 'Group', value: 'Group' },
                ];
            }
            return ruleTypes;
        }

        function addSecurityEntry(item) {
            if (item.ruleType === required) {
                $scope.securityTag.requiredAttributes.push(item);
                item.ruleTypeText = "Required";
            }
            if (item.ruleType === optional) {
                $scope.securityTag.optionalAttributes.push(item);
                item.ruleTypeText = "Optional";
            }
            if (item.ruleType === excluded) {
                $scope.securityTag.excludedAttributes.push(item);
                item.ruleTypeText = "Excluded";
            }
            if (item.ruleType === denied) {
                $scope.securityTag.deniedAttributes.push(item);
                item.ruleTypeText = "Denied";
            }

            return item;
        }

        function getSecurityList(type) {
            switch (type) {
                case required:
                    return $scope.securityTag.requiredAttributes;
                case optional:
                    return $scope.securityTag.optionalAttributes;
                case excluded:
                    return $scope.securityTag.excludedAttributes;
                case denied:
                    return $scope.securityTag.deniedAttributes;
                default:
                    logError("Type not supported.")
            }
        }

        function getSecurityLockByEntity(entity) {
            securityKey = null;
            if (entity !== null) {
                if (angular.isDefined(entity) && entity !== null) {
                    if (angular.isDefined(entity.compositeKey) && angular.isDefined(entity.id) && entity.id !== 0) {
                        securityKey = entity.compositeKey;
                    }
                    else {
                        if (angular.isDefined(entity.parent) && entity.parent !== null && angular.isDefined(entity.parent.compositeKey)) {
                            securityKey = entity.parent.compositeKey;
                        }
                    }
                    return getSecurityLock(securityKey).then(function (data) {
                        return data;
                    });
                }
            }
        }

        function getSecurityLock(compositeKey) {
            if (angular.isDefined(compositeKey) && compositeKey !== null) {
                $scope.state.isLoading = true;
                $scope.classType = compositeKey.split("-")[0];
                return securityService.getSecurityRulesFor(compositeKey)
                    .then(function (data) {
                        setSecurityTag(data);
                        $scope.securityRules = data;
                        $scope.state.isLoading = false;
                        return $scope.securityTag;
                    }, function (errorResponse) { $scope.state.isLoading = false; });
            } else {
                $scope.state.isLoading = false;
                return $q.when({});
            }
        }

        function setSecurityTag(rules) {
            InitSecurityTag();
            for (var i = 0; i < rules.length; i++) {
                addSecurityEntry(rules[i]);
            }
            $scope.securityRules = rules;
        }

        var optional = "Optional";
        var required = "Required";
        var denied = "Denied";
        var excluded = "Excluded";

        function setClearedUsers(compositeKey) {
            var clearedUser;
            return securityService.getSecurityClearedUsers(compositeKey)
                .then(function (data) {
                    $scope.clearedUsers = [];
                    $scope.clearedUsers = data;
                    log($scope.clearedUsers.length + " cleared users.");
                    return data;
                });
        }

        function InitSecurityTag() {
            $scope.securityTag = {
                optionalAttributes: [],
                requiredAttributes: [],
                excludedAttributes: [],
                deniedAttributes: []
            };
        }

        function removeSecurityRule(securityRule) {
            securityRule.deleteText = "Removing security rule";
            showProgressBanner();
            securityService.removeSecurityRule($scope.entityCompositeKey, securityRule.id)
                .then(function () {
                    logSuccess("Security rule removed successfully.");
                    removeSecurityEntry(securityRule);
                    securityKey = $scope.entityCompositeKey;
                    closeProgressBanner();
                }, function (errorResponse) {
                    logError("Security rule removal failed. ", errorResponse);
                    securityRule.deleteText = "Remove";
                    closeProgressBanner();
                });
        }

        function showProgressBanner() {
            $scope.state.progressBanner.active = true;
        }

        function closeProgressBanner() {
            $scope.state.progressBanner.active = false;
            $scope.state.progressBanner.msg = "";
            $scope.state.progressBanner.percentageComplete = 0;
        }

        function removeSecurityEntry(securityRule) {
            var array = getSecurityList(securityRule.ruleType)
            var index = array.indexOf(securityRule);
            if (index > -1) {
                array.splice(index, 1);
            }
            $scope.securityRules = removeFromList(securityRule, $scope.securityRules);
        }

        function removeFromList(securityRule, list) {
            var index = list.indexOf(securityRule);
            if (index > -1) {
                list.splice(index, 1);
            }
            return list;
        }

        function setFilteredSecurityActorOptions(type) {
            if (angular.isDefined(type) && type !== null) {
                $scope.options.filteredActors = _.filter(actors, { 'classType': type.value });;
            }
        }

        function getActors() {
            return actorService.getAll().then(function (result) {
                actors = result;
                return actors;
            });
        }

        function toggleDisplay(display) {
            switch (display) {
                case "editAccess":
                    $scope.newSecurityRules = [];
                    $scope.state.view = display;
                    break;
                case "viewAccess":
                    $scope.state.view = display;
                    break;
                case "editSecurityPermission":
                    setSecurityPermissionOptions($scope.classType);
                    $scope.state.view = display;
                    break;
                case "viewSecurityPermissions":
                    $scope.state.view = display;
                    break;
                case "editWizard":
                    $scope.state.view = display;
                    break;
            }
        }

        var existingClassType = null;
        function setSecurityPermissionOptions(classType) {
            if (angular.isUndefined(classType) || classType === "")
                classType = determineClassType();

            if (classType !== existingClassType) {
                existingClassType = classType;
                return securityPermissionService.getSecurityPermissionOptions(classType).then(function (featureOptions) {
                    $scope.options.featureOptions = featureOptions;
                    return featureOptions;
                });
            }
        }

        function determineClassType() {
            var classType = $scope.entityCompositeKey.split("-")[0];
            scope.classType = classType;
            return classType
        }

        function resetNewSecurityPermissionFields() {
            $scope.newSecurityPermission = {
                id: 0,
                actor: {},
                permissionType: 1,
                entityCompositeKey: '',
                feature: '',
                preview: ''
            };
            return;
        }

        function saveSecurityPermission(securityPermission) {
            securityPermission.entityCompositeKey = $scope.entityCompositeKey;
            return securityPermissionService.save(securityPermission)
                .then(function (data) {
                    logSuccess("Security permission saved.");
                    resetNewSecurityPermissionFields();
                    return;
                }, function (errorResponse) {
                    logError("Security permission failed. " + errorResponse.message);
                    return;
                });
        }
    }
})();
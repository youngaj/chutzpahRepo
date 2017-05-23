(function () {
    'use strict';

    angular
        .module('app.components.security')
        .factory('securityService', securityService);

    securityService.$inject = ['$http', 'common', 'actorService'];

    function securityService($http, common, actorService) {
        var serviceId = 'securityService';
        var baseUrl = common.baseUrl;

        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);

        var actors = [];
        var deniedRuleType = 3;

        var loggedInUser = null;
        var loggedInUserPromise = null;

        var service = {
            getLoggedInUser: getLoggedInUser,

            //-- security services
            saveSecurityRule: saveSecurityRule,
            saveMultipleSecurityRules: saveMultipleSecurityRules,
            formatSecurityRuleText: formatSecurityRuleText,
            formatSecurityRules: formatSecurityRules,
            getSecurityRules: getSecurityRules,
            getSecurityClearedUsers: getSecurityClearedUsers,
            getSecurityRulesFor: getSecurityRulesFor,
            removeSecurityRule: removeSecurityRule,
        };

        activate();
        return service;

        function activate() {
            actorService.getAll().then(function (data) {
                actors = data;
            });
        }

        function getLoggedInUser() {
            if (loggedInUserPromise !== null)
                return loggedInUserPromise;

            loggedInUserPromise = $http.get(baseUrl + 'api/SecurityManager/LoggedInUser')
                .then(function (result) {
                    loggedInUser = result.data;
                    actorService.formatAvatars(loggedInUser);
                    return result.data;
                });
            return loggedInUserPromise;
        }

        function getSecurityRules() {
            return $http.get(baseUrl + 'api/SecurityRules')
                .then(function (result) {
                    return result.data;
                });
        }

        function getSecurityRulesFor(compositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + compositeKey + '/SecurityLock')
                .then(function (result) {
                    result.data = formatSecurityRules(result.data);
                    return result.data;
                });
        }

        function formatSecurityRules(securityRules) {
            return _.map(securityRules, function (securityRule) {
                formatSecurityRuleText(securityRule);
                securityRule.actor = actorService.formatAvatars(securityRule.actor);
                return securityRule;
            });
        }

        function formatSecurityRuleText(securityRule) {
            var securityText = "";
            var actorName = "";

            securityRule.deleteText = "Remove";

            //-- denied security rule text reads slighly different
            actorName = GetActorName(actors, securityRule);
            if (securityRule.ruleType === deniedRuleType) {
                if (isActorType(securityRule, "Group")) {
                    securityText = "members of the '" + actorName + "' group";
                }

                if (isActorType(securityRule, "User")) {
                    securityText = "" + actorName;
                }

                if (isActorType(securityRule, "Role")) {
                    securityText = "users assigned to the '" + actorName + "' role";
                }
            }

            if (securityRule.ruleType != deniedRuleType) {
                if (isActorType(securityRule, "Group")) {
                    securityText = "be a member of '" + actorName + "' group";
                }

                if (isActorType(securityRule, "User")) {
                    securityText = "be " + actorName;
                }

                if (isActorType(securityRule, "Role")) {
                    securityText = "be assigned to '" + actorName + "' role";
                }
            }

            securityRule.securityActorName = actorName;
            securityRule.securityRuleText = securityText + getSecurityRuleExpiration(securityRule);
        }

        function isActorType(rule, type) {
            var result = false;
            if (angular.isDefined(rule.actor) && rule.actor != null) {
                if (rule.actor.classType === type)
                    result = true;
            } else {
                if (rule.actorCompositeKey.indexOf(type) != -1)
                    result = true;
            }
            return result;
        }

        function getSecurityRuleExpiration(securityRule) {
            var expirationText = "";
            if (angular.isDefined(securityRule.expiration) && securityRule.expiration != null && securityRule.expiration != "") {
                expirationText = " ( Expiration Date: " + moment(securityRule.expiration).format("MM-DD-YYYY") + " ) ";
            }
            return expirationText;
        }

        function GetActorName(list, rule) {
            var actorName = rule.actorCompositeKey;
            if (angular.isDefined(rule.actor) && rule.actor != null)
                return rule.actor.name;

            list.forEach(function (entry) {
                if (entry.compositeKey === rule.actorCompositeKey) {
                    rule.actor = entry;
                    if (entry.name != undefined)
                        actorName = entry.name;
                }
            });
            return actorName;
        }

        function validateRules(entity, rules) {
            return $http.post(baseUrl + 'api/SecurityManager/Validate', [entity, rules])
                .then(function (result) {
                    debug(result);
                });
        }

        function getSecurityClearedUsers(compositeKey) {
            return $http.get(baseUrl + 'api/Entity/' + compositeKey + '/ClearedUsers')
                .then(function (result) {
                    var cleardActors = [];
                    for (var i = 0; i < result.data.length; i++) {
                        var actor = _.find(actors, function (user) {
                            return user.compositeKey === result.data[i].compositeKey;
                        });
                        if (actor !== undefined) {
                            cleardActors.push(actor);
                        }
                    }
                    return cleardActors;
                });
        }

        function saveSecurityRule(data) {
            var compositeKey = data.entityCompositeKey;
            return $http.post(baseUrl + 'api/Entity/' + compositeKey + '/SecurityRule', data)
                .then(function (result) {
                    var securityRule = result.data;
                    formatSecurityRuleText(securityRule);
                    return securityRule;
                });
        }

        function saveMultipleSecurityRules(entityCompositeKey, rules) {
            return $http.post(baseUrl + 'api/Entity/' + entityCompositeKey + '/SecurityRules', rules)
                .then(function (result) {
                    var securityRules = result.data;
                    _.map(securityRules, function (rule) {
                        formatSecurityRuleText(rule);
                    });
                    return securityRules;
                });
        }

        function removeSecurityRule(entityCompositeKey, securityRuleId) {
            if (angular.isDefined(entityCompositeKey)) {
                return $http.delete(baseUrl + 'api/Entity/' + entityCompositeKey + '/SecurityRule/' + securityRuleId)
                    .then(function (result) {
                        return result;
                    });
            } else {
                var message = "Can not remove security rule.  The Entity Reference not found";
                logError(message);
                return $q.reject(message);
            }
        }

        //#region Internal Methods

        //#endregion
    }
})();
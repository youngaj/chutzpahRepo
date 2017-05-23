
(function () {
    'use strict';

    var serviceId = 'riskService';
    angular
        .module('app.modules.risks')
        .factory(serviceId, riskService);

    riskService.$inject = ['$http', '$location', '$state', 'common', 'modalDialog'];

    function riskService($http, $location, $state, common, modalDialog) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var featureOptions = common.featureOptions;

        // Define the functions and properties to reveal.

        var _unModified = null;
        var _current = null;

        var service = {
            create: create,
            creationMessage: creationMessage,
            getById: getById,
            getByProjectNum: getByProjectNum,
            getAll: getAll,
            getFeatureSecurity: getFeatureSecurity,
            goToDetail: goToDetail,
            goToDetailById: goToDetailById,
            goToList: goToList,
            handleUnsavedChanges: handleUnsavedChanges,
            remove: remove,
            setStatus: setStatus,
            update: update,
        };

        return service;

        function create(risk) {
            var validationResult = validate(risk);
            if (validationResult.isSuccessful) {
                return $http.post(baseUrl + 'api/Risks/', risk)
                        .then(function (result) {
                            risk = result.data;
                            return risk;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function creationMessage(risk, pageUrl) {
            risk.pageUrl = pageUrl;
            return $http.post(baseUrl + 'api/Risks/' + risk.id + '/CreationMessage', risk)
                    .then(function (result) { });
        }

        function formatErrorsForDisplay(msgs) {
            var formatedMsg = msgs.length + " validation errors found. <ul>";
            for (var i = 0; i < msgs.length; i++) {
                formatedMsg = formatedMsg + "<li>" + msgs[i] + "</li>";
            }
            formatedMsg = formatedMsg + "</ul>";
            return formatedMsg;
        }

        function formatRiskDates(risk) {
            var serverformat = moment.ISO_8601;
            risk.startDate = formatDate(risk.startDate, serverformat, "MM-DD-YYYY");
            risk.endDate = formatDate(risk.endDate, serverformat, "MM-DD-YYYY");
            risk.dateCreated = formatDate(risk.dateCreated, serverformat, "MM-DD-YYYY");
            risk.dateUpdated = formatDate(risk.dateUpdated, serverformat, "MM-DD-YYYY");
        }

        function formatDate(date, currentFormat, desiredFormat) {
            if (moment(date, currentFormat).isValid()) {
                date = moment(date, currentFormat).format(desiredFormat);
                return date;
            }
            return null;
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Risks')
                    .then(function (result) {
                        var risks = result.data;
                        _.map(risks, function (risk) {
                            formatRiskDates(risk);
                        });
                        return risks;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Risks/' + id)
                    .then(function (result) {
                        var risk = result.data;
                        formatRiskDates(risk);
                        return risk;
                    });
        }

        function getByProjectNum(project, num) {
            return $http.get(baseUrl + 'api/Project/'+project+'/Risk/'+num)
                    .then(function (result) {
                        var risk = result.data;
                        formatRiskDates(risk);
                        return risk;
                    });
        }

        function getFeatureSecurity(options) {
            var security = {
                allowComments: false,
                allowDelete: false,
                allowFileContainer: false,
                allowFollowers: false,
                allowMetaDataEdit: false,
                allowReviews: false,
                allowSecurity: false,
            };

            var defaultTab = null;
            _.map(options.allowedFeatures, function (securityPermission) {
                switch (securityPermission.name) {
                    case featureOptions.comments:
                        security.allowComments = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.comments;
                        }
                        break;
                    case featureOptions.delete:
                        security.allowDelete = true;
                        break;
                    case featureOptions.metadata:
                        security.allowMetaDataEdit = true;
                        break;
                    case featureOptions.fileContainer:
                        security.allowFileContainer = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.fileContainer;
                        }
                        break;
                    case featureOptions.followers:
                        security.allowFollowers = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.followers;
                        }
                        break;
                    case featureOptions.reviews:
                        security.allowReviews = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.reviews;
                        }
                        break;
                    case featureOptions.security:
                        security.allowSecurity = true;
                        defaultTab = featureOptions.security;
                        break;
                };
            });
            options.defaultActiveTab = defaultTab;
            return security;
        }

        function goToDetail(risk) {
            var stateName = "app.risks.detail2";
            if (angular.isDefined(risk.project) && risk.project !== null) {
                var stateParams = { project: risk.project.name, num: risk.num };
                return $state.go(stateName, stateParams, {}).then(function (state) {
                    return $location.absUrl();
                });

            } else {
                return goToDetailById(risk.id);
            }
        }

        function goToList() {
            $state.go("app.risks");
        }

        function goToDetailById(id) {
            var stateName = "app.risks.detail";
            var stateParams = { id: id };
            return $state.go(stateName, stateParams, {}).then(function (state) {
                return $location.absUrl();
            });
        }

        function handleUnsavedChanges(event, toState, toParams,  reset) {
            var title = "Unsaved changes detected";
            var msg = "Do you want to save your changes before you leave the page";
            var proceedButtonText = "Leave without saving";
            var stayButtonText = "Stay on page"
            return modalDialog.confirmationDialog(title, msg, proceedButtonText, stayButtonText)
                .then(function (result) {
                    reset();
                    $state.go(toState, toParams);
                    return;
                });
        }

        function remove(riskId) {
            return $http.delete(baseUrl + 'api/Risks/' + riskId)
                .then(function (result) {
                    return result;
                });
        }

        function setStatus(riskId, status) {
            return $http.post(baseUrl + 'api/Risks/' + riskId + '/Status', status)
                .then(function (result) {
                    var risk = result.data;
                    risk = formatRiskDates(risk);
                    return risk;
                });
        }

        function update(risk) {
            var validationResult = validate(risk);
            if (validationResult.isSuccessful) {
                var id = risk.id;
                serverFormatDates(risk);
                risk.pageUrl = $location.absUrl();
                return $http.put(baseUrl + 'api/Risks/' + id, risk)
                        .then(function (result) {
                            risk = result.data;
                            formatRiskDates(risk);
                            return risk;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function serverFormatDates(risk) {
            risk.dateCreated = isoFormatDate(risk.dateCreated, "MM-DD-YYYY");
            risk.dateUpdated = isoFormatDate(risk.dateUpdated, "MM-DD-YYYY");
            risk.startDate = isoFormatDate(risk.startDate, "MM-DD-YYYY");
            risk.endDate = isoFormatDate(risk.endDate, "MM-DD-YYYY");
        }

        function isoFormatDate(date, currentFormat) {
            if (date !== null && moment(date, currentFormat).isValid()) {
                date = moment(date, currentFormat).toISOString();
            } else {
                date = null;
            }
            return date;
        }

        //#region Internal Methods


        function validate(risk) {
            var result = {
                isSuccessful: true,
                msgs: []
            };

            if (angular.isDefined(risk) === true && risk !== null) {
                if (angular.isDefined(risk.title) === false || risk.title === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Risk title empty");
                }
                if (angular.isDefined(risk.status) === false || risk.status === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Risk status not set");
                }
            } else {
                result.isSuccessful = false;
                result.msgs.push("Risk empty");
            }
            return result;
        }
        //#endregion
    }
})();
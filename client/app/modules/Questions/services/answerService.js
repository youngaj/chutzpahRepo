(function () {
    'use strict';

    var serviceId = 'answerService';
    angular
        .module('app.modules.questions')
        .factory(serviceId, answerService);

    answerService.$inject = ['$http','$location', '$state', 'common'];

    function answerService($http, $location, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var STATES = {
            ACCEPTED: "Accepted",
            PROPOSED: "Proposed"
        };

        // Define the functions and properties to reveal.
        var service = {
            acceptAnswer: acceptAnswer,
            create: create,
            deleteAnswer: deleteAnswer,
            getById: getById,
            getByQuestionId: getByQuestionId,
            getAll: getAll,
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
            createEntityReference: createEntityReference,
            STATES: STATES
        };

        return service;

        function acceptAnswer(answer) {
            var validationResult = validate(answer);
            if (validationResult.isSuccessful) {
                var id = answer.id;
                answer.clientPageUrl = $location.absUrl();
                return $http.put(baseUrl + 'api/Answers/' + id + "/Accept", answer)
                    .then(function (result) {
                        return result.data;
                    });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function create(questionId, answer) {
            answer.questionId = questionId;
            var validationResult = validate(answer);
            if (validationResult.isSuccessful) {
                answer.clientPageUrl = $location.absUrl();
                return $http.post(baseUrl + 'api/Answers', answer)
                        .then(function (result) {
                            return result.data;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function formatErrorsForDisplay(msgs) {
            var formatedMsg = msgs.length + " validation errors found. <ul>";
            for (var i = 0; i < msgs.length; i++) {
                formatedMsg = formatedMsg + "<li>" + msgs[i] + "</li>";
            }
            formatedMsg = formatedMsg + "</ul>";
            return formatedMsg;
        }

        function formatDates(answer) {
            var serverformat = moment.ISO_8601;
            answer.created = formatDate(answer.created, serverformat, "MM-DD-YYYY");
            answer.timeSince = moment(answer.timeStamp).fromNow();

            return answer;
        }

        function formatDate(date, currentFormat, desiredFormat) {
            if (moment(date, currentFormat).isValid()) {
                date = moment(date, currentFormat).format(desiredFormat);
                return date;
            }
            return null;
        }

        function formatAnswers(data) {
            return _.map(data, function (answer) {
                return formatDates(answer);
            })
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Answers')
                .then(function (result) {
                    var answers = formatAnswers(result.data);
                    return answers;
                });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Answers/' + id)
                    .then(function (result) {
                        var answer = result.data;
                        answer = formatDates(answer);
                        return answer;
                    });
        }

        function getByQuestionId(questionId) {
            return $http.get(baseUrl + 'api/Questions/' + questionId + '/Answers')
                .then(function (result) {
                    var answers = formatAnswers(result.data);
                    return answers;
                });
        }

        function deleteAnswer(answer) {
            return $http.delete(baseUrl + 'api/Answers/'+answer.id)
                .then(function (result) {
                    return result.data;
                });
        }

        function goToDetail(id) {
            $state.go("app.answers.detail", { id: id });
        }

        function goToList() {
            $state.go("app.answers");
        }

        function update(answer) {
            var validationResult = validate(answer);
            if (validationResult.isSuccessful) {
                var id = answer.id;
                answer.clientPageUrl = $location.absUrl();
                return $http.put(baseUrl + 'api/Answers/' + id, answer)
                        .then(function (result) {
                            return result.data;
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function validate(answer) {
            var result = {
                isSuccessful: true,
                msgs: []
            };

            if (angular.isDefined(answer) === true && answer !== null) {
                if (angular.isDefined(answer.text) === false || answer.text === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Answer text empty");
                }
                if (angular.isDefined(answer.questionId) === false || answer.questionId === 0) {
                    result.isSuccessful = false;
                    result.msgs.push("Question reference empty");
                }

            } else {
                result.isSuccessful = false;
                result.msgs.push("Answer empty");
            }
            return result;
        }

        function createEntityReference(answer) {
            var entity = {
                id: answer.id,
                classType: answer.classType,
                compositeKey: answer.compositeKey,
                name: answer.text,
                pageUrl: $location.absUrl()
            }
            return entity;
        }
    }
})();
(function () {
    'use strict';

    var serviceId = 'questionService';
    angular
        .module('app.modules.questions')
        .factory(serviceId, questionService);

    questionService.$inject = ['$http', '$location', '$state', 'common', 'answerService', 'actorService'];

    function questionService($http, $location, $state, common, answerService, actorService) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        // Define the functions and properties to reveal.
        var service = {
            create: create,
            delete: deleteQuestion,
            getById: getById,
            getAll: getAll,
            getStates: getStates,
            goToDetail: goToDetail,
            goToList: goToList,
            update: update,
            createEntityReference: createEntityReference
        };

        return service;

        function create(question) {
            var validationResult = validate(question);
            if (validationResult.isSuccessful) {
                question.clientPageUrl = $location.absUrl();
                return $http.post(baseUrl + 'api/Questions/', question)
                        .then(function (result) {
                            return formatQuestion(result.data);
                        });
            } else {
                var errorMsg = formatErrorsForDisplay(validationResult.msgs);
                logError(errorMsg);
                return $q.reject(errorMsg);
            }
        }

        function deleteQuestion(question){
            return $http.delete(baseUrl + 'api/Questions/' + question.id)
                .then(function (result) {
                    return result;
                });
        }

        function getAll() {
            return $http.get(baseUrl + 'api/Questions')
                .then(function (result) {
                    var questions = _.map(result.data, function (question) {
                        return formatQuestion(question);
                    });
                    return questions;
                });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/Questions/' + id)
                    .then(function (result) {
                        var question = result.data;
                        question = formatQuestion(question);
                        return question;
                    });
        }

        function goToDetail(id) {
            $state.go("app.questions.detail", { id: id });
        }

        function goToList() {
            $state.go("app.questions");
        }

        function update(question) {
            var validationResult = validate(question);
            if (validationResult.isSuccessful) {
                var id = question.id;
                question.clientPageUrl = $location.absUrl();
                return $http.put(baseUrl + 'api/Questions/' + id, question)
                    .then(function (result) {
                        return;
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

        function formatDates(question) {
            var serverformat = moment.ISO_8601;
            question.created = formatDate(question.timeStamp, serverformat, "MM-DD-YYYY");
            question.formatedTimeStamp = moment(question.timeStamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
            question.timeSince = moment(question.timeStamp).fromNow();

            return question;
        }

        function formatDate(date, currentFormat, desiredFormat) {
            if (moment(date, currentFormat).isValid()) {
                date = moment(date, currentFormat).format(desiredFormat);
                return date;
            }
            return null;
        }

        function formatQuestion(question) {
            question = formatDates(question);
            question = formatAvatars(question);
            return question;
        }

        function formatAvatars(question) {
            question.author = actorService.formatAvatars(question.author);
            question.answers = _.map(question.answers, function (answer) {
                answer.author = actorService.formatAvatars(answer.author);
                return answer;
            })
            return question;
        }

        function validate(question) {
            var result = {
                isSuccessful: true,
                msgs: []
            };

            if (angular.isDefined(question) === true && question !== null) {
                if (angular.isDefined(question.text) === false || question.text === null) {
                    result.isSuccessful = false;
                    result.msgs.push("Question text empty");
                }
            } else {
                result.isSuccessful = false;
                result.msgs.push("Question empty");
            }
            return result;
        }

        function getStates() {
            var states = [];
            return $q.when(states);
        }

        function createEntityReference(question) {
            var entity = {
                id: question.id,
                classType: question.classType,
                compositeKey: question.compositeKey,
                name: question.text,
                pageUrl: $location.absUrl()
            }
            return entity;
        }
    }
})();
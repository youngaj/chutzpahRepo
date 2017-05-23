(function () {
    "use strict";

    angular
        .module('app.modules.questions')
        .component('question', {
            templateUrl: 'app/modules/questions/components/question/question.component.html',
            controller: QuestionCntrl,
            controllerAs: 'vm',
            bindings: {
                questionData: '<',
                onDelete: '&',
                onUpdate: '&',
                onLoadAttachments: '&',
                onLoadFollowers: '&',
                onLoadComments: '&'
            }
        });

    QuestionCntrl.$inject = ['common', 'answerService', 'questionService', 'followerService', 'votingService'];
    function QuestionCntrl(common, answerService, questionService, followerService, votingService) {
        var vm = this;

        var controllerId = "QuestionCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var originalQuestion = {};

        vm.cancelEdit = cancelEdit;
        vm.createAnswer = createAnswer;
        vm.deleteAnswer = deleteAnswer;
        vm.editQuestion = editQuestion;
        vm.loadComments = loadComments;
        vm.goToDetail = goToDetail;
        vm.follow = follow;
        vm.upVote = upVote;
        vm.acceptAnswer = acceptAnswer;
        vm.answerDeleted = answerDeleted;
        vm.toggleAnswerEntry = toggleAnswerEntry;
        vm.state = {
            showAnswerEntry: false,
            isLoading: true
        };

        vm.$onInit = function () {
        };

        vm.$onChanges = function (changesObj) {
        }

        function acceptAnswer(answer) {
            answerService.acceptAnswer(answer)
                .then(function (result) {
                    logSuccess("Answer accepted.");
                    vm.questionData.state = questionService.STATES.ANSWERED;
                })
                .catch(function (error) {
                    logError(error.msg);
                });
        }

        function clearSelectedAnswer() {
            vm.selectedAnswer = {};
        }

        function createAnswer(question, answer) {
            answer.questionId = question.Id;
            answerService.create(question.id, answer)
                .then(function (response) {
                    logSuccess("Answer submitted.");
                    question = addAnswer(question, response);
                    vm.state.showAnswerEntry = true;
                    clearSelectedAnswer();
                })
                .catch(function (error) {
                    logError("Couldn't create your answer");
                });
        }

        function addAnswer(question, answer) {
            if (angular.isDefined(question.answers) === false || question.answers === null)
                question.answers = [];
            question.answers.push(answer);
            return question;
        }

        function answerDeleted(removedAnswer) {
            _.remove(vm.questionData.answers, function (answer) {
                return answer.id === removedAnswer.id;
            });
        }

        function deleteAnswer(answer) {
            answerService.deleteAnswer(answer)
                .then(function (result) {
                    logSuccess("Answer deleted.");
                    answerDeleted(answer);
                })
                .catch(function (error) {
                    logError(error.msg);
                });
        }

        function editQuestion(question) {
            originalQuestion = angular.copy(question);
            vm.questionData.showEdit = true;
            return question;
        }

        function cancelEdit() {
            vm.questionData = originalQuestion;
            vm.questionData.showEdit = false;
        }

        function loadComments(question) {
            vm.onLoadComments()(question);
        }

        function goToDetail(question) {
            questionService.goToDetail(question.id);
        }

        function follow(question) {
            followerService.followEntity(question.compositeKey)
                .then(function (follower) {
                    logSuccess("You are now following this question.  You will be notified of updates.");
                })
                .catch(function (error) {
                });
        }

        function upVote(question) {
            var entityReference = questionService.createEntityReference(question);
            votingService.upVote(question.compositeKey, entityReference)
                .then(function (result) {
                    logSuccess("Vote recorded.");
                });
        }

        function toggleAnswerEntry() {
            vm.state.showAnswerEntry = !vm.state.showAnswerEntry;
            vm.questionData.showAnswers = vm.state.showAnswerEntry;
        }
    }
})();
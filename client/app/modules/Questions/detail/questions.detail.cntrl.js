(function (){
    "use strict";

    var controllerId = 'QuestionDetailCntrl';
    angular
        .module('app.modules.questions')
        .controller(controllerId, QuestionDetailCntrl);

    QuestionDetailCntrl.$inject = ['$stateParams', 'common', 'questionService', 'answerService', 'securityService'];

    function QuestionDetailCntrl($stateParams, common, questionService, answerService, securityService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.goToList = goToList;
        vm.save = save;

        vm.owner = {
            options: []
        };
        vm.question = {};
        vm.states = [];
        vm.newQuestion = {};
        vm.title = 'Question Detail';
        vm.state = {
            isLoading: false,
            loadingMsg: 'Default loading message',
            saveBtnText:"Save"
        };
        vm.config = {
            avatarSize: 60,
            allowEdit: false,
            allowDelete: false,
            allowComments: true,
            allowAttachments: false,
            allowFollowers: false
        };

        vm.createAnswer = createAnswer;
        vm.acceptAnswer = acceptAnswer;

        activate();
        function activate() {
            getQuestionStates();

            var questionId = parseInt($stateParams.id);
            if (questionId !== 0) {
                getQuestion(questionId);
            } else {
                securityService.getLoggedInUser().then(function (owner){
                    vm.question.owner = owner;
                });
            }
        }

        function getQuestion(id) {
            vm.state.isLoading = true;
            vm.state.loadingMsg = "Getting the question data from the server...";
            return questionService.getById(id).then(function (question) {
                vm.question = question;
                vm.state.isLoading = false;
            }, function (errorResponse) {
                vm.state.isLoading = false;
            });
        }

        function getQuestionStates(id) {
            return questionService.getStates().then(function (states) {
                vm.states = states;
            });
        }

        function goToList() {
            questionService.goToList();
        }

        function save(question) {
            if (vm.state.isLoading !== true) {
                vm.state.isLoading = true;
                question = formatTags(question);
                if (typeof question.id !== 'undefined' && question.id > 0) {
                    vm.state.loadingMsg = "Updating the question data on the server...";
                    vm.state.saveBtnText = "Updating...";
                    return questionService.update(question).then(function (result) {
                        logSuccess("Question Updated.");
                        resetState();
                    }, function (errorResponse) {
                        resetState();
                    });
                } else {
                    vm.state.loadingMsg = "Creating the question on the server...";
                    vm.state.saveBtnText = "Saving...";
                    return questionService.create(question).then(function (result) {
                        vm.question = result;
                        logSuccess("Question created.");
                        resetState();
                    }, function (errorResponse) {
                        resetState();
                    });;
                }
            }
        }

        function clearSelectedAnswer() {
            vm.selectedAnswer = {};
        }

        function acceptAnswer(answer) {
            answerService.acceptAnswer(answer)
                .then(function (result) {
                    logSuccess("Answer accepted.");
                    vm.question.state = answerService.STATES.ANSWERED;
                })
                .catch(function (error) {
                    logError(error.msg);
                });
        }

        function createAnswer(question, answer) {
            answer.questionId = question.Id;
            answerService.create(question.id, answer)
                .then(function (response) {
                    logSuccess("Answer submitted.");
                    question = addAnswer(question, response);
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

        function resetState() {
            vm.state.isLoading = false;
            vm.state.saveBtnText = "Save";
        }

        function formatTags(question) {
            if (angular.isDefined(question.tags) && question.tags != null && question.tags.length > 0) {
                _.map(question.tags, function (tag) {
                    tag.entityCompositeKey = question.compositeKey;
                    tag.entityClassType = question.classType;
                });
            }
            return question;
        }
    }
})();

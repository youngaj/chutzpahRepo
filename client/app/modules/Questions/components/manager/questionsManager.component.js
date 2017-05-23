(function () {
    "use strict";


    angular
        .module('app.modules.questions')
        .component('questionsManager', {
            templateUrl: 'app/modules/questions/components/manager/questionsManager.component.html',
            controller: QuestionsManagerCntrl,
            controllerAs: 'vm',
            bindings: {
            }
        });

    QuestionsManagerCntrl.$inject = ['$timeout', 'common', 'questionService'];
    function QuestionsManagerCntrl($timeout, common, questionService) {
        var vm = this;

        var controllerId = "QuestionsManagerCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var questions = [];
        vm.question = {
            compositeKey:"question-0"
        };

        vm.addFile = addFile;
        vm.save = save;
        vm.orderedQuestions = [];
        vm.deleteQuestion = deleteQuestion;
        vm.updateQuestion = updateQuestion;
        vm.loadAttachments = loadAttachments;
        vm.loadComments = loadComments;
        vm.loadFollowers = loadFollowers;
        vm.filterQuestions = filterQuestions;
        vm.state = {
            isLoading: true,
            loadingMsg: ""
        };

        vm.$onInit = function () {
            getQuestions();
        };

        vm.$onChanges = function (changesObj) {
        }

        function filterQuestions(text) {
            vm.searchText = text;
        }

        function getQuestions() {
            vm.state.isLoading = true;
            vm.state.loadingMsg = "Getting the questions from the server...";
            questionService.getAll()
                .then(function (serverResponse) {
                    questions = serverResponse;
                    vm.orderedQuestions = sortQuestions(questions);
                    vm.state.isLoading = false;
                })
                .catch(function (errorResponse) {
                    vm.state.isLoading = false;
                });
        }

        function sortQuestions(questions) {
            return _.sortBy(questions, function (question) { return -1 * question.voteCount });
        }

        function save(question) {
            questionService.create(question)
                .then(function (result) {
                    logSuccess("Question saved.");
                    if(question.hasAttachments === true){
                        question.action = "submit";
                    }
                    vm.orderedQuestions.push(result);
                    vm.question = {};
                })
                .catch(function (error) {
                    logError("Question save failed.");
                });
        }

        function deleteQuestion(question) {
            return questionService.delete(question)
                .then(function (result) {
                    logSuccess("Question deleted");
                    _.remove(vm.orderedQuestions, function (curr) { return question.id == curr.id; });
                })
                .catch(function (error) {
                    logError("Question delete failed. " + error.msg);
                });
        }

        function updateQuestion(question) {
            return questionService.update(question)
                .then(function (result) {
                    logSuccess("Question updated");
                    question.showEdit = false;
                    return question;
                })
                .catch(function (error) {
                    logError("Question update failed. " + error.msg);
                });
        }

        //-- currently not used until I can resolve how to hold the attachments until after the question is submitted.
        function addFile(question){
            question.autoProcess = false;
            question.hasAttachments = true;
            vm.entity = question;
            $('#modalAttachments').modal('show');
        }

        function loadAttachments(entity) {
            entity.autoProcess = false;
            vm.entity = entity;
            $('#modalAttachments').modal('show');
        }

        function loadComments(entity) {
            vm.entity = entity;
            $('#modalComments').modal('show');
        }

        function loadFollowers(entity) {
            vm.entity = entity;
            $('#modalFollowers').modal('show');
        }
    }
})();
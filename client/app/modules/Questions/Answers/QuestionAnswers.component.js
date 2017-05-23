(function () {
    "use strict";


    angular
        .module('app.modules.questions')
        .component('questionAnswers', {
            templateUrl: 'app/modules/Questions/Answers/QuestionAnswers.component.html',
            controller: QuestionAnswersCntrl,
            controllerAs: 'vm',
            bindings: {
                questionId: '<',
                answers: '<',
                allowEdit: '<'
            }
        });

    QuestionAnswersCntrl.$inject = ['common', 'answerService'];
    function QuestionAnswersCntrl(common, answerService) {
        var vm = this;

        var controllerId = "QuestionAnswersCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var questionAnswers = [];
        vm.arrangedAnswers = [];
        vm.submitAnswer = submitAnswer;

        vm.state = {
            isLoading: true
        };

        vm.$onInit = function () {
            vm.state.isLoading = false;
        };

        vm.$onChanges = function (changesObj) {
        }

        function submitAnswer(answer) {
            if (answer.text.length > 0) {

                answerService.create(questionId, answer)
                    .then(function (response) {
                        questionAnswers.push(response);
                        orderAnswers(questionAnswers);
                        answer = null;
                        logSuccess("Answer accepted.");
                    })
                    .catch(function (error) {

                    });
            }
        }

        function orderAnwers(answers) {
            vm.arrangedAnswers = answers;
        }

    }
})();
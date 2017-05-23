(function () {
    "use strict";


    angular
        .module('app.modules.questions')
        .component('questionAnswer', {
            templateUrl: 'app/modules/questions/components/answer/answer.component.html',
            controller: QuestionAnswerCntrl,
            controllerAs: 'vm',
            bindings: {
                answer: '<',
                questionId: '<',
                questionOwner: '<',
                avatarSize: '<',
                onAcceptAnswer: '&',
                onAnswerDeleted: '&',
                onLoadComments: '&'
            }
        });

    QuestionAnswerCntrl.$inject = ['common', 'answerService', 'votingService', 'securityService'];
    function QuestionAnswerCntrl(common, answerService, votingService, securityService) {
        var vm = this;

        var controllerId = "QuestionAnswerCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.state = {
            isLoading: true
        };
        vm.loadComments = loadComments;
        vm.upVote = upVote;
        vm.edit = edit;
        vm.delete = deleteAnswer;
        vm.update = update;
        vm.cancelEdit = cancelEdit;
        vm.loggedInUser = {};
        if(vm.avatarSize == null)
            vm.avatarSize = 25;

        vm.$onInit = function () {
            securityService.getLoggedInUser().then(function (user) {
                vm.loggedInUser = user;
                vm.answer = updateSecurity(user, vm.questionOwner, vm.answer);
            });
        };

        vm.$onChanges = function (changesObj) {
            securityService.getLoggedInUser().then(function (user) {
                vm.loggedInUser = user;
                vm.answer = updateSecurity(user, vm.questionOwner, vm.answer);
            });
        }

        function updateSecurity(user, questionOwner, answer) {
            if (angular.isDefined(answer) == false || answer == null)
                return answer;

            if (user.compositeKey == answer.author.compositeKey) {
                answer.canEdit = true;
                if (answer.state != answerService.STATES.ACCEPTED);
                    answer.canDelete = true;
            }

            if (questionOwner.compositeKey == user.compositeKey && answer.state != answerService.STATES.ACCEPTED) {
                answer.canAcceptAnswer = true;
            }

            return answer;
        }

        function edit(answer) {
            answer.showEdit = true;
        }

        function cancelEdit() {
            answer.showEdit = false;
        }

        //-- This function should be passed in from the question component
        function deleteAnswer(answer) {
            answerService.deleteAnswer(answer)
                .then(function (result) {
                    logSuccess("Answer deleted.");
                    vm.onAnswerDeleted(answer);
                })
                .catch(function (error) {
                    logError(error.msg);
                });
        }

        function loadComments(answer) {
            vm.onLoadComments()(answer);
        }

        function update(answer) {
            answerService.update(answer).then(function (data) {
                logSuccess("Answer updated");
                answer.showEdit = false;
            })
        }

        function upVote(answer) {
            var entityReference = answerService.createEntityReference(answer);
            votingService.upVote(answer.compositeKey, entityReference)
                .then(function (result) {
                    logSuccess("Vote recorded.");
                });
        }

    }
})();
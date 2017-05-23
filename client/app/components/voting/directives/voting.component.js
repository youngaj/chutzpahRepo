(function () {
    "use strict";


    angular
        .module('app.components.voting')
          .component('votingPanel', {
              templateUrl: 'app/components/voting/voting.component.html',
              controller: VotingPanelCntrl,
              controllerAs: 'vm',
              bindings: {
                  entityCompositeKey: '<',
                  entityReference: '<',
                  securityConfig: '='
              }
          });

    VotingPanelCntrl.$inject = ['common', 'securityService', 'votingService'];
    function VotingPanelCntrl(common, securityService, votingService) {
        var vm = this;

        var controllerId = "VotingPanelCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.votes = [];
        vm.myVote = {};

        vm.$onInit = function () {
            getVotes(vm.entityCompositeKey);
            securityService.getLoggedInUser().then(function (user) {
                _currUser = user;
            });
        };

        vm.$onChanges = function (changesObj) {
        }

        function getVotes(entityCompositeKey) {
            votingService.getByEntityCompositeKey(entityCompositeKey).then(function (data) {
                debug(data);
                vm.myVote = findMyVote(data);
                vm.votes = data;
            }).catch(errorResponse);
        }

        function findMyVote(votes) {
            return _.find(votes, function (vote) { return vote.UserId === currUser.id });
        }

        function like(entityCompositeKey) {
            votingService.upVote(entityCompositeKey)
                .then(function (vote) {
                    vm.myVote = vote;
                });
        }

        function errorResponse(error) {
            logError("server error");
        }


    }
})();
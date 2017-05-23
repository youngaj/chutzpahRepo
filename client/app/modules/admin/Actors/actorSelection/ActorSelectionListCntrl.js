(function () {
    "use strict";


    angular
        .module('app.modules.actors')
        .controller('ActorSelectionListCntrl', ActorSelectionListCntrl);

    ActorSelectionListCntrl.$inject = ['$scope', 'common', 'actorService'];
    function ActorSelectionListCntrl($scope, common, actorService) {
        var controllerId = 'ActorSelectionListCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;
        var allActors = [];
        vm.actors = [];
        vm.state = {
            isLoading: false,
        };

        vm.getActors = getActors;
        vm.clearActors = clearActors;
        vm.selectActor = selectActor;

        //activate();
        $scope.$watch('vm.allActorOptions', function (newValue, oldValue) {
            debug("vm.allActorOptions updated", newValue);
            if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                if (newValue != oldValue || (newValue === oldValue && vm.allActorOptions.length === 0)) {
                    debug("Triggered allActors update");
                    vm.actors = newValue;
                    allActors = newValue;
                } else {
                    debug("newValue == oldValue", newValue, oldValue);
                }
            }
        });

        $scope.$watch('vm.selectActors', function (newValue, oldValue) {
            debug("vm.selectActors updated");
            if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                if (newValue != oldValue || (newValue === oldValue && vm.selectActors.length === 0)) {
                    vm.selectedActors = newValue;
                }
            }
        });

        function activate() {
            vm.title = "Hello From activation";
            vm.actors = allActors;
        }

        function clearActors() {
            vm.actors = [];
        }

        function getActors() {
            vm.state.isLoading = true;
            return actorService.getAll().then(function (actors) {
                allActors = actors;
                vm.state.isLoading = false;
                return allActors;
            });
        }

        function selectActor(actor) {
            if (angular.isDefined(vm.selectActors) === false)
                vm.selectActors = [];

            if (actor.isSelected) {
                removeActor(actor);
            } else {
                addActor(actor);
            }
            //actor.isSelected = !actor.isSelected;
            vm.onUpdate()(actor);
        }

        function addActor(actor) {
            vm.selectActors.push(actor);
        }

        function removeActor(actor) {
            _.remove(vm.selectedActors, function (selectedActor) { return selectedActor.compositeKey == actor.compositeKey; });

        }

    }

})();


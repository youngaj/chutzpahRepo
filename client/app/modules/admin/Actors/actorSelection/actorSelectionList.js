(function (){
    "use strict";

    angular
        .module('app.modules.actors')
        .directive('actorSelectionList', actorSelectionList);

    actorSelectionList.$inject = [];

    function actorSelectionList() {
        // Usage:
        //<actor-selection-list> </actor-selection-list>
        // Creates:
        //
        var directive = {
            restrict: 'AE',
            bindToController: {
                allActorOptions: '=',
                selectedActors: '=?',
                title: '=',
                onUpdate: '&'
            },
            scope: {},
            controller: 'ActorSelectionListCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/modules/admin/actors/actorSelection/actorSelectionList.html'
        };
        return directive;
    }

})();

(function (){
    "use strict";


    angular
        .module('app.modules.search')
        .controller('UserSearchResultCntrl', UserSearchResultCntrl);

    UserSearchResultCntrl.$inject = ['$scope', '$state', 'common'];
    function UserSearchResultCntrl($scope, $state, common) {
        var vm = this;
        var controllerId = 'UserSearchResultCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.like = like;
        vm.goToDetail = goToDetail;

        function goToDetail(id) {
            $state.go("app.actors.users.edit", { id: id });
        }

        function like(compositeKey) {
            logError("Not implemented yet");
        }

    }
})();


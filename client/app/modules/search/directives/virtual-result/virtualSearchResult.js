(function (){

    "use strict";

    angular
         .module('app.modules.search')
         .directive('virtualSearchResult', userResult);

    userResult.$inject = [];

    function userResult() {
        // Usage:
        //<user-result> </user-result>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                item: '=?',
            },
            controller: 'VirtualSearchResultCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/modules/search/directives/virtual-result/virtualSearchResult.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

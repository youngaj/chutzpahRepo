(function (){
    "use strict";

    angular
        .module('app.modules.search')
        .directive('userSearchResult', userSearchResult);

    userSearchResult.$inject = [];

    function userSearchResult() {
        // Usage:
        //<user-search-result> </user-search-result>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                user: '=?',
            },
            controller: 'UserSearchResultCntrl',
            controllerAs: 'vm',
            templateUrl: 'app/modules/search/directives/user-result/userSearchResult.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }

})();

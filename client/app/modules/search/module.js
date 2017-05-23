(function () {
    "use strict";

    angular.module('app.modules.search', ['ui.router', 'app.components.common', 'app.modules.virtualFolders', 'app.components.fileContainer']);

    angular
        .module('app.modules.search')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.search', {
                url: '/search?q',
                data: {
                    title: 'Search'
                },
                views: {
                    "content@app": {
                        controller: 'SearchCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/search/search.html',
                        resolve:{

                        }
                    }
                }
            })

    });

})();

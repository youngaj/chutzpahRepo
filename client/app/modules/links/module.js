(function () {

    "use strict";

    angular.module('app.modules.links', ['ui.router',
        'ngTagsInput',
        'app.forms',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        'ui.grid.resizeColumns',
        'app.components.actors',
        'app.components.common',
        'app.components.review'
    ]);

    angular.module('app.modules.links')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.links', {
                url: '/links',
                data: {
                    title: 'Links'
                },
                views: {
                    "content@app": {
                        controller: 'LinkListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/links/list/links.list.html'
                    }
                },
                resolve: {
                    scripts: function (lazyScript) {
                        return lazyScript.register([
                                'build/vendor.datatables.js'
                        ]);
                    }
                }
            })

            .state('app.links.detail', {
                url: '/:id',
                data: {
                    title: 'Link Detail'
                },
                views: {
                    "content@app": {
                        controller: 'LinkDetailCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/links/detail/links.detail.html',
                        params: ['id'],
                        resolve: {
                       }
                    }
                },
                resolve: {
                    scripts: function (lazyScript) {
                        return lazyScript.register([
                                'build/vendor.ui.js'
                        ]);
                    }
                }

            })

    });

})();
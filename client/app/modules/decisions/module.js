(function () {

    "use strict";


    angular.module('app.modules.decisions', [
        'ui.router',
        'app.forms',
        'app.components.common',
        'app.components.review',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        'ui.grid.resizeColumns']);

    angular.module('app.modules.decisions')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.decisions', {
                url: '/decisions',
                data: {
                    title: 'Decisions'
                },
                views: {
                    "content@app": {
                        controller: 'DecisionListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/decisions/list/list.html'
                    }
                }
            })

            .state('app.decisions.edit', {
                url: '/:id',
                data: {
                    title: 'Decision Edit'
                },
                views: {
                    "content@app": {
                        controller: 'DecisionEditCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/decisions/edit/edit.html',
                        //resolve: {
                        //    deps: $couchPotatoProvider.resolveDependencies([
                        //        'modules/forms/directives/input/smartTagsinput',
                        //    ])
                        //}
                    }
                }
            })

            .state('app.decisionsStatuses', {
                url: '/decisionStatus',
                data: {
                    title: 'Decision Status'
                },
                views: {
                    "content@app": {
                        controller: 'DecisionStatusListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/decisions/status/list/list.html'
                    }
                }
            })

            .state('app.decisionsStatuses.edit', {
                url: '/:id',
                data: {
                    title: 'Decision Status Edit'
                },
                views: {
                    "content@app": {
                        controller: 'DecisionStatusEditCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/decisions/status/edit/edit.html'
                    }
                }
            })
    });

})();
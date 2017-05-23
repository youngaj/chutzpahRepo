(function () {

    "use strict";

    angular.module('app.modules.risks', ['ui.router',
        'ngTagsInput',
        'app.forms',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        'ui.grid.resizeColumns',
        'app.components.common',
        'app.components.review',
        'app.components.changeHistory']);

    angular.module('app.modules.risks')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.risks', {
                url: '/risks',
                data: {
                    title: 'Risks'
                },
                views: {
                    "content@app": {
                        controller: 'RiskListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/list/list.html'
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

            .state('app.risks.detail', {
                url: '/:id',
                data: {
                    title: 'Risk Detail'
                },
                views: {
                    "content@app": {
                        controller: 'RiskDetailCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/detail/detail.html',
                        params: ['id'],
                        resolve: {
                            entity: ['$stateParams', '$q', 'riskService',
                               function ($stateParams, $q, riskService) {
                                   var id = $stateParams.id;
                                   if (id == 0) {
                                       var emptyRisk = {};
                                       return $q.when(emptyRisk);
                                   } else {
                                       return riskService.getById($stateParams.id).then(function (risk) {
                                           return risk;
                                       });
                                   }
                               }],
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

            .state('app.risks.detail2', {
                 url: '/:project/:num',
                 data: {
                     title: 'Risk Detail'
                 },
                 views: {
                     "content@app": {
                         controller: 'RiskDetailCntrl',
                         controllerAs: 'vm',
                         templateUrl: 'app/modules/risks/detail/detail.html',
                         params: ['project', 'num'],
                         resolve: {
                             entity: ['$stateParams', 'riskService',
                                function ($stateParams, riskService) {
                                    return riskService.getByProjectNum($stateParams.project, $stateParams.num).then(function (risk) {
                                        return risk;
                                    });
                                }],
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

            .state('app.risksStatuses', {
                url: '/riskStatus',
                data: {
                    title: 'Risk Status'
                },
                views: {
                    "content@app": {
                        controller: 'RiskStatusListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/status/list/list.html'
                    }
                }
            })

            .state('app.risksStatuses.detail', {
                url: '/:id',
                data: {
                    title: 'Risk Status Detail'
                },
                views: {
                    "content@app": {
                        controller: 'RiskStatusDetailCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/status/detail/detail.html'
                    }
                }
            })

            .state('app.riskStates', {
                url: '/riskStates',
                data: {
                    title: 'Risk States'
                },
                views: {
                    "content@app": {
                        controller: 'RiskStateListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/state/list/list.html'
                    }
                }
            })

            .state('app.riskStates.detail', {
                url: '/:id',
                data: {
                    title: 'Risk State Detail'
                },
                views: {
                    "content@app": {
                        controller: 'RiskStateDetailCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/status/detail/detail.html'
                    }
                }
            })

            .state('app.riskTypes', {
                url: '/riskTypes',
                data: {
                    title: 'Risk Types'
                },
                views: {
                    "content@app": {
                        controller: 'RiskTypeListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/type/list/list.html'
                    }
                }
            })

            .state('app.riskTypes.detail', {
                url: '/:id',
                data: {
                    title: 'Risk Type Detail'
                },
                views: {
                    "content@app": {
                        controller: 'RiskTypeDetailCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/risks/type/detail/detail.html'
                    }
                }
            })

    });

})();
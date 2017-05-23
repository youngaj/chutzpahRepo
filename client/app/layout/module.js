"use strict";


angular.module('app.layout', ['ui.router', 'app.components.actors'])

.config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
        .state('app', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/layout.tpl.html',
                    controller: 'LayoutCntrl',
                    controllerAs: 'layoutVm',
                }
            }
        });
    $urlRouterProvider.otherwise('/links');

})


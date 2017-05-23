(function () {

    "use strict";

    angular.module('app.modules.migration', ['ui.router', 'app.components.common']);

    angular
        .module('app.modules.migration')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.migration', {
                url:'/admin/migration',
                data: {
                    title: 'Migration'
                },
                views: {
                    "content@app": {
                        controller: 'MigrationCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/migration/migration.html'
                    }
                }
            });

    });

})();
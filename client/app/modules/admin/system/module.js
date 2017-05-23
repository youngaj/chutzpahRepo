(function () {

    "use strict";

    angular
        .module('app.modules.system', [
            'ui.router',
            'app.components.common',
            'app.components.review',
            'app.components.security',
        ]);

     angular
        .module('app.modules.system')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.system', {
                url:'/admin/system',
                data: {
                    title: 'System'
                },
                views: {
                    "content@app": {
                        controller: 'SystemCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/system/system.html'
                    }
                }
            });

    });

})();
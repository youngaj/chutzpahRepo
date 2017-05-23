(function () {

    "use strict";

    angular.module('app.modules.it', ['ui.router',
        'app.components.actors',
        'app.components.common',
        'app.components.security',
        'app.components.it'
    ]);

    angular.module('app.modules.it')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.it', {
                url: '/it',
                data: {
                    title: 'Information Technology'
                },
                views: {
                    "content@app": {
                        controller: '',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/it/main.html',
                    }
                }
            })

            //.state('app.it.software', {
            //    url: '/software',
            //    data: {
            //        title: 'Software List'
            //    },
            //    views: {
            //        "content@app": {
            //            controller: 'SoftwareListCntrl',
            //            controllerAs: 'vm',
            //            templateUrl: 'app/modules/it/software/softeware.list.html',
            //        }
            //    },
            //    resolve: {
            //        scripts: function (lazyScript) {
            //            return lazyScript.register([
            //            ]);
            //        }
            //    }
            //})

            //.state('app.it.software', {
            //    url: '/software/:id',
            //    data: {
            //        title: 'Software Detail'
            //    },
            //    views: {
            //        "content@app": {
            //            controller: 'SoftwareDetailCntrl',
            //            controllerAs: 'vm',
            //            templateUrl: 'app/modules/it/software/softeware.detail.html',
            //            params: ['id']
            //        }
            //    },
            //    resolve: {
            //        scripts: function (lazyScript) {
            //            return lazyScript.register([
            //            ]);
            //        }
            //    }
            //})

            .state('app.it.hardware', {
                url: '/hardware',
                data: {
                    title: 'Hardware List'
                },
                views: {
                    "content@app": {
                        controller: 'HardwareListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/it/hardware/hardware.list.tpl.html'
                    }
                },
                resolve: {
                    scripts: function (lazyScript) {
                        return lazyScript.register([
                        ]);
                    }
                }
            })

            //.state('app.it.hardware.detail', {
            //    url: '/hardware/:id',
            //    data: {
            //        title: 'Hardware Detail'
            //    },
            //    views: {
            //        "content@app": {
            //            controller: 'HardwareDetailCntrl',
            //            controllerAs: 'vm',
            //            templateUrl: 'app/modules/it/hardware/hardware.detail.html',
            //            params: ['id']
            //        }
            //    },
            //    resolve: {
            //        scripts: function (lazyScript) {
            //            return lazyScript.register([
            //            ]);
            //        }
            //    }

            //})

    });

})();
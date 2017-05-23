(function () {

    "use strict";


    angular.module('app.modules.photos', [
        'ui.router',
        'app.forms',
        'app.components.common',
        'ui.bootstrap'
    ]);

    angular.module('app.modules.photos')
        .config(function ($stateProvider) {

            $stateProvider
                .state('app.photos', {
                    url: '/photos',
                    data: {
                        title: 'Photos'
                    },
                    views: {
                        "content@app": {
                            controller: 'PhotoWelcomeCntrl',
                            controllerAs: 'vm',
                            templateUrl: 'app/modules/photos/welcome.html'
                        }
                    }
                })

                .state('app.photos.gallery', {
                    url: '/photos/gallery',
                    data: {
                        title: 'Photo Gallery'
                    },
                    views: {
                        "content@app": {
                            controller: 'PhotoGalleryCntrl',
                            controllerAs: 'vm',
                            templateUrl: 'app/modules/photos/gallery.html'
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
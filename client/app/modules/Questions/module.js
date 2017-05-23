(function () {

    "use strict";

    angular.module('app.modules.questions', ['ui.router']);

    angular.module('app.modules.questions', ['ui.router',
        'ngTagsInput',
        'app.forms',
        'ui.bootstrap',
        'ngSanitize',
        'app.components.actors',
        'app.components.common',
        'app.components.review',
        'app.components.security',
        'app.components.voting'
    ]);

    angular.module('app.modules.questions')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.questions', {
                url: '/questions',
                data: {
                    title: 'Questions'
                },
                views: {
                    "content@app": {
                        controller: '',
                        controllerAs: 'vm',
                        template: '<questions-manager></questions-manager>'
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

            .state('app.questions.detail', {
                url: '/:id',
                data: {
                    title: 'Question Detail'
                },
                views: {
                    "content@app": {
                        controller: 'QuestionDetailCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/questions/detail/questions.detail.html',
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
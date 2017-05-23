'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

var _lastActivityDate = new Date();

angular.module('app', [
    'ngSanitize',
    'ngAnimate',
    'restangular',
    'ui.router',
    'ui.bootstrap',

     //Smartadmin Angular Common Module
    'SmartAdmin',
    'SignalR',

     //App
    'app.auth',
    'app.layout',
    'app.chat',
    'app.dashboard',
    'app.calendar',
    'app.inbox',
    'app.graphs',
    'app.tables',
    'app.forms',
    'app.ui',
    'app.widgets',
    'app.maps',
    'app.appViews',
    'app.misc',
    'app.smartAdmin',
    'app.eCommerce',

    //-- Third party scripts
    'ngTagsInput',
    'dndLists',

    'app.components',
    'app.components.common',
    'app.components.actors',
    'app.components.changeHistory',
    'app.components.entityGraph',
    'app.components.fileContainer',
    'app.components.followers',
    'app.components.review',
    'app.components.security',
    'app.components.it',

    'app.modules.questions',
    'app.modules.system',
    'app.modules.migration',
    'app.modules.actors',
    'app.modules.decisions',
    'app.modules.risks',
    'app.modules.virtualFolders',
    'app.modules.search',
    'app.modules.photos',
    'app.modules.links',
    'app.modules.it'
])
.value('LAST_ACTIVITY', _lastActivityDate)
.config(function ($provide, $httpProvider, RestangularProvider) {


    // Intercept http calls.
    $provide.factory('ErrorHttpInterceptor', function ($q) {
        var errorCounter = 0;
        function notifyError(rejection){
            console.log(rejection);
            var status = rejection.status;
            var title = rejection.status + ' ' + rejection.statusText;
            var msg = "";
            if (status === 401) {
                msg = "You are not authenticated.";
            }
            if (status === 403) {
                msg = "You are not authorized to access the requested action or resource.";
            }
            if (status === 404) {
                msg = "The requested resource could not be found.";
            }
            if (status === 500) {
                msg = "Server error detected.  Please contact the developer. ";
                if (angular.isDefined(rejection.data.exceptionMessage) && rejection.data.exceptionMessage != null) {
                    msg = msg + "<p>" + rejection.data.exceptionMessage + "</p>";
                }
            }
            if (status === 0) {
                title = "API data service connection error."
                msg = "Seems the application is having some problems talking to the back-end data server.  Please reload your original page.  If this does not solve the problem please contact the developer. "
            }
            $.bigBox({
                title: title,
                content: msg, //rejection.data,
                color: "#C46A69",
                icon: "fa fa-warning shake animated",
                number: ++errorCounter,
                timeout: 6000
            });
        }

        return {
            // On request failure
            requestError: function (rejection) {
                // show notification
                notifyError(rejection);

                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response failure
            responseError: function (rejection) {
                // show notification
                notifyError(rejection);
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    $provide.factory('TimeInterceptor', function (LAST_ACTIVITY) {
        return {
            'request': function (config) {
                LAST_ACTIVITY = new Date();
                return config;
            },
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('ErrorHttpInterceptor');
    $httpProvider.interceptors.push('TimeInterceptor');

    RestangularProvider.setBaseUrl(location.pathname.replace(/[^\/]+?$/, ''));

})
.constant('APP_CONFIG', window.appConfig)

.run(function ($rootScope, $state, $stateParams, $location, $anchorScroll, $timeout, $uibModal, serverNotificationService, userTrackingService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    var modalInstance = null;
    var stateChangeComplete = false;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart');
        if (stateChangeComplete === false) {
            modalInstance = $uibModal.open({
                templateUrl: "app/transition.tpl.html",
                animation: true,
                backdrop: true,
                size: 'md'
            });
            console.log('Modal instance created');
        }
        $timeout(checkLongRunningModal, 10000);
    });

    //when the route is changed scroll to the proper element.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        console.log('stateChangeSuccess');
        stateChangeComplete = true;
        closeModal();

        //-- if for whatever reason the close misses the first time
        $timeout(closeModal, 3000);
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        console.log('stateChangeError');

        stateChangeComplete = true;
        modalInstance = $uibModal.open({
            template: '<h1><i class="fa-fw fa fa-warning"></i> There was an error trying to navigate to the requested page </h1>',
            animation: true,
            backdrop: true,
            size: 'md',
            backdropClass: 'modalBg'

        });
    });

    function checkLongRunningModal() {
        if (modalInstance !== null) {
            console.log("Long running process detected.  Closing modal.");
            closeModal();
        }
    }

    function closeModal() {
        if (modalInstance !== null) {
            console.log("Closing modal", modalInstance);
            modalInstance.dismiss('cancel');
            modalInstance.close(true);
            modalInstance = null;
        }
        //re-enable scrolling
        $("body").removeClass("modal-open");
    }

});



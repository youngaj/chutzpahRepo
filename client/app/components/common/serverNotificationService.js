(function () {
    'use strict';

    angular
        .module('app.components.common')
        .factory('serverNotificationService', serverNotificationService);

    serverNotificationService.$inject = ['$http', '$rootScope', 'common', 'Hub'];


    function serverNotificationService($http, $rootScope, common, Hub) {
        var serviceId = 'serverNotificationService';
        var baseUrl = common.baseUrl;

        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);

        var service = {
            editEmployee: edit,
            doneWithEmployee: done,
        };

        //declaring the hub connection
        var hub = new Hub('serverNotificationHub', {

            //client side methods
            listeners: {
                'progressUpdate': function (msg, percentageComplete) {
                    var progressUpdate = {};
                    progressUpdate.msg = msg;
                    progressUpdate.percentageComplete = percentageComplete;
                    if (percentageComplete == 100) {
                        logSuccess(msg + " " + percentageComplete + "% complete");
                    } else {
                        console.log(msg + " " +percentageComplete + "% complete")
                    }
                    common.$broadcast("progressUpdate", progressUpdate);
                    $rootScope.$apply();
                },
                'newMessage': function (msg) {
                    logError(msg)
                    $rootScope.$apply();
                },
                'changeHistoryUpdate': function (entityCompositeKey, history) {
                    var historyUpdate = {};
                    historyUpdate.entityCompositeKey = entityCompositeKey;
                    historyUpdate.history = history;
                    common.$broadcast("changeHistoryUpdate", historyUpdate);
                    $rootScope.$apply();
                }
            },

            //server side methods
            methods: ['lock', 'unlock'],

            //query params sent on initial connection
            queryParams: {
                'token': 'exampletoken'
            },

            //handle connection error
            errorHandler: function (error) {
                console.error(error);
            },

            //specify a non default root
            //rootPath: '/api

            stateChanged: function (state) {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        //your code here
                        console.log("SignalR connecting");
                        break;
                    case $.signalR.connectionState.connected:
                        //your code here
                        logSuccess("Real-time server connection established");
                        break;
                    case $.signalR.connectionState.reconnecting:
                        //your code here
                        console.log("SignalR Re-Connecting");
                        break;
                    case $.signalR.connectionState.disconnected:
                        //your code here
                        console.error("Real-time server connection broken");
                        break;
                }
            }
        });

        var edit = function (employee) {
            hub.lock(employee.Id); //Calling a server method
        };
        var done = function (employee) {
            hub.unlock(employee.Id); //Calling a server method
        }

        return service;

    }

})();
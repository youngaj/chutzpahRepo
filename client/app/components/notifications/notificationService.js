(function () {
    'use strict';

    var serviceId = 'notificationService';
    angular
        .module("app.components.notifications")
        .factory(serviceId, notificationService);

    notificationService.$inject = ['$http', 'common'];
    function notificationService($http, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var notifications = [];
        var service = {
            getAllByUserId: getAllByUserId,
            sendMessageToFollowers: sendMessageToFollowers
        };

        activate();

        return service;

        function activate() {
        }

        function getAllByUserId(userId) {
            return $http.get(baseUrl + 'api/users/' + userId + '/activities')
                   .then(function (result) {
                       notifications = _.map(result.data, function (activity) {
                           return formatActivity(activity);
                       });
                       return notifications;
                   });
        }

        function formatActivity(activity) {
            activity.formatedTimeStamp = moment(activity.timeStamp).format("MMMM Do YYYY, h:mm:ss a");
            activity.timeSince = moment(activity.timeStamp).fromNow();
            return activity;
        }

        function sendMessageToFollowers(entityCompositeKey, subject, body, linkUrl) {
            var message = {
                subject: subject,
                text: body,
                pageUrl: linkUrl
            };
            var result = isValid(entityCompositeKey, message);
            var url = baseUrl + 'api/Entity/' + entityCompositeKey + '/FollowerMessages';
            if (result.isSuccessful === true) {
                return $http.post(url, message)
                       .then(function (result) {
                           return result.data;
                       });
            } else {
                var msg = result.msgs.join();
                return $q.reject(msg);
            }
        }

        function isValid(entityCompositeKey, obj) {
            var result = {
                isSuccessful: true,
                msgs: []
            }

            if (angular.isDefined(obj) === false || obj === null) {
                result.isSuccessful = false;
                result.msgs.push("Message object is not defined.");
            }

            if (angular.isDefined(entityCompositeKey) === false || entityCompositeKey === null || entityCompositeKey === '') {
                result.isSuccessful = false;
                result.msgs.push("A valid entity reference is required.");
            }
            if (angular.isDefined(obj.subject) === false || obj.subject === null || obj.subject === '') {
                result.isSuccessful = false;
                result.msgs.push("A valid message subject is required.");
            }
            if (angular.isDefined(obj.text) === false || obj.text === null || obj.text === '') {
                result.isSuccessful = false;
                result.msgs.push("A valid message body is required.");
            }

            return result;
        }

    }

})();


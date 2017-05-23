(function () {
    "use strict";

    angular
        .module('app.components.notifications')
        .component('notificationCenter', {
            templateUrl: 'app/components/notifications/notificationCenter/notification-center.tpl.html',
            controller: NotificationCenterCntrl,
            controllerAs: 'vm',
            bindings: {
            }
        });

    NotificationCenterCntrl.$inject = ['common', 'securityService', 'activityService', 'notificationService'];

    function NotificationCenterCntrl(common, securityService, activityService, notificationService) {
        /* jshint validthis:true */
        var controllerId = 'NotificationCenterCntrl';

        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var allItems = [];

        vm.goToUserProfile = goToUserProfile;
        vm.isTabActive = isTabActive;
        vm.setTab = setTab;

        vm.state = {
            totalMsgs: 0,
            activityTypes: [],
            last_update: null,
        };

        vm.$onInit = function () {
            activate();
            vm.state.activeTab="default",
            vm.state.activityTypes = [
                {
                    "title": "Msgs",
                    "name": "msgs",
                    "length": 0
                }
                //{
                //    "title": "Notify",
                //    "name": "notify",
                //    "length": 3
                //},
                //{
                //    "title": "Tasks",
                //    "name": "tasks",
                //    "length": 4
                //}
            ];
            vm.state.last_update = getFormatedCurrentTime();
        };

        function activate() {
            vm.user = { gender: 'Male' };
            var promises = [getMessages()];
            $q.all(promises).then(function () {
                calculateTotals();
            });
        }

        function goToUserProfile(user) {
            if (angular.isDefined(user) && user != null)
                userService.goToDetail(user.id);
            else {
                logError("User reference not found.");
            }
        }

        function isTabActive(tab) {
            return vm.state.activeTab === tab;
        }

        function calculateTotals() {
            vm.state.totalMsgs = allItems.length;
        }

        function setTab(activityType) {
            if (angular.isDefined(activityType) && activityType != null) {
                vm.state.activeTab = activityType;

                activityService.getbytype(activityType, function (data) {
                    if (activityType === 'msgs') {
                        getMessages().then(function (messages) {
                            vm.state.currentActivityItems = messages;
                        });
                    } else {
                        vm.state.currentActivityItems = data.data;
                    }
                    vm.state.last_update = getFormatedCurrentTime();
                });
            }
        };

        function getMessages() {
            return securityService.getLoggedInUser().then(function (user) {
                vm.user = user;
                return notificationService.getAllByUserId(user.id).then(function (messages) {
                    _.map(vm.state.activityTypes, function (activity) {
                        if (activity.name === "msgs")
                            activity.length = messages.length;
                    });
                    allItems = allItems.concat(messages);
                    return messages;
                });
            });
        }


        function getFormatedCurrentTime() {
            var now = Date.now();
            return moment(now).format("MMMM Do YYYY, h:mm:ss a");
        }
    }
})();

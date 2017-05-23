(function () {
    "use strict";

    angular
        .module('app.layout')
        .controller('LayoutCntrl', LayoutCntrl);

    LayoutCntrl.$inject = ['$interval', '$state', 'common', 'configService', 'securityService', 'serverEventService', 'LAST_ACTIVITY'];

    function LayoutCntrl($interval, $state, common, configService, securityService, serverEventService, LAST_ACTIVITY) {
        var layoutVm = this;
        var controllerId = 'LayoutCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        layoutVm.searchText = "";
        layoutVm.executeSearch = goToSearch;
        layoutVm.config = {};
        layoutVm.timeSinceLastActivity = {};

        activate();

        function activate() {
            //-- make sure background services are running
            serverEventService.registerEvents();

            securityService.getLoggedInUser().then(function (user) {
                configService.getAll(user.compositeKey).then(function (config) {
                    layoutVm.config = config;
                });
            });

            layoutVm.timeSinceLastActivity = moment(LAST_ACTIVITY).fromNow();
            $interval(function () {
                layoutVm.timeSinceLastActivity = moment(LAST_ACTIVITY).fromNow();
            }, 60000);
        }

        function goToSearch(searchText) {
            $state.go("app.search", { q: searchText }, { location: "replace" });
        }

    }


})();
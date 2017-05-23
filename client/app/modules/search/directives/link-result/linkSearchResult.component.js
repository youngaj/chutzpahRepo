(function () {
    "use strict";

    angular
        .module('app.modules.search')
        .component('linkSearchResult', {
            templateUrl: 'app/modules/search/directives/link-result/linkSearchResult.component.html',
            controller: LinkSearchResultCntrl,
            controllerAs: 'vm',
            bindings: {
                link: '<',
            }
        });

    LinkSearchResultCntrl.$inject = ['common', 'linkService'];
    function LinkSearchResultCntrl(common, linkService) {
        var vm = this;

        var controllerId = "LinkSearchResultCntrl";
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var linkSearchResult = [];

        vm.arrangedPermissions = [];
        vm.state = {
            isLoading: true
        };

        vm.$onInit = function () {
        };

        vm.$onChanges = function (changesObj) {
        }
    }
})();
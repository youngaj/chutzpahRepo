(function () {
    'use strict';
    var controllerId = 'ClearCacheButtonCntrl';
    angular
        .module("app.components.common")
        .controller('ClearCacheButtonCntrl', ClearCacheButtonCntrl);

    ClearCacheButtonCntrl.$inject = ['$scope', 'common','cacheService'];

    function ClearCacheButtonCntrl($scope, common, cacheService) {
        /* jshint validthis:true */
        var vm = this;
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var baseUrl = common.baseUrl;

        $scope.clearCache = clearCache;
        activate();

        function activate() { }

        function clearCache(entityCompositeKey) {
            cacheService.clearByEntityCompsiteKey(entityCompositeKey).then(function (result) {
                logSuccess("Cache cleared");
            });
        }
    }
})();
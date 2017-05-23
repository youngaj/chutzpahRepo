(function (){

    "use strict";

    var controllerId = 'MigrationCntrl';
    angular
        .module('app.modules.migration')
        .controller(controllerId, MigrationCntrl);

    MigrationCntrl.$inject = ['$http', 'common'];

    function MigrationCntrl($http, common) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'MigrationCntrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var baseUrl = common.baseUrl;

        vm.migrateData = migrateData;

        //TODO: Move these functions to a service
        function migrateData() {
            log("Migrating data");
            return $http.get(baseUrl + 'api/Migration/Execute')
                    .error(function (data, status, headers, config) {
                        logError("Error " + data.ExceptionMessage);
                    })
                    .then(function (result) {
                        logSuccess("Virtual Folders successfully migrated");
                    });
        }

    }
})();

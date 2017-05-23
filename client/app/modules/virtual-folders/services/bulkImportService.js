(function () {

    'use strict';

    angular
        .module('app.modules.virtualFolders')
        .factory('bulkImportService', bulkImportService);

    bulkImportService.$inject = ['$http', 'common'];

    function bulkImportService($http, common) {
        var serviceId = 'bulkImportService';
        var baseUrl = common.baseUrl;
        var getLogFn = common.logger.getLogFn;
        var $q = common.$q;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var statuses = null;

        var service = {
            getFolders: getFolders,
            importFolder: importFolder
        };

        return service;

        function getFolders() {
            return $http.get(baseUrl + 'api/BulkImport/AvailableFolders')
                   .then(function (result) {
                       return result.data;
                   });
        }

        function importFolder(folderName, user, targetFolder) {
            var url = baseUrl + 'api/BulkImport/' + folderName + '/To/'+targetFolder.compositeKey+'/OwnedBy/'+user.compositeKey;
            return $http.post(url)
                   .then(function (result) {
                       return result.data;
                   });
        }
    }

})();


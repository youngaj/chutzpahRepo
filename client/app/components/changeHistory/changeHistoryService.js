(function () {
    'use strict';

    var serviceId = 'changeHistoryService';
    angular
        .module('app.components.changeHistory')
        .factory(serviceId, changeHistoryService);

    changeHistoryService.$inject = ['$http', '$state', 'common'];

    function changeHistoryService($http, $state, common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;

        var featureOptions = common.featureOptions;

        // Define the functions and properties to reveal.
        var service = {
            format: formatChangeRecords,
            getAll: getAll,
            getById: getById,
            getByUserId: getByUserId,
            getByTransactionId: getByTransactionId,
            getByEntityCompositeKey: getByEntityCompositeKey,
            goToDetail: goToDetail,
            goToList: goToList,
        };

        return service;

        function formatErrorsForDisplay(msgs) {
            var formatedMsg = msgs.length + " validation errors found. <ul>";
            for (var i = 0; i < msgs.length; i++) {
                formatedMsg = formatedMsg + "<li>" + msgs[i] + "</li>";
            }
            formatedMsg = formatedMsg + "</ul>";
            return formatedMsg;
        }

        function formatChangeRecords(changeRecords) {
            return _.map(changeRecords, function (changeRecord) {
                return formatDate(changeRecord);
            });
        }

        function formatDate(changeRecord) {
            changeRecord.timeStamp = moment(changeRecord.timeStamp).format('MMMM Do YYYY, h:mm:ss a');
            return changeRecord;
        }

        function getAll() {

            return $http.get(baseUrl + 'api/changeRecords')
                    .then(function (result) {
                        var changeHistory = formatChangeRecords(result.data);
                        return changeHistory;
                    });
        }

        function getById(id) {
            return $http.get(baseUrl + 'api/changeRecords/' + id)
                    .then(function (result) {
                        var changeRecord = formatDate(result.data);
                        return changeRecord;
                    });
        }

        function getByEntityCompositeKey(entityCompositeKey) {
            return $http.get(baseUrl + 'api/Entity/'+entityCompositeKey+'/changeRecords')
                    .then(function (result) {
                        var changeHistory = formatChangeRecords(result.data);
                        return changeHistory;
                    });
        }

        function getByTransactionId(transactionId) {
            return $http.get(baseUrl + 'api/ChangeRecods/Transactions/'+transactionId)
                    .then(function (result) {
                        var changeHistory = formatChangeRecords(result.data);
                        return changeHistory;
                    });
        }

        function getByUserId(userId) {
            return $http.get(baseUrl + 'api/User/'+userId+'/changeRecords')
                    .then(function (result) {
                        var changeHistory = formatChangeRecords(result.data);
                        return changeHistory;
                    });
        }

        function goToDetail(id) {
            $state.go("app.changeHistory.detail", { id: id });
        }

        function goToList() {
            $state.go("app.changeHistory");
        }
    }
})();
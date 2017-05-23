(function (){

    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .controller('VirtualFolderEditCntrl', VirtualFolderEditCntrl);

    VirtualFolderEditCntrl.$inject = ['$scope', '$timeout', 'common', 'virtualFolderService', 'entity', 'virtualStatusService', 'actorService', 'securityPermissionService'];

    function VirtualFolderEditCntrl($scope, $timeout, common, virtualFolderService, entity, virtualStatusService, actorService, securityPermissionService) {
        var controllerId = 'VirtualFolderEditCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        var vm = this;

        vm.displayConfig = {
            comments: true,
            fileContainer: true,
            followers: true,
            history: true,
            review: false,
            security:true
        };
        vm.selectedNode = entity;
        vm.title = 'Virtual Folders Edit';
        vm.statuses = []; //statusList;
        vm.showSave = false;
        vm.actors = []; //actors;
        vm.users = [];
        vm.saveVirtualObj = saveVirtualObj;

        vm.security = {
            allowComments: false,
            allowFileContainer: false,
            allowFollowers: false,
            allowMetaDataEdit: false,
            allowReviews: false,
            allowSecurity: false,
        };

        vm.options = {
            featureOptions: common.featureOptions,
            allowedFeatures: [],
            availableFeatures: [],
            defaultActiveTab: 'security'
        };
        var securityPermissions = [];

        activate();

        function activate() {
            var promises = [getFeatureOptions(entity.classType), getClearedFeatures(entity.compositeKey)];
            getStatuses();
            getActors();
            common.activateController(promises, controllerId)
                .then(function () {
                    if (angular.isDefined(entity) === true) {
                        vm.displayConfig.fileContainer = virtualFolderService.isFileUploadType(vm.selectedNode.classType);
                        applySecurity();
                        $timeout(function () {
                            common.$broadcast("ExpandPathTo", entity);
                        });
                    }
                });
        }

        function applySecurity() {
            vm.security = virtualFolderService.getFeatureSecurity(vm.options);
        }

        function getClearedFeatures(compositeKey) {
            return securityPermissionService.getClearedFeatures(compositeKey).then(function (features) {
                securityPermissions = features;
                vm.options.allowedFeatures = features;
                return features;
            });
        }

        function getActors() {
            return actorService.getAll().then(function (actors) {
                vm.actors = actors;
                setUsers(actors);
            });
        }

        function getStatuses() {
            return virtualStatusService.getAll().then(function (statusList) {
                vm.statuses = statusList;
                setEntityStatus(entity, statusList);
            });
        }

        function getFeatureOptions(classType) {
            return securityPermissionService.getSecurityPermissionOptions(classType).then(function (availableFeatures) {
                vm.options.availableFeatures = availableFeatures;
                return availableFeatures;
            });
        }

        $scope.$watch('vm.selectedNode', function (newValue, oldValue) {
            if (angular.isDefined(newValue)) {
                vm.displayConfig.fileContainer = virtualFolderService.isFileUploadType(newValue.classType);
            }
        });

        function saveVirtualObj() {
            var obj = vm.selectedNode;
            var result = virtualFolderService.save(obj);

            result.then(function (data) {
                vm.selectedNode = data;
                logSuccess("Save complete");
            });
        }

        function setEntityStatus(entity, statuses) {
            var entityStatus = _.find(statuses, { 'id': entity.status.id });
            entity.status = entityStatus;
        }

        function setUsers(actors) {
            var getName = _.property('name');
            var users = _.filter(actors, { 'classType': 'User' });
            users = _.sortBy(users, getName);
            vm.users = users;
        }
    }

})();
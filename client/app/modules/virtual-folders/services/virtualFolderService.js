(function (){

    'use strict';

    angular
        .module('app.modules.virtualFolders')
        .factory('virtualFolderService', virtualFolderService);

    virtualFolderService.$inject = ['$http', '$state', '$location', 'common', 'securityPermissionService'];

    function virtualFolderService($http, $state, $location, common, securityPermissionService) {
        var serviceId = 'virtualFolderService';
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");
        var debug = getLogFn(serviceId);
        var baseUrl = common.baseUrl;
        var featureOptions = common.featureOptions;

        var trees = null;
        var folders = null;
        var sharedFiles = null;
        var allObjs = [];

        var service = {
            featureOptions: featureOptions,

            createVirtualObj: createVirtualObj,
            download: download,
            getAllVirtualObjs: getAllVirtualObjs,
            getById: getById,
            getByCompositeKey: getByCompositeKey,
            getChildren: getChildren,
            getFeatureSecurity: getFeatureSecurity,
            getFullObj: getFullObj,
            getSecurityPermissions: getSecurityPermissions,
            getSecurityPermissionOptions: getSecurityPermissionOptions,
            getTrees: getTrees,
            isFileUploadType: isFileUploadType,
            navigateToEdit: navigateToEdit,
            navigateToWizard: navigateToWizard,
            remove: remove,
            save: save,
            updateVirtualObj: updateVirtualObj,
            validate: validate

        };

        return service;

        function download(entity) {
            var compositeKey = entity.compositeKey;
            return $http.get(baseUrl + 'api/VirtualObjs/' + compositeKey + '/download', {responseType: 'arraybuffer'})
                   .then(function (result) {
                       var blob = new Blob([result.data], { type: "application/octet-stream" });
                       saveAs(blob, entity.name + ".zip");

                   }, function (errorResponse) {
                       logError("Download failed. " + errorResponse.message, errorResponse);
                   });
        }

        function getAllVirtualObjs() {

            return $http.get(baseUrl + 'api/VirtualObjs')
                   .then(function (result) {
                       allObjs = result.data;
                       return result.data;
                   });
        }

        function getChildren(id) {
            return $http.get(baseUrl + 'api/VirtualObjs/'+id+'/children')
                   .then(function (result) {
                       var children = result.data;
                       addVirtualObjs(children);
                       return children;
                   });
        }

        function getFullObj(type, id) {
            var url = baseUrl + 'api/' + type + 's/';
            return $http.get(url + id)
                   .then(function (result) {
                       var obj = result.data;
                       allObjs.push(obj);
                       return obj;
                   });

        }

        function addVirtualObjs(objList) {
            if (allObjs === null) {
                allObjs = [];
            }
            allObjs.concat(objList);
        }

        function getTrees() {
            if (trees !== null) {
                return $q.when(trees);
            }

            return $http.get(baseUrl + 'api/VirtualTrees')
                   .then(function (result) {
                       trees = result.data;
                       addVirtualObjs(trees);
                       return trees;
                   });
        }

        function getByCompositeKey(key, fromServer) {
            var arr = key.split('-');
            var id = _.last(arr);
            return getById(id, fromServer);
        }

        function getById(id, fromServer) {
            if (fromServer !== true) {
                if (allObjs !== null) {
                    var obj = {};
                    for (var i = 0; i < allObjs.length; i++) {
                        obj = allObjs[i];
                        if (obj.id === id) {
                            return $q.when(obj);
                        }
                    }
                }

            }

            //-- if we don't find the item locally check the server
            return $http.get(baseUrl + 'api/VirtualObjs/' + id )
                   .then(function (result) {
                       obj = result.data;
                       allObjs.push(obj);
                       return obj;
                   });
        }

        function getFeatureSecurity(options) {
            var security = {
                allowComments: false,
                allowFileContainer: false,
                allowFollowers: false,
                allowMetaDataEdit: false,
                allowReviews: false,
                allowSecurity: false,
            };

            var defaultTab = null;
            _.map(options.allowedFeatures, function (securityPermission) {
                switch (securityPermission.name) {
                    case featureOptions.comments:
                        security.allowComments = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.comments;
                        }
                        break;
                    case featureOptions.metadata:
                            security.allowMetaDataEdit = true;
                            break;
                    case featureOptions.fileContainer:
                        security.allowFileContainer = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.fileContainer;
                        }
                        break;
                    case featureOptions.followers:
                        security.allowFollowers = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.followers;
                        }
                        break;
                    case featureOptions.reviews:
                        security.allowReviews = true;
                        if (defaultTab === null) {
                            defaultTab = featureOptions.reviews;
                        }
                        break;
                    case featureOptions.security:
                        security.allowSecurity = true;
                        defaultTab = featureOptions.security;
                        break;
                };
            });
            options.defaultActiveTab = defaultTab;
            return security;
        }

        function getFolders() {
            if (folders !== null) {
                return $q.when(folders);
            }

            return $http.get(baseUrl + 'api/VirtualFolders')
                   .then(function (result) {
                       folders = result.data;
                       return result.data;
                   });
        }

        function getSecurityPermissionOptions(entity) {
            return securityPermissionService.getSecurityPermissionOptions(entity.classType);
        }

        function getSecurityPermissions(entity) {
            return securityPermissionService.getClearedFeatures(entity.compositeKey);
        }

        function getSharedFiles() {
            if (sharedFiles !== null) {
                return $q.when(sharedFiles);
            }

            return $http.get(baseUrl + 'api/VirtualSharedFiles')
                   .then(function (result) {
                       sharedFiles = result.data;
                       return result.data;
                   });
        }

        function isFileUploadType(type) {
            var result = false;
            if (type === 'VirtualPhoto' || type === 'VirtualSharedFile') {
                result = true;
            }
            return result;
        }

        function remove(type, id) {
            var url = baseUrl + 'api/' + type + 's/';
            return $http.delete(url + id)
                   .then(function (result) {
                       return result;
                   });
        }

        function save(obj) {
            if (obj !== null) {
                var result = validate(obj);
                if (result.isSuccessful === true) {
                    if (angular.isUndefined(obj.id) || obj.id === 0) {
                        return createVirtualObj(obj);
                    } else {
                        return updateVirtualObj(obj);
                    }
                } else {
                    var msg = result.msgs.join();
                    return $q.reject(msg);
                }

            }
        }

        function createVirtualObj(entity) {
            var result = validate(entity);
            if (result.isSuccessful === true) {
                var url = baseUrl + 'api/' + entity.classType + 's/';
                return $http.post(url, entity)
                       .then(function (result) {
                           return result.data;
                       });
            } else {
                var msg = result.msgs.join();
                logError("Validation error: " + msg);
                return $q.reject(msg);
            }
        }

        function validate(obj) {
            var result = {
                isSuccessful: true,
                msgs: []
            }
            if (angular.isDefined(obj) === false) {
                result.isSuccessful = false;
                result.msgs.push("Object is not defined.");
            }

            if (angular.isDefined(obj.name) === false || obj.name === '') {
                result.isSuccessful = false;
                result.msgs.push("Name/Title is not valid.  Please provide a valid value");
            }

            if (angular.isDefined(obj.status) === false || obj.status.id === 0) {
                result.isSuccessful = false;
                result.msgs.push("Status is not valid.  Please select a valid value");
            }

            return result;
        }

        function navigateToWizard(id, wizardType) {
            if (id !== null) {
                getById(id).then(function (selectedNode) {
                    $state.go("app.virtualFolder.wizard", { type: wizardType, parentKey: selectedNode.compositeKey });
                });
            } else {
                if (wizardType === 'VirtualTree') {
                    $state.go("app.virtualFolder.wizard", { type: wizardType, parentKey: null });
                }
            }
        }

        function navigateToEdit(id, type) {
            var stateName = "app.virtualFolder.edit";
            var stateParams = { type: type, id: id };
            return $state.go(stateName, stateParams, { location: "replace" }).then( function (state){
                return $location.absUrl();
            });
        }

        function updateVirtualObj(entity) {
            var id = entity.id;
            var url = baseUrl + 'api/' + entity.classType + 's/';
            var result = validate(entity);
            if (result.isSuccessful === true) {
                return $http.put(url + id, entity)
                    .then(function (result) {
                        common.$broadcast("Update_VirtualObj", entity);
                        return entity;
                    });
            } else {
                var msg = result.msgs.join();
                logError("Validation error: " + msg);
                return $q.reject(msg);
            }
        }

    }

})();

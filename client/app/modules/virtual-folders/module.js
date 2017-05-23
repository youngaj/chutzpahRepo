(function (){
    "use strict";


    angular
        .module('app.modules.virtualFolders',
        [
            'ui.router',
            'app.forms',
            'app.components.actors',
            'app.components.comments',
            'app.components.entityGraph',
            'app.components.security',
            'app.components.followers',
            'app.components.review',
            'app.components.fileContainer',
            'app.components.notifications',
            'app.components.common'           // common functions, logger, spinner
    ]);

    angular
        .module('app.modules.virtualFolders')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.virtualFolder', {
                url: '/virtual',
                data: {
                    title: 'Virtual Folders'
                },
                views: {
                    "content@app": {
                        controller: 'VirtualFolderCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/virtual-folders/main/main.html',
                    }
                }
            })

            .state('app.virtualFolder.edit', {
                url: '/:type/:id',
                data: {
                    title: 'Virtual Folder'
                },
                views: {
                    "virtualContent": {
                        templateUrl: 'app/modules/virtual-folders/edit/edit.html',
                        controller: 'VirtualFolderEditCntrl',
                        controllerAs: 'vm',
                        params: ['type', 'id'],
                        resolve: {
                            entity: ['$stateParams', 'virtualFolderService',
                                function ($stateParams, virtualFolderService) {
                                    var start = new Date().getTime();
                                    console.log("Starting request for virtual entity: "+ $stateParams.type +"-"+ $stateParams.id);
                                    return virtualFolderService.getFullObj($stateParams.type, $stateParams.id).then(function (vObj) {
                                        console.log("Got requested virtual entity: " + $stateParams.type + "-" + $stateParams.id);
                                        var end = new Date().getTime();
                                        var executionTime = end - start;
                                        console.log("Request for " + $stateParams.type + "-" + $stateParams.id + " took " + executionTime + " ms.");
                                        return vObj;
                                    });
                                }],
                        }
                    }
                },
                resolve: {
                    srcipts: function (lazyScript) {
                        return lazyScript.register([
                            'build/vendor.ui.js',
                        ])

                    }
                }
            })

            .state('app.virtualFolder.wizard', {
                url: '/:type/wizard/:parentKey',
                data: {
                    title: 'Virtual Folder'
                },
                views: {
                    "virtualContent": {
                        controller: 'VirtualFolderWizardCtrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/virtual-folders/wizard/wizard.tpl.html',
                        resolve: {
                            entity: ['$stateParams', 'virtualFolderService',
                                function ($stateParams, virtualFolderService) {
                                    var vObj = {};
                                    vObj.id = 0;
                                    vObj.classType = $stateParams.type;
                                    if ($stateParams.parentKey != null && $stateParams.parentKey != '') {
                                        return virtualFolderService.getByCompositeKey($stateParams.parentKey).then(function (parent) {
                                            vObj.parent = parent;
                                            return vObj;
                                        });
                                    } else {
                                        vObj.parent = null;
                                        return vObj;
                                    }
                                }],
                            actors: ['actorService', function (actorService) {
                                return actorService.getAll();
                            }],
                            statusList: ['virtualStatusService', function (virtualStatusService) {
                                return virtualStatusService.getAll();
                            }],
                        }
                    }
                },
                resolve: {
                    srcipts: function (lazyScript) {
                        return lazyScript.register([
                            'build/vendor.ui.js',
                        ])

                    }
                }

            })

    });

})();
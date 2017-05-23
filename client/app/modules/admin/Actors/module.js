(function (){

    "use strict";

    angular.module('app.modules.actors',
        [
            'ui.router',
            'app.components.common',
            'app.components.actors',
            'ui.grid'
            //'ui.grid.pagination',
            //'ui.grid.selection',
            //'ui.grid.resizeColumns'
        ]);

    angular
        .module('app.modules.actors')
        .config(function ($stateProvider) {

        $stateProvider
            .state('app.actors', {
                abstract: true,
                data: {
                    title: 'Actors'
                }
            })
            .state('app.actors.groups', {
                url: '/groups',
                data: {
                    title: 'Groups'
                },
                views: {
                    "content@app": {
                        controller: 'GroupListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/actors/group/list/list.html'
                    }
                }
            })

            .state('app.actors.groups.edit', {
                url: '/:id',
                data: {
                    title: 'Group Edit'
                },
                views: {
                    "content@app": {
                        controller: 'GroupEditCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/actors/group/edit/edit.html',
                        resolve: {
                            entity: ['$stateParams', 'groupService',
                                function ($stateParams, groupService) {
                                    console.log("getting group from resolve function");
                                    var id = $stateParams.id;
                                    if (id > 0) {
                                        return groupService.getById(id).then(function (group) {
                                            return group;
                                        });
                                    }
                                    else {
                                        return { id: 0, classType: "group" };
                                    }
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
            .state('app.actors.roles', {
                url: '/roles',
                data: {
                    title: 'Roles'
                },
                views: {
                    "content@app": {
                        controller: 'RoleListCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/actors/role/list/list.html'
                    }
                }
            })

            .state('app.actors.roles.edit', {
                url: '/:id',
                data: {
                    title: 'Role Edit'
                },
                views: {
                    "content@app": {
                        controller: 'RoleEditCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/actors/role/edit/edit.html',
                        resolve: {
                            entity: ['$stateParams', 'roleService',
                                function ($stateParams, roleService) {
                                    var id = $stateParams.id;
                                    if (id > 0) {
                                        return roleService.getById(id).then(function (role) {
                                            return role;
                                        });
                                    }
                                    else {
                                        return { id: 0, classType: "role" };
                                    }
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

            .state('app.actors.users', {
                url: '/users',
                data: {
                    title: 'Users'
                },
                views: {
                    "content@app": {
                        controller: 'UserSearchCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/actors/user/list/search.html',
                    }
                },
                resolve: {
                    scripts: function (lazyScript) {
                        return lazyScript.register([
                            'build/vendor.ui.js',
                            'build/vendor.datatables.js'
                        ]);
                    }
                }
            })

            .state('app.actors.users.edit', {
                url: '/:id',
                data: {
                    title: 'User Edit'
                },
                views: {
                    "content@app": {
                        controller: 'UserEditCntrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/modules/admin/actors/user/edit/edit.html',
                        resolve: {
                            entity: ['$stateParams', 'userService',
                                function ($stateParams, userService) {
                                    var id = $stateParams.id;
                                    if (id > 0) {
                                        return userService.getById(id).then(function (user) {
                                            return user;
                                        });
                                    }
                                    else {
                                        return {id : 0, classType:"user" };
                                    }
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
            });

    });

})();
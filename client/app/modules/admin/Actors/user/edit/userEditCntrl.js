(function (){
    "use strict";

    var controllerId = 'UserEditCntrl';
    angular
        .module('app.modules.actors')
        .controller(controllerId, UserEditCntrl);

    UserEditCntrl.$inject = ['$stateParams', 'common', 'userService','securityPermissionService', 'entity'];

    function UserEditCntrl($stateParams, common, userService,  securityPermissionService, entity) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.save = save;

        vm.title = 'User Edit';
        vm.user = entity;
        vm.activeOptions = [
            { name: "Active", value: true },
            { name: "In-Active", value: false },
        ];

        vm.security = {
            allowComments: false,
            allowFileContainer: false,
            allowFollowers: false,
            allowMetaDataEdit: false,
            allowReviews: false,
            allowSecurity: false,
            allowMemberUpdate: false
        };
        vm.options = {
            featureOptions: common.featureOptions,
            allowedFeatures: [],
            availableFeatures: [],
            defaultActiveTab: 'security'
        };
        var securityPermissions = [];

        var myDropzone = null;

        activate();
        function activate() {
            var promises = [getFeatureOptions(entity.classType), getClearedFeatures(entity.compositeKey)];
            common.activateController(promises, controllerId)
                .then(function () {
                    configureUser(entity);
                    if (entity.id != 0) {
                        vm.security = userService.getFeatureSecurity(vm.options);
                    } else {
                        vm.security = newEntitySecurity();
                    }
            });
        }

        function newEntitySecurity() {
            return {
                allowComments: false,
                allowFileContainer: false,
                allowFollowers: false,
                allowMetaDataEdit: true,
                allowReviews: false,
                allowSecurity: false,
                allowMemberUpdate: false
            };
        }

        function configureUser(user) {
            myDropzone = new Dropzone("div#userAvatar", {
                url: common.baseUrl + "api/Actors/" + user.compositeKey + "/avatar",
                clickable: true,
                dictDefaultMessage: '<span class="text-center"><span class="font-lg visible-xs-block visible-sm-block visible-lg-block"><span class="font-lg"><i class="fa fa-caret-right text-danger"></i> Drop files <span class="font-xs">to upload</span></span><span>&nbsp&nbsp<br /><h4 class="display-inline"> (Or Click)</h4></span>',
                autoProcessQueue: true,
                uploadMultiple: true,
                parallelUploads: 1,
                withCredentials: true,
                maxFilesize: 4000,
                init: function () {
                }
            });
        }

        function getClearedFeatures(compositeKey) {
            return userService.getClearedFeatures(compositeKey).then(function (features) {
                securityPermissions = features;
                vm.options.allowedFeatures = features;
                return features;
            });
        }

        function getFeatureOptions(classType) {
            return securityPermissionService.getSecurityPermissionOptions(classType).then(function (availableFeatures) {
                vm.options.availableFeatures = availableFeatures;
                return availableFeatures;
            });
        }

        function save() {
            if (typeof vm.user.id !== 'undefined' && vm.user.id > 0) {
                return userService.updateUser(vm.user).then(function (user) {
                    logSuccess("User Updated.");
                });
            } else {
                return userService.createUser(vm.user).then(function (user) {
                    vm.user = user;
                    logSuccess("User created.");
                    userService.goToDetail(user.id);
                });
            }
        }
    }
})();


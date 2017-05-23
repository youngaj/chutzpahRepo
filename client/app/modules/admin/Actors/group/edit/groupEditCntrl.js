(function () {

    "use strict";

    var controllerId = 'GroupEditCntrl';
    angular
        .module('app.modules.actors')
        .controller(controllerId, GroupEditCntrl);

    GroupEditCntrl.$inject = ['$stateParams', 'common', 'actorService', 'groupService', 'groupMemberService', 'securityPermissionService', 'entity'];

    function GroupEditCntrl($stateParams, common, actorService, groupService, groupMemberService, securityPermissionService, entity) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.deleteGroupMember = deleteGroupMember;
        vm.save = save;
        vm.saveMember = saveMember;

        vm.title = 'Group Edit';
        vm.group = entity;
        vm.activeOptions = [
            { name: "Active", value: true },
            { name: "In-Active", value: false },
        ];
        vm.actor ={
            type: 'User',
            options: []
        };
        vm.newMember = {
            groupId: 0,
            actor: {}
        };

        vm.security = {
            allowComments: false,
            allowFileContainer: false,
            allowFollowers: false,
            allowMetaDataEdit: false,
            allowReviews: false,
            allowSecurity: false,
            allowMemberUpdate:false
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
            getActors();

            var promises = [getFeatureOptions(entity.classType), getClearedFeatures(entity.compositeKey)];
            common.activateController(promises, controllerId)
                .then(function () {
                    if (entity.id != 0) {
                        vm.security = groupService.getFeatureSecurity(vm.options);
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

        function deleteGroupMember(groupMember) {
            groupMemberService.remove(groupMember.id).then(function (result) {
                _.remove(vm.group.members, function (member) {
                    return member.id === groupMember.id;
                });
            });
        }

        function getActors() {
            actorService.getAll().then(function (actors) {
                vm.actor.options = actors;
            });
        }


        function getClearedFeatures(compositeKey) {
            return securityPermissionService.getClearedFeatures(compositeKey).then(function (features) {
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

        function save(group) {
            if (typeof group.id !== 'undefined' && group.id > 0) {
                return groupService.updateGroup(group).then(function (result) {
                    logSuccess("Group Updated.");
                });
            } else {
                return groupService.createGroup(group).then(function (group) {
                    vm.group = group;
                    logSuccess("Group created.");
                    groupService.goToDetail(group.id)
                });
            }
        }

        function saveMember(group, member) {
            if (angular.isDefined(group) && group.id > 0) {
                member.groupId = group.id;
                return groupMemberService.create(member).then(function (result) {
                    vm.group.members.push(result);
                });
            } else {
                logError("No group reference found.");
            }
        }
    }
})();

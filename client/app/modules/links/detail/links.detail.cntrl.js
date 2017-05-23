(function (){
    "use strict";

    var controllerId = 'LinkDetailCntrl';
    angular
        .module('app.modules.links')
        .controller(controllerId, LinkDetailCntrl);

    LinkDetailCntrl.$inject = ['$stateParams', 'common', 'actorService', 'linkService', 'linkCategoryService', 'securityPermissionService', 'securityService'];

    function LinkDetailCntrl($stateParams, common, actorService, linkService, linkCategoryService, securityPermissionService, securityService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.goToList = goToList;
        vm.save = save;

        vm.owner = {
            options: []
        };
        vm.link = {};
        vm.categories = [];
        vm.newLink = {};
        vm.title = 'Link Detail';
        vm.state = {
            isLoading: false,
            loadingMsg: 'Default loading msg',
            saveBtnText:"Save"
        };


        activate();
        function activate() {
            getLinkCategories();

            var linkId = parseInt($stateParams.id);
            if (linkId !== 0) {
                getLink(linkId);
            } else {
                securityService.getLoggedInUser().then(function (owner){
                    vm.link.owner = owner;
                });
            }
        }

        function getLink(id) {
            vm.state.isLoading = true;
            vm.state.loadingMsg = "Getting the link data from the server...";
            return linkService.getById(id).then(function (link) {
                vm.link = link;
                vm.state.isLoading = false;
            }, function (errorResponse) {
                vm.state.isLoading = false;
            });
        }

        function getLinkCategories(id) {
            return linkCategoryService.getAll().then(function (statuses) {
                vm.categories = statuses;
            });
        }

        function goToList() {
            linkService.goToList();
        }

        function save(link) {
            if (vm.state.isLoading !== true) {
                vm.state.isLoading = true;
                link = formatTags(link);
                if (typeof link.id !== 'undefined' && link.id > 0) {
                    vm.state.loadingMsg = "Updating the link data on the server...";
                    vm.state.saveBtnText = "Updating...";
                    return linkService.update(link).then(function (result) {
                        logSuccess("Link Updated.");
                        resetState();
                    }, function (errorResponse) {
                        resetState();
                    });
                } else {
                    vm.state.loadingMsg = "Creating the link on the server...";
                    vm.state.saveBtnText = "Saving...";
                    return linkService.create(link).then(function (result) {
                        vm.link = result;
                        logSuccess("Link created.");
                        resetState();
                    }, function (errorResponse) {
                        resetState();
                    });;
                }
            }
        }

        function resetState() {
            vm.state.isLoading = false;
            vm.state.saveBtnText = "Save";
        }

        function formatTags(link) {
            if (angular.isDefined(link.tags) && link.tags != null && link.tags.length > 0) {
                _.map(link.tags, function (tag) {
                    tag.entityCompositeKey = link.compositeKey;
                    tag.entityClassType = link.classType;
                });
            }
            return link;
        }
    }
})();

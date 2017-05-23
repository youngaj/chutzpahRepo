
(function () {
    "use strict";


    angular
        .module('app.components.followers')
        .controller('FollowerListCntrl', FollowerListCntrl);

    FollowerListCntrl.$inject = ['$scope', '$filter', 'common', 'followerService', 'actorService'];
    function FollowerListCntrl($scope, $filter, common, followerService, actorService) {
        var controllerId = 'FollowerListCntrl';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var actorCache = [];
        var pageSize = 30;

        var vm = this;
        vm.followers = [];
        vm.filteredActors = [];
        vm.actorTypes = [
            { name: 'All Actor Types', isFilter: false },
            { name: 'Group', isFilter: true },
            { name: 'Role', isFilter: true },
            { name: 'User', isFilter: true },
        ];
        vm.state = {
            actorFilter: "",
            displayButtonArea: false,
            alreadyFollowing: false,
            isChangedDetected: false,
            isLoading: false,
            page: 1,
            pages: []
        };


        vm.executeAction = executeAction;
        vm.follow = follow;
        vm.getFollowers = getFollowers;
        vm.getActors = getActors;
        vm.clearActors = clearActors;
        vm.saveChanges = saveChanges;
        vm.remove = remove;
        vm.selectActor = selectActor;
        vm.setPage = setPage;
        vm.updateButtonDisplay = updateButtonDisplay;

        vm.filterActors = filterActors;
        vm.selectedActorType = vm.actorTypes[3];

        var origFollowers = [];
        activate();

        if (vm.preload === true) {
            vm.state.isLoading = true;
            $scope.$watch('vm.initialData', function (newValue, oldValue) {
                if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                    loadInitialData(newValue);
                }
            });
        }

        $scope.$on("Item_Selected", function (event, compositeKey) {
            vm.entityCompositeKey = compositeKey;
        })

        $scope.$watch('vm.entityCompositeKey', function (newValue, oldValue) {
            if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                if (newValue != oldValue) {
                    activate();
                    console.log("Follower List Directive Triggered", newValue);
                }
            }
        });

        $scope.$watch('vm.action', function (newValue, oldValue) {
            if (angular.isDefined(newValue) || newValue != null) {
                vm.executeAction(newValue);
                vm.action = null;
            }
        });

        $scope.$watch('vm.allowEdit', function (newValue, oldValue) {
            if (angular.isDefined(newValue) || newValue != null) {
                vm.allowEdit = newValue;
                vm.updateButtonDisplay();
                console.log("Follower list AllowEdit", newValue);
            }
        });

        function activate() {
            if (vm.preload !== true) {
                var promises = [getFollowers()];
                common.activateController(promises, controllerId)
                    .then(function () {
                        origFollowers = angular.copy(vm.followers);
                        setIsAlreadyFollowing(vm.entityCompositeKe, vm.followers);
                    });
            }
        }

        function addFollower(actor) {
            var follower = findFollower(actor);
            if (angular.isDefined(follower) == false) {
                follower = createFollower(actor);
                vm.followers.push(follower);
                changeDetection();
                actor.isSelected = !actor.isSelected;
            }
        }

        function changeDetection() {
            if (vm.followers.length != origFollowers.length) {
                vm.state.isChangedDetected = true;
            } else {
                var origFollowerKeys = [];
                var currentKeys = [];

                _.map(origFollowers, function (curr) {
                    origFollowerKeys.push(curr.actor.compositeKey);
                });
                _.map(vm.followers, function (curr) {
                    currentKeys.push(curr.actor.compositeKey);
                });
                var diff = _.difference(currentKeys, origFollowerKeys);
                if (diff.length > 0) {
                    vm.state.isChangedDetected = true;
                } else {
                    vm.state.isChangedDetected = false;

                }
            }
        }

        function createFollower(actor) {
            var follower = {};
            follower.id = 0;
            follower.entityCompositeKey = getEntityKey();
            follower.actor = actor;
            return follower;
        }

        function clearActors() {
            vm.filteredActors = [];
            setPageNumbers(vm.filteredActors);
        }

        function findFollower(actor) {
            return _.find(vm.followers, { 'actor.compositeKey': actor.compositeKey });
        }

        function executeAction(action) {
            if(action === 'submit'){
                saveChanges();
            }
        }

        function follow() {
            var entityCompositeKey = vm.entityCompositeKey;
            return followerService.followEntity(entityCompositeKey).then(function (follower) {
                vm.followers.push(follower);
                vm.state.alreadyFollowing = true;
                updateButtonDisplay();
                changeDetection();
                return;
            });
        }

        function getActors() {
            if (actorCache != null && actorCache.length > 0) {
                vm.selectedActorType = vm.actorTypes[3];
                filterActors();
                return $q.when(actorCache);
            }

            return actorService.getAll().then(function (actors) {
                markSelectedActors(actors);
                actorCache = actors;
                vm.selectedActorType = vm.actorTypes[3];
                filterActors();
                setPageNumbers(actors);
                return actors;
            });
        }

        function setPageNumbers(actors) {
            var count = actors.length;
            var page = 1;
            var pageNumbers = [];
            while (count > 0) {
                pageNumbers.push(page);
                page++;
                count = count - pageSize;
            }
            vm.state.pages = pageNumbers;
        }

        //TODO: look into a more efficient way of doing this
        function markSelectedActors(actors) {
            for (var i = 0; i < vm.followers.length; i++) {
                for (var j = 0; j < actors.length; j++) {
                    var follower = vm.followers[i];
                    var actor = actors[j];
                    if (follower.actor.compositeKey === actor.compositeKey) {
                        actor.isSelected = true;
                        break;
                    }
                }
            }
            return actors;
        }

        function getEntityKey() {
            return vm.entityCompositeKey;
        }

        function getFollowers() {
            vm.state.isLoading = true;
            var entityCompositeKey = getEntityKey();
            if (angular.isDefined(entityCompositeKey) && entityCompositeKey != null) {
                return followerService.getAllByEntity(entityCompositeKey).then(function (followers) {
                    vm.state.isLoading = false;
                    vm.followers = followers;
                    return followers;
                });
            }
            else {
                return $q.when();
            }
        }

        function getOrCreateFollower(actor) {
            var follower = findFollower(actor);
            if (_.isUndefined(follower)) {
                follower = createFollower(actor);
            }
            return follower;
        }

        function getFollower(key) {
            return _.find(vm.followers, { 'actor.compositeKey': key });
        }

        function saveChanges() {
            vm.state.isLoading = true;
            return followerService.saveMultiple(getEntityKey(), vm.entityReference, vm.followers)
                .then(function (followers) {
                    vm.state.isLoading = false;
                    vm.followers = followers;
                    origFollowers = angular.copy(followers);
                    clearActors();
                    logSuccess(followers.length + " followers saved");
                    updateButtonDisplay();
                }, function (error) {
                    logError(error);
                    vm.state.isLoading = false;
                });
        }

        function selectActor(actor) {
            if (actor.isSelected) {
                removeFollower(actor);
            } else {
                addFollower(actor);
            }
        }

        function remove(follower) {
            if(angular.isDefined(follower.id) === true && follower.id > 0){
                return followerService.remove(follower.id).then(function (result) {
                    removeFollower(follower.actor);
                    setIsAlreadyFollowing(vm.entityCompositeKe, vm.followers);
                    return;
                });
            } else {
                //-- local remove
                removeFollower(follower.actor);
            }
        }

        function removeFollower(actor) {
            _.remove(vm.followers, function (follower) { return follower.actor.compositeKey == actor.compositeKey; });
            actor.isSelected = !actor.isSelected;
            changeDetection();
        }

        function reset() {
            vm.followers = origFollowers;
        }

        function setIsAlreadyFollowing(entityCompositeKey, followers) {
            return followerService.isFollowing(entityCompositeKey, followers)
                        .then(function (result) {
                            vm.state.alreadyFollowing = result;
                            updateButtonDisplay();
                            return;
                        });
        }

        function updateButtonDisplay() {
            if (vm.state.alreadyFollowing === false || vm.allowEdit == true)
                vm.state.displayButtonArea = true;
        }

        //--- functions to handle actor selection and filtering
        function filterActors() {
            var filteredActors = actorCache;

            filteredActors = applyTypeFilter(filteredActors);
            filteredActors = applyTextFilter(filteredActors);
            filteredActors = applyPagination(filteredActors);
            vm.filteredActors = filteredActors;
        }

        function applyTextFilter(filteredActors) {
            if (vm.state.actorFilter != "") {
                filteredActors = $filter('filter')(filteredActors, vm.state.actorFilter);
            }
            return filteredActors;
        }

        function applyPagination(filteredActors) {
            setPageNumbers(filteredActors);
            if(filterActors.length > pageSize)
                filteredActors = _.take(_.rest(filteredActors, (vm.state.page - 1) * pageSize), pageSize);
            return filteredActors;
        }

        function applyTypeFilter(filteredActors) {
            var type = vm.selectedActorType;
            if (angular.isDefined(type) && type != null) {
                if (type.isFilter) {
                    vm.state.page = 1;
                    filteredActors = _.filter(actorCache, { 'classType': type.name });
                }
            }
            return filteredActors;
        }

        function setPage(page) {
            vm.state.page = page;
            var type = vm.selectedActorType;
            var filteredActors = _.filter(actorCache, { 'classType': type.name });
            if(filteredActors.length > pageSize)
                filteredActors = _.take(_.rest(filteredActors, (vm.state.page - 1) * pageSize), pageSize);
            vm.filteredActors = filteredActors;
        }

        function loadInitialData(data) {
            vm.followers = data.followers;
            vm.users = _.filter(data.actors, function (actor) { return actor.classType === 'User' });;
            vm.state.isLoading = false;
            return;
        }
    }
})();


(function (){

    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .controller('VirtualFolderWizardCtrl', VirtualFolderWizardCtrl)

    VirtualFolderWizardCtrl.$inject = ['$scope', 'common', 'virtualFolderService', 'fileContainerService', 'notificationService', 'entity', 'statusList', 'actors'];
    function VirtualFolderWizardCtrl($scope, common, virtualFolderService, fileContainerService, notificationService, entity, statusList, actors) {

        var vm = this;

        vm.displayUploadStep = false;
        vm.wizard2CompleteCallback = wizard2CompleteCallback;
        vm.wizardStepChangingCallBack = wizardStepChangingCallBack;
        vm.wizardStepCallBack = wizardStepCallBack;
        vm.dropZoneDisplayed = false;
        vm.statuses = statusList;
        vm.selectedNode = entity;
        vm.users = [];
        vm.state = {
            allowEdit: true,
            isLoading: false,
            loadingMsg:'Processing...'
        };
        vm.options = {
            availableFeatures: []
        };

        vm.parent = null;
        var controllerId = 'VirtualFolderWizardCtrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        activate();

        $scope.$on("progressUpdate", function (event, progressUpdate) {
            if (vm.state.isLoading) {
                var msg = progressUpdate.percentageComplete + "% complete. " + progressUpdate.msg;
                setProcessingState(msg);
            }
        })

        function activate() {
            setUsers();
            var promises = [getFeatureOptions()];
            common.activateController(promises, controllerId)
                .then(function () {
                    vm.displayUploadStep = virtualFolderService.isFileUploadType(entity.classType);
                    vm.selectedNode.status = getDefaultStatus(statusList);
                });
        }

        //TODO: Move this to the service
        function getDefaultStatus(statuses) {
            var defaultStatus = _.find(statuses, function (status) {
                return status.isDefault === true;
            });

            if (defaultStatus === null) {
                defaultStatus = _.find(statuses, function (status) {
                    return status.name === "New";
                });
            }
            return defaultStatus;
        }

        function getFeatureOptions() {
            virtualFolderService.getSecurityPermissionOptions(entity).then(function (availableFeatures) {
                vm.options.availableFeatures = availableFeatures;
            });
        }

        function setUsers() {
            var getName = _.property('name');
            var users = _.filter(actors, { 'classType': 'User' });
            users = _.sortBy(users, getName);
            vm.users = users;
        }

        function submitEntry() {
            var obj = vm.selectedNode;
            virtualFolderService.save(obj).then(function (data) {
                //send files
                //save security
                //save notification list
            });

        }

        function wizardStepCallBack(e, data) {
            //if (data.step === 2 && vm.displayUploadStep === true) {
            //    vm.dropZoneAction = "create";
            //}
            //if (data.step === 3) {
            //}
        }


        function wizardStepChangingCallBack(e, data) {
            if (data.step === 1) {
                setProcessingState("Please hold while we prepare your virtual object reference...");
                var newItem = true;
                if (angular.isDefined(vm.selectedNode.id) && vm.selectedNode.id > 0)
                    newItem = false;

                var validationResult = virtualFolderService.validate(vm.selectedNode);
                if (validationResult.isSuccessful === true) {
                    virtualFolderService.save(vm.selectedNode)
                        .then(function (virtualObj) {
                            logSuccess("Virtual item saved");
                            vm.selectedNode = virtualObj;
                            vm.selectedNode.compositeKey = virtualObj.compositeKey;
                            if (newItem) {
                                common.$broadcast("New_VirtualObj", virtualObj);
                                vm.dropZoneAction = "create";
                            } else {
                                common.$broadcast("Update_VirtualObj", virtualObj);
                            }
                            resetProcessingState();
                        },
                        function (error) {
                            resetProcessingState();
                            logError("Virtual item save failed. " + error);
                            data.step = 0;
                        });

                } else {
                    var msg = validationResult.msgs.join()
                    logError("Virtual item validation failed. " + msg, validationResult);
                    e.preventDefault();
                }
            }

            if (data.step === 2) {
                vm.dropZoneAction = "submit";
            }
        };

        function resetProcessingState() {
            vm.state.isLoading = false;
            vm.state.loadingMsg = "Loading..."
        }

        function setProcessingState(msg) {
            vm.state.isLoading = true;
            if (angular.isDefined(msg) && msg != '') {
                vm.state.loadingMsg = msg;
            }
        }

        function wizard2CompleteCallback(wizardData) {
            console.log('wizard2CompleteCallback', wizardData);
            $.smallBox({
                title: "Congratulations! Virtual item wizard finished",
                content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
                color: "#5F895F",
                iconSmall: "fa fa-check bounce animated",
                timeout: 4000
            });
            var obj = vm.selectedNode;
            virtualFolderService.navigateToEdit(obj.id, obj.classType).then(function (url) {
                sendNotification(obj, url);
            });
        };


        function sendNotification(obj, url) {
            var entityCompositeKey = obj.compositeKey;
            var subject = "Virtual Folders Notification";
            var body = "New " +obj.classType+":" +obj.name+" created.  <br/><br/>  <p>You can view this item here. <a href='"+url+"'>here</a></p>";
            notificationService.sendMessageToFollowers(entityCompositeKey, subject, body, url);
        }
    }
})();

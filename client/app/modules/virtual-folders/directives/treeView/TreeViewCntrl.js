(function () {
    "use strict";

    angular
        .module('app.modules.virtualFolders')
        .controller('TreeViewCntrl', TreeViewCntrl);

    TreeViewCntrl.$inject = ['$scope', 'common', 'virtualFolderService', 'entityGraphService', 'fileContainerService', 'bulkImportService', '$uibModal'];

    function TreeViewCntrl($scope, common, virtualFolderService, entityGraphService, fileContainerService, bulkImportService, $uibModal) {
        /* jshint validthis:true */

        var controllerId = 'TreeViewCntrl';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);
        var $q = common.$q;

        var vm = this;
        var allObjs = [];
        var treeNodes = [];
        var treeLoaded = false;
        var hiddenNodes = [];

        vm.title = 'treeView Controller';
        vm.updateNode = updateNode;

        activate();

        var expandTarget = null;

        $scope.$on("New_VirtualObj", function (event, newItem) {
            var newNode = createNode(newItem);
            var jsTree = $("#jstree_virtualFolders").jstree(true);
            var parentNode = jsTree.get_node(newNode.parent);
            if (parentNode.id === "#") {
                addNodeToTree(newNode, "#");
            } else {
                jsTree.open_node(parentNode, function () {
                    addNodeToTree(newNode, parentNode);
                });
            }
        });

        $scope.$on("Update_VirtualObj", function (event, item) {
            var tree = $("#jstree_virtualFolders").jstree(true);
            var node = tree.get_node(item.id);
            tree.rename_node(node, item.name);
        })

        $scope.$on("ExpandPathTo", function (event, vObj) {
            var tree = $("#jstree_virtualFolders").jstree(true);
            if (treeLoaded === true) {
                expandPathTo(vObj);
            } else {
                expandTarget = vObj;
            }
        })

        $scope.$on("container_updated", function (event, containerId) {
            if (angular.isDefined(containerId)) {
                fileContainerService.getFileContainerById(containerId).then(function (container) {
                    //get the virtual obj for this container
                    var compositeKey = container.parentCompositeKey;
                    virtualFolderService.getByCompositeKey(compositeKey).then(function (vObj) {
                        var tree = $("#jstree_virtualFolders").jstree(true);
                        var node = tree.get_node(vObj.id);
                        tree.refresh_node(node);
                    })
                });

            }
        });

        $scope.$watch('vm.showArchived', function (newValue, oldValue) {
            if (angular.isDefined(newValue) || angular.isDefined(oldValue)) {
                var jsTree = $("#jstree_virtualFolders").jstree(true);
                var root = jsTree.get_node("#");
                if (newValue === true) {
                    showArchivedItems(null, root);
                } else {
                    hideArchivedItems(null, root);
                }
            }
        });

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    buildJsTree();
                });
        }

        function addNodeToTree(newNode, parentNode) {
            if (parentNode === null || parentNode.id === "#") {
                parentNode = "#";
            }
            var jsTree = $("#jstree_virtualFolders").jstree(true);
            jsTree.deselect_all();
            var node = jsTree.get_node(newNode.id);
            if (node === false) {
                var id = jsTree.create_node(parentNode, newNode, "last", function () { });
                jsTree.deselect_all();
                selectNode(id);
            } else {
                selectNode(node.id);
            }
        }

        function getJSTreeNode(node) {
            return $("#jstree_virtualFolders").jstree(true).get_node(node);
        }

        function buildJsTree() {
            $('#jstree_virtualFolders')
                .on('changed.jstree', function (e, data) {
                    var i, j =[];
                    for (i = 0, j = data.selected.length; i < j; i++) {
                        var selectedNode = data.instance.get_node(data.selected[i]);
                        var entity = getNodeEntity(selectedNode);
                        if (entity.classType === "SymphonyFile") {
                            selectedNode = getJSTreeNode(selectedNode.parent);
                            entity = getNodeEntity(selectedNode);
                        } else {
                            if (selectedNode.state.opened === false) {
                                $("#jstree_virtualFolders").jstree(true).open_node(selectedNode);
                            }
                        }
                        returnSelectedNode(entity);
                    }
                })
                .on('delete_node.jstree', function (node, parent) {
                    $("#jstree_virtualFolders").jstree(true).select_node(parent);
                })
                .on('move_node.jstree', function (event, data) {
                   var node = data.node;
                   var newParent = getJSTreeNode(data.parent);
                   var newPosition = data.position;
                   moveTemplateItem(node, newParent, newPosition).then(function(moveResult) {
                       if (moveResult === false) {
                           log("Rolling back changes");
                           oldParent = getJSTreeNode(data.old_parent);
                           $("#jstree_virtualFolders").jstree(true).refresh_node(newParent);
                           $("#jstree_virtualFolders").jstree(true).refresh_node(oldParent);
                        }
                   });
                })
                .on('loaded.jstree', function (event, data) {
                    if (expandTarget != null) {
                        expandPathTo(expandTarget);
                        expandTarget = null;
                    }
                    treeLoaded = true;
                })
                .jstree({
                    //"plugins": ["dnd", "sort", "types", "search", "state", "contextmenu"],
                    "plugins": ["dnd", "sort", "types", "search", "contextmenu"],
                    "types": {
                        "default": {
                        },
                        "VirtualTree": {
                            "icon": "glyphicon glyphicon-tree-deciduous green"
                        },
                        "VirtualSharedFile": {
                            "icon": "glyphicon glyphicon-file blue"
                        }
                    },
                    'core': {
                        'data': function (obj, cb) {
                            getTreeData(obj).then(function (nodes) {
                                cb.call(this, nodes);
                                obj.state.opened = true;
                            });
                        },
                        'check_callback': function (operation, node, node_parent, node_position, more) {
                            // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                            // in case of 'rename_node' node_position is filled with the new node name
                            return true;  //allow all operations
                        }

                    },
                    "dnd": {
                        check_while_dragging: false,
                        always_copy: false
                    },
                    "contextmenu": {
                        "select_node": false,
                        "items": function ($node) {
                            var tree = $("#jstree_virtualFolders").jstree(true);
                            //todo: change this to a function so we can control which value show given the $node
                            var menu = getContextMenu($node);
                            return menu;
                        }
                    },
                    "sort": function (a, b) {
                        var result = 1;
                        var entityA = this.get_node(a).data;
                        var entityB = this.get_node(b).data;
                        if (entityA.position != entityB.position) {
                            result = entityA.position > entityB.position ? 1: -1;
                        } else {
                            result = entityA.name > entityB.name ? 1: -1;
                        }
                        return result;
                    }
                });

        }

        function convertEntitesToNodes(entities) {
            var nodes = [];
            var currNode = {};

            var entity = {};
            if (angular.isDefined(entities) && entities != null) {
                _.map(entities, function (entity) {
                    currNode = createNode(entity);
                    nodes.push(currNode);
                });
            }
            return nodes;
        }

        function createNode(entity) {
            var node = {};
            if (entity != null) {
                var parent = '#';
                if (entity.parent !== null) {
                    parent = entity.parent.id;
                }
                if (parent === "#" && angular.isDefined(entity.parentId) && entity.parentId !== null) {
                    parent = entity.parentId;
                }

                node = {
                    'id': entity.id,
                    'parent': parent,
                    'text': entity.name,
                    'state': { 'opened': false, 'selected': false },
                    'entity': entity,
                    'data': entity,
                    'children': true,

                }
                node = setNodeIcon(node, entity);

            }
            return node;
        }

        function expandPathTo(vObj) {
            if (angular.isDefined(vObj) && angular.isDefined(vObj.compositeKey)) {
                entityGraphService.getParentPath(vObj.compositeKey).then(function (parentPath) {
                    parentPath.reverse();
                    parentPath = _.rest(parentPath); //-- remove system reference
                    var ids = _.pluck(parentPath, 'id');
                    expandNodes(ids);
                }, function (errorResponse) {
                    logError("Error retrieving the parentPath", errorResponse);
                });
            } else {
                logError("Event raised but object not in correct state", vObj);
            }
        }

        function expandNodes(parentIds) {
            if (_.isUndefined(parentIds) === false && parentIds.length > 0) {
                var nodeId = _.first(parentIds);
                if (parentIds.length > 1) {
                    var remainingIds = _.rest(parentIds);
                    var node = getJSTreeNode(nodeId);
                    $("#jstree_virtualFolders").jstree(true).open_node(node, function () {
                        expandNodes(remainingIds);
                    });

                } else {

                    silentlySelectNode(nodeId);
                }
            }
        }

        function getContextMenu(node) {
            var entity = getNodeEntity(node);
            var type = entity.classType;
            var menu = {};



            var folder = getMenuOption("Insert Folder", "glyphicon glyphicon-folder-open", function (obj) {
                virtualFolderService.navigateToWizard(entity.id, "VirtualFolder");
            });

            var sharedFile = getMenuOption("Insert Shared File", "glyphicon glyphicon-file", function (obj) {
                virtualFolderService.navigateToWizard(entity.id, "VirtualSharedFile");
            });

            var photo = getMenuOption("Insert Photo", "glyphicon glyphicon-picture", function (obj) {
                virtualFolderService.navigateToWizard(entity.id, "VirtualPhoto");
            });

            var libraryRef = getMenuOption("Insert Library Reference", "glyphicon glyphicon-book", function (obj) {
                virtualFolderService.navigateToWizard(entity.id, "VirtualLibraryDoc");
            });

            var link = getMenuOption("Insert External Link", "glyphicon glyphicon-link", function (obj) {
                virtualFolderService.navigateToWizard(entity.id, "VirtualLink");
            });

            var bulkInsert = getMenuOption("Bulk Import", "glyphicon glyphicon-cloud-upload", function (obj) {
                openBulkImportWindow(entity, node);
            });

            var showArchived = getMenuOption("Show Archived Items", "glyphicon glyphicon-adjust", function (obj) {
                showArchivedItems(entity.compositeKey, node)
            });

            var hideArchived = getMenuOption("Hide Archived Items", "glyphicon glyphicon-adjust", function (obj) {
                hideArchivedItems(entity.compositeKey, node)
            });

            switch (type) {
                case "VirtualTree":
                    menu["Insert Folder"] = folder;
                    menu["Bulk Insert"] = bulkInsert;
                    if (node.showArchived)
                        menu["Hide Archived"] = hideArchived;
                    else
                        menu["Show Archived"] = showArchived;
                    break;

                case "VirtualFolder":
                    menu["Insert Folder"] = folder;
                    menu["Insert Shared File"] = sharedFile;
                    menu["Insert Photo"] = photo;
                    menu["Insert Library Reference"] = libraryRef;
                    menu["Insert External Link"] = link;
                    menu["Bulk Insert"] = bulkInsert;
                    if (node.showArchived)
                        menu["Hide Archived"] = hideArchived;
                    else
                        menu["Show Archived"] = showArchived;
                    break;
            }

            //-- common menu options
            menu["Remove"] = getMenuOption("Delete", "glyphicon glyphicon-trash", function (obj) {
                var entity = getNodeEntity(node);
                if (entity.classType == "SymphonyFile") {
                    fileContainerService.removeFile(entity.id).then(function (response) {
                        $("#jstree_virtualFolders").jstree(true).delete_node(node);
                        common.$broadcast("container_updated", entity.containerId);
                        logSuccess(entity.name + " deleted.");
                    }).catch(function (errorResponse) { logError("File removal failed"); });
                }
                else{
                    virtualFolderService.remove(entity.classType, entity.id).then(function (result) {
                        $("#jstree_virtualFolders").jstree(true).delete_node(node);
                        logSuccess(entity.name + " deleted.");
                    }, function (errorResponse) {
                        logError("Removal failed");
                    });
                }
            });
            menu["Refresh"] = getMenuOption("Refresh", "glyphicon glyphicon-refresh", function (obj) {
                $("#jstree_virtualFolders").jstree(true).refresh_node(node);
            });
            menu["Download"] = getMenuOption("Download", "glyphicon glyphicon-cloud-download", function (obj) {
                var entity = getNodeEntity(node);
                if (entity.classType === "SymphonyFile") {
                    fileContainerService.downloadSymphonyFile(entity);
                } else {
                    virtualFolderService.download(entity);
                }
            });
            return menu;
        }

        function showArchivedItems(entityCompositeKey, parentNode) {
            parentNode.showArchived = true;
            var position = 'inside';
            var hiddenChildren = _.filter(hiddenNodes, function (hiddenEntity) {
                if (hiddenEntity.parent == null)
                    return entityCompositeKey === hiddenEntity.parent;
                return entityCompositeKey === hiddenEntity.parent.compositeKey;
            });
            var nodes = convertEntitesToNodes(hiddenChildren);
            var jsTree = $("#jstree_virtualFolders").jstree(true);
            _.map(nodes, function (newNode) {
                jsTree.create_node(parentNode, newNode, position, function () { });
            });
        }

        function hideArchivedItems(entityCompositeKey, parentNode) {
            parentNode.showArchived = false;
            var hiddenChildren = _.filter(hiddenNodes, function (hiddenEntity) {
                if (hiddenEntity.parent == null)
                    return entityCompositeKey === hiddenEntity.parent;
                return entityCompositeKey === hiddenEntity.parent.compositeKey;
            });
            if (hiddenChildren != null) {

                var jsTree = $("#jstree_virtualFolders").jstree(true);
                var childrenIds = parentNode.children;
                var children = _.map(childrenIds, function (childId) {
                    return jsTree.get_node(childId);
                });
                _.map(hiddenChildren, function (hiddenChild) {
                    var childNode = _.find(children, function (child) {
                        var childEntity = child.data;
                        return hiddenChild.compositeKey === childEntity.compositeKey;
                    });
                    if(angular.isDefined(childNode)){
                        jsTree.delete_node(childNode);
                    }
                });

            }
        }

        function openBulkImportWindow(entity, node) {
            var title = "Bulk Import Window";
            var msg = "This will enable you to bulk import folders/files from the server.";
            var okText = "Import";
            var cancelText = "Cancel";

            var modalOptions = {
                templateUrl: 'app/modules/virtual-folders/directives/treeView/bulkImport.tpl.html',
                controller: bulkImportController,
                keyboard: true,
                animation: false,
                resolve: {
                    entity: entity,
                    node:node,
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText
                        };
                    }
                }
            };
            return $uibModal.open(modalOptions).result;
        }

        var bulkImportController = ['$scope', 'entity', 'node', 'options', 'bulkImportService', 'userService',
        function ($scope, entity, node, options, bulkImportService, userService) {

            $scope.title = options.title || 'Title';
            $scope.message = options.message || '';
            $scope.okText = options.okText || 'OK';
            $scope.cancelText = options.cancelText || 'Cancel';
            $scope.ok = startMigration;
            $scope.cancel = function () { $scope.$dismiss('cancel'); };
            $scope.entity = entity;
            $scope.availableFolders = [];
            $scope.users = [];
            $scope.state = {
                inProgress: false,
                progressBanner: {
                    percentageComplete:0,
                    msg:"Contacting the server...",
                }
            };

            $scope.$on("progressUpdate", function (event, progressUpdate) {
                $scope.state.progressBanner.percentageComplete = progressUpdate.percentageComplete;
                $scope.state.progressBanner.msg = progressUpdate.percentageComplete + "% complete. " + progressUpdate.msg;
            });

            activate();
            function activate(){
                bulkImportService.getFolders().then(function (folders) {
                    $scope.availableFolders = folders;
                });

                userService.getAll().then(function (users) {
                    $scope.users = users;
                });
            }

            function startMigration() {
                if ($scope.state.inProgress === false) {
                    $scope.state.inProgress = true;
                    $scope.okText = "Import in Progress...";
                    bulkImportService.importFolder($scope.importfolder, $scope.owner, entity).then(function (result) {
                        $("#jstree_virtualFolders").jstree(true).refresh_node(node);
                        logSuccess("Import successful");
                        $scope.state.inProgress = false;
                        $scope.$close('ok');
                    }, function (errorResponse) {
                        logError("Error trying to import.");
                        $scope.state.inProgress = false;
                    });
                }
                else
                {
                    log("Import already in progress.");
                }
            }
        }];


        function getMenuOption(title, icon, action) {
            var option = {
                "separator_before": false,
                "separator_after": false,
                "label": title,
                "action": action,
                "icon" : icon
            };
            return option;
        }

        function selectNode(nodeId) {
            var node = getJSTreeNode(nodeId);
            var entity = getNodeEntity(node);
            if (entity.classType === "SymphonyFile") {
                node = getNodeEntity(node.parent);
            }
            $("#jstree_virtualFolders").jstree(true).select_node(node, true);
        }

        function silentlySelectNode(nodeId) {
            var node = getJSTreeNode(nodeId);
            $("#jstree_virtualFolders").jstree(true).select_node(node, false);
        }

        function getChildren(parentId) {
            return virtualFolderService.getChildren(parentId).then(function (data) {
                return data;
            });
        }

        function getNodeEntity(node) {
            return node.data;
        }

        function setNodeIcon(node, entity) {
            node.icon = "glyphicon glyphicon-book";
            if (entity.classType == "VirtualSharedFile") {
                node.icon = "glyphicon glyphicon-folder-close white";
                node.children = true;
            }
            if (entity.classType == "SymphonyFile") {
                node.icon = "glyphicon glyphicon-file green";
                node.children = false;
            }
            if (entity.classType == "VirtualTree") {
                node.icon = "glyphicon glyphicon-tree-deciduous green";
            }
            if (entity.classType == "VirtualFolder") {
                node.icon = "glyphicon glyphicon-folder-close yellow";
            }
            if (entity.classType == "VirutalLibraryDoc") {
                node.icon = "glyphicon glyphicon-book blue";
                node.children = false;
            }
            if (entity.classType == "VirtualLink") {
                node.icon = "glyphicon glyphicon-link blue";
                node.children = false;
            }
            if (entity.classType == "VirtualPhoto") {
                node.icon = "glyphicon glyphicon-picture green";
                node.children = false;
            }
            return node;
        }

        function getSelectedNode(vObj) {
            return virtualFolderService.getFullObj(vObj.classType, vObj.id)
                    .then(function (fullItem) {
                        //fullItem.status = _.find(statusList, { 'id': fullItem.status.id });
                        return fullItem;
                    });
        }

        function getTreeData(obj) {
            var nodes = new Array();
            if (obj.parent == null) {
                return getTrees().then(function (availableTrees) {
                    availableTrees = filterArchived(availableTrees);
                    nodes = convertEntitesToNodes(availableTrees);
                    // make sure only top level items are returned
                    nodes = _.filter(nodes, function (node) {
                        return node.parent === "#";
                    });
                    return nodes;
                })
            }
            else {
                if (obj.data.classType === "VirtualSharedFile") {
                    return fileContainerService.getEntityFiles(obj.data.compositeKey).then(function (files) {
                        files = _.map(files, function (file) {
                            file.name = file.name + " ("+file.state+")";
                            file.parent = obj.parent;
                            return file;
                        });
                        nodes = convertEntitesToNodes(files);
                        if (nodes.length == 0) {
                            obj.children = false;
                        }
                        return nodes;
                    }).catch(function (error) {
                        console.error(error);
                        return [];
                    })
                }
                else {
                    return getChildren(obj.id).then(function (children) {
                        children = filterArchived(children);
                        nodes = convertEntitesToNodes(children);
                        if (nodes.length == 0) {
                            obj.children = false;
                        }
                        return nodes;
                    });
                }
            }
        }

        function filterArchived(entities) {
            var filteredEntities = _.filter(entities, function (entity) {
                var isArchived = entity.status.name !== "Archived";
                if (isArchived === false)
                    hiddenNodes.push(entity);
                return isArchived;
            });
            return filteredEntities;
        }

        function getTrees() {
            return virtualFolderService.getTrees().then(function (data) {
                return data;
            });
        }

        function moveTemplateItem(node, parent, newPosition) {
            var entity = getNodeEntity(node);
            var parentEntity = null;
            if (parent !== '#') {
                parentEntity = parent.data;

            }

            return getSelectedNode(entity).then(function (selectedItem) {
                if (selectedItem !== null) {
                    selectedItem.parent = parentEntity;
                    selectedItem.position = newPosition;
                    return virtualFolderService.save(selectedItem).then(function (result) {
                        logSuccess(entity.name +" moved!");
                        return true;
                    }, function (errorResponse) {
                        //-- handle failure
                        logError(entity.name + " move failed!");
                        return false;
                    });
                } else {
                    return $q.reject(false);
                }
            });
        }

        function returnSelectedNode(entity) {
            common.$broadcast("Item_Selected", entity.compositeKey);
            virtualFolderService.navigateToEdit(entity.id, entity.classType);
        }

        function updateNode(entity) {
            var node = getJSTreeNode(entity.id);
            $("#jstree_virtualFolders").jstree(true).set_text(node, entity.name);
        }
    }

})();

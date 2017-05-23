(function () {

	"use strict";

	var controllerId = 'LinkListCntrl';
	angular
		.module('app.modules.links')
		.controller(controllerId, LinkListCntrl);

	LinkListCntrl.$inject = ['$scope', 'common', 'linkService', 'uiGridConstants'];

	function LinkListCntrl($scope, common, linkService, uiGridConstants) {
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);

		vm.title = 'Links List';
		vm.links = [];

		vm.newLink = newLink;
		vm.goToDetail = goToDetail;
		vm.state = {
			isLoading: false,
			loadingMsg: 'Default loading msg',
		};

		activate();
		function activate() {
			var promises = [];
			common.activateController(promises, controllerId)
				.then(function () {
					getLinks();
				});
		}

		function getLinks() {
			vm.state.isLoading = true;
			vm.state.loadingMsg = "Getting the link data from the server...";
			return linkService.getAll().then(function (data) {
				vm.state.loadingMsg = "Formating link data...";
				_.map(data, function (link) {
					link.formatedTags = _.map(link.tags, 'text').join(', ');
				});
				vm.links = data;
				vm.state.isLoading = false;
			}, function (errorResponse) {
				vm.state.isLoading = false;
				logError("There was a problem retrieving the links from the server");
			});
		}

		function goToDetail(id) {
			vm.state.isLoading = true;
			vm.state.loadingMsg = "Getting the link data from the server...";
			linkService.goToDetail(id);
			vm.state.isLoading = false;
		}

		function newLink() {
			vm.state.isLoading = true;
			vm.state.loadingMsg = "Creating a new link item...";
			linkService.goToDetail(0);
			vm.state.isLoading = false;
		}

		function supplyDefault(entityReference) {
			if (angular.isDefined(entityReference) === false || entityReference === null) {
				entityReference = {
					name:'N/A'
				};
			}
			return entityReference;
		}
	}
})();



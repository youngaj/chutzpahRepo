(function () {

	"use strict";

	var controllerId = 'PhotoGalleryCntrl';
	angular
		.module('app.modules.photos')
		.controller(controllerId, PhotoGalleryCntrl);

	PhotoGalleryCntrl.$inject = ['$scope', 'common', 'photoService'];

	function PhotoGalleryCntrl($scope, common, photoService) {
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);

		vm.photos = [];
		vm.title = 'Photos Gallery';
		vm.actions = [];
        vm.getPage = getPage;
        vm.previewPhoto = previewPhoto;
        vm.download = download;
        vm.selectedPhoto = {};
		vm.morePhotos = true;
        vm.searchText = '';
		var offset = 0;
		var pageSize = 25;

		vm.executeSearch = executeSearch;
		vm.state = {
			isLoading: false,
			loadingMsg: 'Default loading msg',
		};

		activate();
		function activate() {
			var promises = [];
			common.activateController(promises, controllerId)
				.then(function () {
                    //-- get initial content
				    getPage();
				});
		}

		function executeSearch() {
		    offset = 0;
		    vm.photos = [];
			return getPage();
		}

        function getPage() {
		    var originalOffset = offset;
		    var originalPhotos = vm.photos;

            vm.state.isLoading = true;
            return photoService.getPage(vm.searchText, offset, pageSize)
                .then(function (result) {
                    updateDisplayFromResult(result);
                    vm.state.isLoading = false;
                })
                .catch(function (error) {
                    vm.state.isLoading = false;
					logError("Problem executing search");
					vm.photos = originalPhotos;
					offset = originalOffset;
                });
        }

        function previewPhoto(photo) {
            vm.selectedPhoto = photo;
        }

		function updateDisplayFromResult(result) {
		    vm.photos = vm.photos.concat(result.models);
		    var pagination = result.pagination;
		    var msg = pagination.count + " photos returned.";
		    offset = pagination.offset;
		    if (offset === pagination.total) {
		        vm.morePhotos = false;
		    }
		    logSuccess(msg);
		}

		function download(photo) {
            return photoService.download(photo)
                .then(function (response) {
                });
		}

	}
})();



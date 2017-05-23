(function (){
    'use strict';

    var controllerId = 'SearchCntrl';
    angular
        .module('app.modules.search')
        .controller(controllerId, SearchCntrl);

    SearchCntrl.$inject = ['$stateParams', 'common', 'searchService'];

    function SearchCntrl($stateParams, common, searchService) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var debug = getLogFn(controllerId);

        vm.searchText = '';
        vm.searchResponse = {};
        vm.isLoading = false;

        vm.title = 'Search';
        vm.searchOptions = [];
        vm.selectedSearchOption = {};
        vm.setSearchType = setSearchType;
        vm.bulkInsert = bulkInsert;
        vm.loadPage = loadPage;
        vm.search = search;
        vm.searchUser = searchUser;

        vm.isUser = isUser;

        activate();

        function activate() {
            var promises = [];
            var query = $stateParams.q;
            loadSearchOptions();
            common.activateController(promises, controllerId)
                .then(function () {
                    vm.searchText = query;
                    if (angular.isDefined(query) && query !== '' ) {
                        vm.searchText = query;
                        search();
                    }
                });
        }

        function bulkInsert() {
            return searchService.bulkInsert().then(function (results) {
                debug("bulk insert complete")
            }, function (error) {
                logError("Bulk insert failed");
            });
        }

        function isUser(searchItem) {
            return (searchItem.class === 'User');
        }

        function loadPage(page) {
            search(page);
        }

        function loadSearchOptions() {
            var selectedSearchOption = { displayText: "Everything", queryType: "files, links, risks, virtual, user", selected: true };
            vm.searchOptions = [
                selectedSearchOption,
                { displayText: "Links", queryType: "links", selected: false },
                { displayText: "Risks", queryType: "risks", selected: false },
                { displayText: "Users", queryType: "user", selected: false },
                { displayText: "Virtual Objects", queryType: "virtual", selected: false },
            ];
            vm.selectedSearchOption = selectedSearchOption;
        }

        function setSearchType(type) {
            var options = vm.searchOptions;
            for (var i = 0; i < options.length; i++) {
                if (options[i].displayText === type) {
                    options[i].selected = true;
                    vm.selectedSearchOption = options[i];
                } else {
                    options[i].selected = false;
                }
            }
            vm.searchOptions = options;
        }

        function search( page) {
            var text = vm.searchText;
            var pageSize = 100;
            vm.isLoading = true;
            return searchService.search(vm.selectedSearchOption.queryType, text, page).then(function (searchResponse) {
                var total = parseInt(searchResponse.totalFound);
                searchResponse.pageNumbers = [];
                searchResponse.pageNumbers.push(1);
                var pages = Math.ceil(total / pageSize);
                for (var i = 2; i <= pages; i++) {
                    searchResponse.pageNumbers.push(i);
                }
                searchResponse.currentPage = page;
                vm.searchResponse = searchResponse;

                vm.isLoading = false;
            },
            function (error) {
                logError("Something went wrong please try your search again");
                vm.isLoading = false;
            });
        }

        function searchUser() {
            setSearchType("User");
            search();
        }
    }
})();



(function () {

	"use strict";

	var controllerId = 'RiskListCntrl';
	angular
		.module('app.modules.risks')
		.controller(controllerId, RiskListCntrl);

	RiskListCntrl.$inject = ['$scope', 'common', 'riskService', 'uiGridConstants'];

	function RiskListCntrl($scope, common, riskService, uiGridConstants) {
		var vm = this;

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, "error");
		var logSuccess = getLogFn(controllerId, "success");
		var debug = getLogFn(controllerId);

		vm.title = 'Risks List';
		vm.risks = [];

		vm.newRisk = newRisk;
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
					getRisks();
				});
		}

		function getRisks() {
			vm.state.isLoading = true;
			vm.state.loadingMsg = "Getting the risk data from the server...";
			return riskService.getAll().then(function (data) {
				vm.state.loadingMsg = "Formating risk data...";
				_.map(data, function (risk) {
					risk.assignee = supplyDefault(risk.assignee);
					risk.state = supplyDefault(risk.state);
					risk.status = supplyDefault(risk.status);
					risk.type = supplyDefault(risk.type);
					risk.projectNum = risk.project.name + "-" + risk.num;
					risk.formatedTags = _.map(risk.tags, 'text').join(', ');
				});
				vm.risks = data;
				loadDataTable(data);
				vm.state.isLoading = false;
			}, function (errorResponse) {
				vm.state.isLoading = false;
				logError("There was a problem retrieving the risks from the server");
			});
		}

		function goToDetail(id) {
			vm.state.isLoading = true;
			vm.state.loadingMsg = "Getting the risk data from the server...";
			var risk = _.find(vm.risks, function (item) {
				return item.id == id;
			})
			riskService.goToDetail(risk);
			vm.state.isLoading = false;
		}

		function newRisk() {
			vm.state.isLoading = true;
			vm.state.loadingMsg = "Creating a new risk item...";
			riskService.goToDetailById(0);
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

		function loadDataTable(risks) {

			vm.state.loadingMsg = "Formating risks for display";
			var responsiveHelper_dt_risks = undefined;

			var otable = $('#dt_risks').dataTable({
				"aaData": risks,
				"aoColumns": [
						{ "sTitle": "Id", "mData": "id", bVisible: false, bSearchable: true },
						{ "sTitle": "Project-Num", "mData": "projectNum", bSearchable: true },
						{ "sTitle": "Title", "mData": "title", bSearchable: true },
						{ "sTitle": "Given", "mData": "given", bVisible: false, bSearchable: true },
						{ "sTitle": "If Part", "mData": "ifPart", bVisible: false, bSearchable: true },
						{ "sTitle": "Then Part", "mData": "thenPart", bVisible: false, bSearchable: true },
						{ "sTitle": "Mitigation", "mData": "mitigation", bVisible: false, bSearchable: true },
						{ "sTitle": "Closure Statement", "mData": "closureStatement", bVisible: false, bSearchable: true },
						{ "sTitle": "Likelihood Score", "mData": "likelihoodScore", bVisible: false, bSearchable: true },
						{ "sTitle": "Likelihood Rationale", "mData": "likelihood", bVisible: false, bSearchable: true },
						{ "sTitle": "Consequence Score", "mData": "consequenceScore", bVisible: false, bSearchable: true },
						{ "sTitle": "Consequence Rationale", "mData": "consequence", bVisible: false, bSearchable: true },
						{ "sTitle": "Total Risk", "mData": "riskScore", bVisible: false, bSearchable: true },
						{ "sTitle": "Assignee", "mData": "assignee.name", bSearchable: true },
						{ "sTitle": "Status", "mData": "status.name", bSearchable: true },
						{ "sTitle": "State", "mData": "state.name", bVisible: false, bSearchable: true },
						{ "sTitle": "Type", "mData": "type.name", bVisible: false, bSearchable: true },
						{ "sTitle": "Safety", "mData": "isSafety", bVisible: false, bSearchable: true },
						{ "sTitle": "Created", "mData": "dateCreated", bVisible: false, bSearchable: true },
						{ "sTitle": "Updated", "mData": "dateUpdated", bVisible: false, bSearchable: true },
						{ "sTitle": "Tags", "mData": "formatedTags", bVisible: true, bSearchable: true },

				],
				"iDisplayLength": 50,
				"oLanguage": {
					"sSearch": "Search all columns: "
				},
				// Tabletools options:
				//   https://datatables.net/extensions/tabletools/button_options
				"sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6' f> <'col-sm-6 col-xs-12 hidden-xs pull-right' l C T >>" +
						"t" +
						"<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
				"oTableTools": {
					"aButtons": [
						//"copy",
						"print",
						"xls",
					],
					"sSwfPath": "/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf",
				},
				"autoWidth": false,
				"fnCreatedRow": function (nRow, aData, iDataIndex) {
					$(nRow).attr('id', aData.id);
				}
			});
			//.yadcf(
			//    [
			//        { column_number: 0 },
			//        { column_number: 1, filter_type: "text" },
			//        { column_number: 2, filter_type: "text" },
			//        { column_number: 3, filter_type: "text" },
			//        { column_number: 4, filter_type: "text" },
			//        { column_number: 5, filter_type: "text" },
			//        { column_number: 6, filter_type: "text" },
			//        { column_number: 7, filter_type: "text" },
			//        { column_number: 8, filter_type: "text" },
			//        { column_number: 9, filter_type: "text" },
			//        { column_number: 10, filter_type: "text" },
			//        { column_number: 11, filter_type: "text" },
			//        { column_number: 12, filter_type: "text" },
			//        { column_number: 13, filter_type: "text" },
			//        { column_number: 14, filter_type: "text" },
			//        { column_number: 15, filter_type: "text" },
			//        { column_number: 16, filter_type: "text" },
			//        { column_number: 17, filter_type: "text" },
			//        { column_number: 18, filter_type: "text" },
			//        { column_number: 19, filter_type: "text" },
			//        { column_number: 20, filter_type: "text" },
			//    ]
			//);
			//--selecting a row
			$('#dt_risks tbody').on('click', 'tr', function () {
				goToDetail(this.id);
				$scope.$apply();
			});

		}

	}
})();



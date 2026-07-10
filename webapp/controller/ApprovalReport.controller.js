sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.ApprovalReport", {

        onInit: function () {
            // Model for Filter criteria
            var oFilterModel = new JSONModel({
                plant: "ALL",
                type: "ALL",
                status: "ALL",
                approver: "",
                fromDate: null,
                toDate: null,
                requester: "",
                vendor: "",
                transport: "ALL"
            });
            this.getView().setModel(oFilterModel, "filterModel");

            // Model for KPIs (Values will be populated via backend)
            var oKPIModel = new JSONModel({
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                listCount: 0
            });
            this.getView().setModel(oKPIModel, "kpiModel");

            // Model for Approval List Table (Empty initially)
            var oApprovalListModel = new JSONModel({
                results: []
            });
            this.getView().setModel(oApprovalListModel, "approvalListModel");

            // Attach route matched to trigger initial data load
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("approvalReport").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            // Trigger backend call to fetch consolidated data 
            // (Manual, Reference, and Change Gate Passes)
            this._fetchReportData();
        },

        _fetchReportData: function () {
            // TODO: Implement your OData / REST API call here to fetch the report data.
            // Example flow:
            // 1. Read values from this.getView().getModel("filterModel").getData()
            // 2. Perform backend request
            // 3. On success, update "kpiModel" and "approvalListModel"
            
            // Example of setting data post-fetch:
            // this.getView().getModel("approvalListModel").setProperty("/results", aBackendData);
            // this.getView().getModel("kpiModel").setProperty("/listCount", aBackendData.length);
        },

        onSearchGo: function () {
            // Trigger data fetch using current filter criteria
            this._fetchReportData();
            MessageToast.show("Applying filters and fetching data...");
        },

        onSearchClear: function () {
            // Reset filters to default state
            var oFilterModel = this.getView().getModel("filterModel");
            oFilterModel.setData({
                plant: "ALL",
                type: "ALL",
                status: "ALL",
                approver: "",
                fromDate: null,
                toDate: null,
                requester: "",
                vendor: "",
                transport: "ALL"
            });
            
            // Fetch data without filters
            this._fetchReportData();
        },

        onExportPress: function () {
            // TODO: Implement Excel export logic (e.g., using sap.ui.export.Spreadsheet)
            MessageToast.show("Export to Excel functionality triggered.");
        },

        onGatePassLinkPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("approvalListModel");
            var sGatePassNo = oContext.getProperty("gatePassNo");
            
            // TODO: Route to Display/Approve view passing the Gate Pass No
            MessageToast.show("Navigating to details for: " + sGatePassNo);
        },

        onActionPress: function(oEvent) {
            var oContext = oEvent.getSource().getBindingContext("approvalListModel");
            var sGatePassNo = oContext.getProperty("gatePassNo");
            
            // TODO: Route to Display/Approve view passing the Gate Pass No
            MessageToast.show("Action clicked for: " + sGatePassNo);
        },

        onTableFilterPress: function () {
             // TODO: Open table column filter dialog
             MessageToast.show("Table filter opened");
        },

        onTableSettingsPress: function () {
             // TODO: Open view settings dialog for personalization
             MessageToast.show("Table settings opened");
        },
        
        // Inline formatter for the ObjectStatus state
        formatter: {
            statusState: function(sStatus) {
                if (!sStatus) {
                    return "None";
                }
                var sLower = sStatus.toLowerCase();
                if (sLower === "pending") {
                    return "Warning";
                } else if (sLower === "approved") {
                    return "Success";
                } else if (sLower === "rejected") {
                    return "Error";
                }
                return "None";
            }
        }

    });
});
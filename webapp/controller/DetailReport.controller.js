sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History"
], function (Controller, JSONModel, MessageToast, History) {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.DetailReport", {

        onInit: function () {
            // Filter criteria model
            var oFilterModel = new JSONModel({
                fromDate: null,
                toDate: null,
                plant: "ALL",
                type: "ALL",
                status: "ALL",
                gatePassNo: "",
                requester: "",
                vendor: "",
                transport: "ALL"
            });
            this.getView().setModel(oFilterModel, "filterModel");

            // KPIs model (Empty values for backend population)
            var oKPIModel = new JSONModel({
                total: 0,
                approved: 0,
                pending: 0,
                rejected: 0,
                closed: 0,
                listCount: 0
            });
            this.getView().setModel(oKPIModel, "kpiModel");

            // Main Table list model
            var oListModel = new JSONModel({
                results: []
            });
            this.getView().setModel(oListModel, "listModel");

            // Selected Item model for the bottom section
            var oSelectedItemModel = new JSONModel({});
            this.getView().setModel(oSelectedItemModel, "selectedItemModel");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detailReport").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            // Trigger backend fetch of consolidated report data
            this._fetchReportData();
            
            // Clear the selected item section when route is hit fresh
            this.getView().getModel("selectedItemModel").setData({});
        },

        _fetchReportData: function () {
            // TODO: API logic to GET consolidated gate pass data
            // Fetch from manual, reference document, and changed gate pass tables.
            // Map the response to listModel and update kpiModel accordingly.
        },

        onSearchGo: function () {
            this._fetchReportData();
            MessageToast.show("Applying filters...");
        },

        onSearchClear: function () {
            var oFilterModel = this.getView().getModel("filterModel");
            oFilterModel.setData({
                fromDate: null,
                toDate: null,
                plant: "ALL",
                type: "ALL",
                status: "ALL",
                gatePassNo: "",
                requester: "",
                vendor: "",
                transport: "ALL"
            });
            this._fetchReportData();
        },

        onExportExcelPress: function () {
            // TODO: Implement excel export
            MessageToast.show("Export to Excel triggered");
        },

        onDownloadPdfPress: function () {
            // TODO: Implement PDF generation
            MessageToast.show("Download PDF triggered");
        },

        onBackPress: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("dashboard", {}, true);
            }
        },

        // Triggered by clicking the row or the gate pass number link
        onRowSelect: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("listModel");
            if(oContext) {
                var oData = oContext.getObject();
                this._bindSelectedDetails(oData);
            }
        },

        // Triggered by the Eye Icon
        onViewDetailsPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("listModel");
            if(oContext) {
                var oData = oContext.getObject();
                this._bindSelectedDetails(oData);
            }
        },

        _bindSelectedDetails: function (oData) {
            // TODO: In a real scenario, you might want to make a secondary API call 
            // here to fetch the granular line items, attachments, and history for the specific Gate Pass No.
            
            // For now, binding the basic row data to the panel to display the header details
            this.getView().getModel("selectedItemModel").setData(oData);
            
            // Scroll down to the detail section smoothly
            var oView = this.getView();
            setTimeout(function() {
                var oDetailSection = oView.byId("selectedDetailSection");
                if (oDetailSection && oDetailSection.getDomRef()) {
                    oDetailSection.getDomRef().scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        },

        onTableFilterPress: function () {
             MessageToast.show("Table filter opened");
        },

        onTableSettingsPress: function () {
             MessageToast.show("Table settings opened");
        },
        
        formatter: {
            statusState: function(sStatus) {
                if (!sStatus) { return "None"; }
                var sLower = sStatus.toLowerCase();
                if (sLower === "pending") {
                    return "Warning";
                } else if (sLower === "approved") {
                    return "Success";
                } else if (sLower === "rejected") {
                    return "Error";
                } else if (sLower === "closed") {
                    return "Information"; // Use Information (Blue) for closed state
                }
                return "None";
            }
        }
    });
});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.DisplayGatePass", {
        onInit: function () {
            // Set an empty model ready for backend binding
            var oModel = new JSONModel({
                kpi: {},
                header: {},
                refDoc: {},
                itemData: [],
                attachments: [],
                attachmentCount: 0,
                remarks: ""
            });
            this.getView().setModel(oModel);

            // Assuming you have a router configured, attach route matched handler
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("display").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            // If navigating from Dashboard/List, fetch the Gate Pass ID from arguments
            var sGatePassId = oEvent.getParameter("arguments").gatePassId;
            
            if (sGatePassId) {
                this._fetchGatePassData(sGatePassId);
            }
        },

        _fetchGatePassData: function (sGatePassId) {
            // TODO: Implement your backend logic (OData read or AJAX call) here.
            // Example:
            // this.getView().setBusy(true);
            // myODataModel.read("/GatePassSet('" + sGatePassId + "')", {
            //     urlParameters: { "$expand": "Items,Attachments" },
            //     success: function(oData) {
            //         // Map oData to your JSON Model structure defined in onInit
            //         this.getView().getModel().setData(this._mapBackendData(oData));
            //         this.getView().setBusy(false);
            //     }.bind(this),
            //     error: function() {
            //         this.getView().setBusy(false);
            //     }.bind(this)
            // });

            MessageToast.show("Fetching data for Gate Pass...");
        },

        // --- Toolbar Actions ---

        onBackPress: function () {
            // Navigate back to the previous screen (dashboard)
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("dashboard", {}, true);
            }
        },

        onPrintPress: function () {
            MessageToast.show("Initiating Print job...");
            // Execute print logic here
        },

        onDownloadPdfPress: function () {
            MessageToast.show("Generating PDF...");
            // Execute PDF generation logic here
        },

        // --- Attachment Actions ---

        onAttachmentPress: function (oEvent) {
            var sFileName = oEvent.getSource().getText();
            MessageToast.show("Opening attachment: " + sFileName);
        },

        onDownloadSingleAttachment: function (oEvent) {
            // Get the specific context of the clicked download icon
            var oContext = oEvent.getSource().getBindingContext();
            if (oContext) {
                var sFileName = oContext.getProperty("fileName");
                MessageToast.show("Downloading: " + sFileName);
            }
        },

        onViewAllAttachmentsPress: function () {
            MessageToast.show("Opening attachment list dialog...");
        }
    });
});
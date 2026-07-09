sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.DocumentGatePass", {
        onInit() {
            // Initial data matching the Document Gate Pass item structure
            this._oInitialData = {
                // Sample initial data structure for the document gate pass form
            };

            this.getView().setModel(new JSONModel(JSON.parse(JSON.stringify(this._oInitialData))));
            this.getView().setModel(new JSONModel({
                isEditing: true
            }), "ui");
        },

        _getDataModel() {
            return this.getView().getModel();
        },

        _getUiModel() {
            return this.getView().getModel("ui");
        },

        _setEditing(bEditing) {
            this._getUiModel().setProperty("/isEditing", bEditing);
        },

        _syncItemSno() {
            const oModel = this._getDataModel();
            const aItems = oModel.getProperty("/itemData") || [];

            aItems.forEach((oItem, iIndex) => {
                oItem.sNo = iIndex + 1;
            });

            oModel.setProperty("/itemData", aItems);
        },

        onSavePress() {
            this._setEditing(false);
            MessageToast.show("Gate pass saved");
        },

        onSubmitPress() {
            this._setEditing(false);
            MessageToast.show("Gate pass submitted for approval");
        },

        onNavToHome: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        },

        // Triggered by the Reference Document Number Value Help Icon
        onRefDocHelp() {
            MessageToast.show("Reference Document search requested");
            // Implement your fragment dialog / search logic here
        },

        onDeleteSelectedPress() {
            const oTable = this.byId("itemsTable");
            const aSelectedItems = oTable.getSelectedItems();

            if (!aSelectedItems.length) {
                MessageToast.show("Select item rows to delete");
                return;
            }

            MessageBox.confirm(`Delete ${aSelectedItems.length} selected item(s)?`, {
                actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.DELETE,
                onClose: (sAction) => {
                    if (sAction !== MessageBox.Action.DELETE) {
                        return;
                    }

                    const oModel = this._getDataModel();
                    const aItems = oModel.getProperty("/itemData") || [];
                    const aIndexes = aSelectedItems
                        .map((oItem) => oItem.getBindingContext()?.getPath())
                        .filter(Boolean)
                        .map((sPath) => Number(sPath.split("/").pop()))
                        .sort((a, b) => b - a);

                    aIndexes.forEach((iIndex) => aItems.splice(iIndex, 1));
                    this._syncItemSno();
                    oTable.removeSelections(true);
                    MessageToast.show("Selected items deleted");
                }
            });
        },

        onDeleteItemPress(oEvent) {
            const oRow = oEvent.getSource().getParent();
            const sPath = oRow.getBindingContext()?.getPath();

            if (!sPath) {
                return;
            }

            const oModel = this._getDataModel();
            const aItems = oModel.getProperty("/itemData") || [];
            const iIndex = Number(sPath.split("/").pop());

            aItems.splice(iIndex, 1);
            this._syncItemSno();
            MessageToast.show("Item deleted");
        },

        onAddItem() {
            const oModel = this._getDataModel();
            const aItems = oModel.getProperty("/itemData") || [];

            // Updated to match the new item details columns
            aItems.push({
                sNo: aItems.length + 1,
                materialCode: "",
                materialDesc: "",
                uom: "EA",
                quantity: 1,
                batchNo: "",
                plant: "",
                storageLoc: ""
            });

            oModel.setProperty("/itemData", aItems);
            MessageToast.show("Item added");
        },

        onClearPress() {
            this.getView().getModel().setData(JSON.parse(JSON.stringify(this._oInitialData)));
            this._setEditing(true);
            this.byId("itemsTable").removeSelections(true);
            MessageToast.show("Form cleared");
        },

        onCancelPress() {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        },

        onDownloadAttachmentPress() {
            MessageToast.show("Attachment download started");
        },

        onAddAttachmentPress() {
            MessageToast.show("Add attachment action triggered");
        },

        onAttachmentPress() {
            MessageToast.show("Attachment link opened");
        }
    });
});
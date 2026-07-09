sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.ChangeGatePass", {
        onInit: function () {
            // Initialize empty model ready to receive backend data
            var oEmptyData = {
                itemData: [] // Empty array, so the table renders empty initially
            };

            var oModel = new JSONModel(oEmptyData);
            this.getView().setModel(oModel);
        },

        // --- Toolbar Actions ---

        onSearchGo: function () {
            // Logic to fetch data from backend based on search filters
            MessageToast.show("Fetching Gate Pass data...");
        },

        onSavePress: function () {
            MessageToast.show("Changes Saved Successfully.");
        },

        onResubmitPress: function () {
            MessageToast.show("Gate Pass Resubmitted for Approval.");
        },

        onCloseGatePassPress: function () {
            MessageToast.show("Processing Gate Pass Closure...");
        },

        onCancelPress: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        },

        // --- Table Actions ---

        onAddItem: function () {
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/itemData") || [];

            // Add an empty row for a new item
            aItems.push({
                sNo: aItems.length + 1,
                materialCode: "",
                materialDesc: "",
                uom: "",
                quantity: null,
                returnDate: "",
                refDocNo: "",
                refDocType: ""
            });

            oModel.setProperty("/itemData", aItems);
        },

        onDeleteSelectedPress: function () {
            var oTable = this.byId("itemsTable");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageToast.show("Please select items to delete");
                return;
            }

            MessageBox.confirm("Are you sure you want to delete the selected item(s)?", {
                actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.DELETE,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.DELETE) {
                        var oModel = this.getView().getModel();
                        var aItems = oModel.getProperty("/itemData") || [];
                        
                        var aIndexes = aSelectedItems.map(function(oItem) {
                            return oTable.indexOfItem(oItem);
                        }).sort(function(a, b) {
                            return b - a; // Sort descending to splice without index shift
                        });

                        aIndexes.forEach(function(iIndex) {
                            aItems.splice(iIndex, 1);
                        });

                        this._recalculateSerialNumbers(aItems);
                        oModel.setProperty("/itemData", aItems);
                        oTable.removeSelections(true);
                        MessageToast.show("Selected items deleted");
                    }
                }.bind(this)
            });
        },

        onDeleteItemPress: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oTable = this.byId("itemsTable");
            var iIndex = oTable.indexOfItem(oItem);

            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/itemData") || [];

            aItems.splice(iIndex, 1);
            this._recalculateSerialNumbers(aItems);
            oModel.setProperty("/itemData", aItems);
        },

        _recalculateSerialNumbers: function (aItems) {
            aItems.forEach(function (item, index) {
                item.sNo = index + 1;
            });
        },

        // --- Value Help Requests ---

        onGatePassHelp: function () {
            // Open value help dialog for Gate Pass Number Search
            MessageToast.show("Gate Pass search value help requested");
        },

        onMaterialHelp: function (oEvent) {
            // Open value help dialog for Material Code in Table row
            MessageToast.show("Material search value help requested");
        }
    });
});
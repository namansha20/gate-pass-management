sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.ManualGatePass", {
        onInit() {
            this._oInitialData = {
                headerData: {
                    unit: "AC01",
                    plant: "P1",
                    gatePassType: "Returnable",
                    vendorCode: "",
                    vendorName: "L&T Repair Services",
                    requestorName: "Ajay Basani",
                    transportMode: "Vehicle",
                    vehicleNo: "GJ01AB1234",
                    reason: "Machine sent for repair and maintenance",
                    refDoc: "",
                    refDocType: "",
                    reqDate: "16.06.2026",
                    expReturnDate: "30.06.2026"
                },
                itemData: [
                    {
                        sNo: 1,
                        materialCode: "MAT-1001",
                        materialDesc: "Hydraulic Motor 50HP",
                        uom: "EA",
                        quantity: 1,
                        returnDate: "30.06.2026",
                        refDocNo: "-",
                        refDocType: ""
                    },
                    {
                        sNo: 2,
                        materialCode: "TOOL-2001",
                        materialDesc: "Spanner Set",
                        uom: "SET",
                        quantity: 2,
                        returnDate: "30.06.2026",
                        refDocNo: "-",
                        refDocType: ""
                    }
                ],
                bottomData: {
                    comments: "Machine part is being sent to vendor for repair and maintenance.",
                    attachmentName: "Repair_Quotation.pdf",
                    attachmentSize: "123 KB"
                }
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

        onEditPress() {
            this._setEditing(true);
            MessageToast.show("Edit mode enabled");
        },

        onSavePress() {
            this._setEditing(false);
            MessageToast.show("Gate pass saved");
        },

        // FIX 1: Added missing onSubmitPress method to prevent view crash
        onSubmitPress() {
            this._setEditing(false);
            MessageToast.show("Gate pass submitted for approval");
        },

        // FIX 2: Corrected the route name from "RouteDashboard" to "dashboard"
        onNavToHome: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        },

        onApplyPress() {
            this._setEditing(false);
            MessageToast.show("Gate pass applied");
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

            aItems.push({
                sNo: aItems.length + 1,
                materialCode: "",
                materialDesc: "",
                uom: "EA",
                quantity: 1,
                returnDate: "",
                refDocNo: "",
                refDocType: ""
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
            // FIX 2: Corrected the route name from "RouteDashboard" to "dashboard"
            this.getOwnerComponent().getRouter().navTo("dashboard");
        },

        onVendorHelp() {
            MessageToast.show("Vendor help requested");
        },

        onSelectionChange() {
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
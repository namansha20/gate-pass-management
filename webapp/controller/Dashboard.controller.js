sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.Dashboard", {

        onManualPress: function () {
            this.getOwnerComponent().getRouter().navTo("manual");
        },

        onReferencePress: function () {
            this.getOwnerComponent().getRouter().navTo("reference");
        },

        onChangePress: function () {
            this.getOwnerComponent().getRouter().navTo("change");
        },

        onDisplayPress: function () {
            this.getOwnerComponent().getRouter().navTo("display");
        }
    });
});
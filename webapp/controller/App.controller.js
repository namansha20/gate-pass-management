sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.acutaas.gatepassmanagement.controller.App", {

        onInit: function () {
            this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            var oList = this.byId("sidebarNavigationList");
            
            if (!oList) {
                return;
            }

            // Find the list item that matches the active route and highlight it
            var aItems = oList.getItems();
            for (var i = 0; i < aItems.length; i++) {
                var oItem = aItems[i];
                // Check if the item has our custom route data
                if (oItem.data && oItem.data("route") === sRouteName) {
                    oList.setSelectedItem(oItem, true);
                    break;
                }
            }
        },

        // Single dynamic function to handle all sidebar navigation
        onSidebarSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var sRoute = oSelectedItem.data("route");
            
            if (sRoute) {
                this.getOwnerComponent().getRouter().navTo(sRoute);
            }
        }
    });
});
// migrations/YYYYMMDDHHMMSS-update-stock-receiving-model.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new columns or modify existing columns here
    // Remove the columns that were added in the 'up' method
    await queryInterface.removeColumn("StockReceiving", "product_id");
    await queryInterface.removeColumn("StockReceiving", "received_quantity");

    // ... Add other modifications as needed
  },

  down: async (queryInterface, Sequelize) => {
    // Undo the changes made in the 'up' method
    await queryInterface.addColumn("StockReceiving", "product_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn("StockReceiving", "received_quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    // ... Remove other modifications as needed
  },
};

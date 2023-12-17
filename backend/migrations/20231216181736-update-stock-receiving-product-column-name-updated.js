"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "StockReceivingProducts",
      "id",
      "stock_receiving_product_id"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "StockReceivingProducts",
      "stock_receiving_product_id",
      "id"
    );
  },
};

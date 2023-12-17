"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "StockReceivingProducts",
      "productId",
      "product_id"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "StockReceivingProducts",
      "product_id",
      "productId"
    );
  },
};

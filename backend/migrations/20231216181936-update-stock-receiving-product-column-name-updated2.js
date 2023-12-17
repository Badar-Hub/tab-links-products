"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "StockReceivingProducts",
      "stockReceivingId",
      "stock_receiving_id"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "StockReceiving",
      "stock_receiving_id",
      "receiving_id"
    );
  },
};

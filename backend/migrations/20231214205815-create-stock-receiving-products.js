// migrations/YYYYMMDDHHMMSS-create-stock-receiving-products.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StockReceivingProducts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stockReceivingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "StockReceiving",
          key: "receiving_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StockReceivingProducts");
  },
};

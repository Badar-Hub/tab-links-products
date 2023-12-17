"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StockReceiving", {
      receiving_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      received_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      received_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      received_from: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Vendors",
          key: "vendor_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      received_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StockReceiving");
  },
};

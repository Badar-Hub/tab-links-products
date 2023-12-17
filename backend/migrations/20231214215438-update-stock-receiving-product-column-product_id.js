"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("StockReceivingProducts", "product_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "product_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Add any other modifications needed
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("StockReceivingProducts", "product_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Product", // Revert to the original model name if needed
        key: "product_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Add any other reversions needed
  },
};

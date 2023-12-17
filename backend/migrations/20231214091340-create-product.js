"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories", // Name of the referenced table
          key: "category_id", // Primary key of the referenced table
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      sale_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      cost_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      discount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Products");
  },
};

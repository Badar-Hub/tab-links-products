// models/StockReceivingProduct.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const StockReceivingProduct = sequelize.define(
    "StockReceivingProduct",
    {
      stock_receiving_product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stock_receiving_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "StockReceivings", // Name of the referenced table
          key: "stock_receiving_id", // Primary key of the referenced table
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Name of the referenced table
          key: "product_id", // Primary key of the referenced table
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "StockReceivingProducts",
    }
  );

  StockReceivingProduct.associate = (models) => {
    StockReceivingProduct.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return StockReceivingProduct;
};

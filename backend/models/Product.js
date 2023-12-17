const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories", // Name of the referenced table
          key: "category_id", // Primary key of the referenced table
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      sale_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      tableName: "Products",
    }
  );

  Product.associate = (models) => {
    console.log(
      models,
      "modelsmodelsmodelsmodelsmodelsmodelsmodelsmodelsmodelsmodelsmodels"
    );
    Product.belongsToMany(models.StockReceivingProduct, {
      through: "StockReceivingProducts",
      foreignKey: "product_id",
      as: "stockReceivingProducts",
    });
  };

  return Product;
};

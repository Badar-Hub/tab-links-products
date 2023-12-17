// associations.js
const ProductModel = require("./Product");
const StockReceivingModel = require("./StockReceiving");
const StockReceivingProductModel = require("./StockReceivingProduct");

module.exports = (sequelize) => {
  const Product = ProductModel(sequelize);
  const StockReceivingModel = StockReceivingModel(sequelize);
  const StockReceivingProductModel = StockReceivingProductModel(sequelize);

  Product.belongsToMany(StockReceiving, {
    through: StockReceivingProduct,
    foreignKey: "product_id",
    as: "stockReceivingProducts",
  });

  StockReceiving.belongsToMany(Product, {
    through: StockReceivingProduct,
    foreignKey: "receiving_id",
    as: "products",
  });

  StockReceivingProduct.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });
};

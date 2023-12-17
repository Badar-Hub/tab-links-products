const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const StockReceiving = sequelize.define(
    "StockReceiving",
    {
      receiving_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      received_from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      received_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "StockReceiving",
    }
  );

  StockReceiving.associate = (models) => {
    StockReceiving.belongsToMany(models.Product, {
      through: "StockReceivingProduct",
      foreignKey: "receiving_id",
      as: "products",
    });
  };

  return StockReceiving;
};

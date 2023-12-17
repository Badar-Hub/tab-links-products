// models/Customer.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Customer = sequelize.define(
    "Customer",
    {
      customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_account_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      tableName: "Customers",
    }
  );

  return Customer;
};

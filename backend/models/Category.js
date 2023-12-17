// models/Category.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
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
      tableName: "Categories",
    }
  );

  return Category;
};

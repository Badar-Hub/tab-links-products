// models/User.js
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin",
      },
      password: {
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
      tableName: "users",
    }
  );

  // Hash the password before saving
  User.beforeCreate(async (user) => {
    if (user.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  });

  // Check password validity
  User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

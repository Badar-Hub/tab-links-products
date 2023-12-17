// userManagementRoutes.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

const router = express.Router();

module.exports = (sequelize) => {
  const User = userModel(sequelize);
  // Validation middleware
  const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };

  // Login route
  router.post(
    "/",
    [
      body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
      body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    ],
    validate,
    async (req, res) => {
      try {
        const { name, password } = req.body;

        // Find the user by name
        const user = await User.findOne({ where: { name } });

        // Check if the user exists and if the provided password is valid
        if (user && (await bcrypt.compare(password, user.password))) {
          // Generate a JWT token
          const token = jwt.sign(
            { userId: user.user_id, name: user.name },
            "your-secret-key",
            { expiresIn: "24h" }
          );

          res.json({ token });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // ... (other CRUD routes with validation)

  return router;
};

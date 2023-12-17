// userManagementRoutes.js
const express = require("express");
const router = express.Router();
const { validate } = require("../utility/validation");
const { body } = require("express-validator");

module.exports = (sequelize) => {
  const User = require("../models/User")(sequelize);

  // Create a new user
  router.post(
    "/",
    [
      body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
      body("password")
        .trim()
        .isLength({ min: 9 })
        .withMessage("password should be greater than 8 characters"),
    ],
    validate,
    async (req, res) => {
      try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Read all users
  router.get("/all", async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Read a user by ID
  router.get("/:id", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
      const user = await User.findByPk(userId);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a user by ID
  router.put(
    "/:id",
    [
      body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
      body("password")
        .trim()
        .isLength({ min: 9 })
        .withMessage("password should be greater than 8 characters"),
    ],
    validate,
    async (req, res) => {
      const userId = parseInt(req.params.id);

      try {
        const [rowsUpdated, [updatedUserInstance]] = await User.update(
          req.body,
          {
            where: { user_id: userId },
            returning: true,
          }
        );

        if (rowsUpdated > 0) {
          res.json(updatedUserInstance);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Delete a user by ID
  router.delete("/:id", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
      const rowsDeleted = await User.destroy({ where: { user_id: userId } });

      if (rowsDeleted > 0) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

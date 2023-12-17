// categoryRoutes.js
const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../utility/validation");
const authMiddleware = require("../utility/authValidator");
const CategoryModel = require("../models/Category");

const router = express.Router();

module.exports = (sequelize) => {
  const Category = CategoryModel(sequelize);

  // Get all categories
  router.get("/all", authMiddleware, async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get category by ID
  router.get("/:id", authMiddleware, async (req, res) => {
    const categoryId = parseInt(req.params.id);

    try {
      const category = await Category.findByPk(categoryId);

      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new category
  router.post(
    "/",
    authMiddleware,
    [body("name").trim().isLength({ min: 1 }).withMessage("Name is required")],
    validate,
    async (req, res) => {
      try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Update a category by ID
  router.put(
    "/:id",
    authMiddleware,
    [body("name").trim().isLength({ min: 1 }).withMessage("Name is required")],
    validate,
    async (req, res) => {
      const categoryId = parseInt(req.params.id);

      try {
        const [rowsUpdated, [updatedCategoryInstance]] = await Category.update(
          req.body,
          {
            where: { category_id: categoryId },
            returning: true,
          }
        );

        if (rowsUpdated > 0) {
          res.json(updatedCategoryInstance);
        } else {
          res.status(404).json({ error: "Category not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Delete a category by ID
  router.delete("/:id", authMiddleware, async (req, res) => {
    const categoryId = parseInt(req.params.id);

    try {
      const rowsDeleted = await Category.destroy({
        where: { category_id: categoryId },
      });

      if (rowsDeleted > 0) {
        res.json({ message: "Category deleted successfully" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  return router;
};

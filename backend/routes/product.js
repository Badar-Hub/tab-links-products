// productRoutes.js
const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../utility/authValidator");
const ProductModel = require("../models/Product");
const { validate } = require("../utility/validation");
const router = express.Router();

module.exports = (sequelize) => {
  const Product = ProductModel(sequelize);
  router.post(
    "/",
    authMiddleware,
    [
      body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
      body("category_id").isInt().withMessage("Category ID must be an integer"),
      body("sale_price")
        .isFloat({ min: 0 })
        .withMessage("Sale price must be a non-negative float"),
      body("cost_price")
        .isFloat({ min: 0 })
        .withMessage("Cost price must be a non-negative float"),
      body("discount")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100"),
    ],
    validate,
    async (req, res) => {
      try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Read all products
  router.get("/all", authMiddleware, async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Read a product by ID
  router.get("/:id", authMiddleware, async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
      const product = await Product.findByPk(productId);

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a product by ID
  router.put(
    "/:id",
    authMiddleware,
    [
      body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
      body("category_id").isInt().withMessage("Category ID must be an integer"),
      body("sale_price")
        .isFloat({ min: 0 })
        .withMessage("Sale price must be a non-negative float"),
      body("cost_price")
        .isFloat({ min: 0 })
        .withMessage("Cost price must be a non-negative float"),
      body("discount")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100"),
    ],
    validate,
    async (req, res) => {
      const productId = parseInt(req.params.id);

      try {
        const [rowsUpdated, [updatedProductInstance]] = await Product.update(
          req.body,
          {
            where: { product_id: productId },
            returning: true,
          }
        );

        if (rowsUpdated > 0) {
          res.json(updatedProductInstance);
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Delete a product by ID
  router.delete("/:id", authMiddleware, async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
      const rowsDeleted = await Product.destroy({
        where: { product_id: productId },
      });

      if (rowsDeleted > 0) {
        res.json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  return router;
};

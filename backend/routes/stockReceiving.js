// stockReceivingRoutes.js
const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../utility/authValidator");
const { validate } = require("../utility/validation");
const ProductModel = require("../models/Product");
const StockReceivingModel = require("../models/StockReceiving");
const StockReceivingProductModel = require("../models/StockReceivingProduct");

// const ProductModel = require("../models/Product");
// const StockReceivingModel = require("../models/StockReceiving");
// const StockReceivingProductModel = require("../models/StockReceivingProduct");

const router = express.Router();

module.exports = (sequelize) => {
  const Product = ProductModel(sequelize);
  const StockReceiving = StockReceivingModel(sequelize);
  const StockReceivingProduct = StockReceivingProductModel(sequelize);

  router.post(
    "/",
    authMiddleware,
    [
      body("received_from")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Received from is required"),
      body("received_by")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Received by is required"),
      body("products").isArray().withMessage("Products should be an array"),
      body("products.*.product_id").isInt().withMessage("Invalid product ID"),
      body("products.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
    ],
    validate,
    async (req, res) => {
      try {
        const { received_from, received_by, notes, products } = req.body;

        const newStockReceiving = await StockReceiving.create({
          received_from,
          received_by,
          notes,
        });

        const stockReceivingId = newStockReceiving.receiving_id;

        await StockReceivingProduct.bulkCreate(
          products.map((product) => ({
            stockReceivingId: stockReceivingId,
            product_id: product.product_id,
            quantity: product.quantity,
          }))
        );

        const productsWithQuantities = await StockReceivingProduct.findAll({
          where: { stockReceivingId },
          include: [{ model: Product, as: "product" }],
        });

        res.status(201).json({ newStockReceiving, productsWithQuantities });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Read all stock receiving entries
  // router.get("/all", authMiddleware, async (req, res) => {
  //   try {
  //     const allProducts = await Product.findAll({
  //       include: [
  //         {
  //           model: StockReceivingProduct,
  //           as: "stockReceivingProducts",
  //           include: [{ model: StockReceiving, as: "stockReceiving" }],
  //         },
  //       ],
  //     });
  //     res.json(allProducts);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });
  // router.get("/all", authMiddleware, async (req, res) => {
  //   try {
  //     const allProducts = await Product.findAll({
  //       include: [
  //         {
  //           model: StockReceivingProduct,
  //           as: "stockReceivingProducts",
  //           attributes: ["quantity"],
  //           include: [{ model: StockReceiving, as: "stockReceiving" }],
  //         },
  //       ],
  //     });

  //     res.json(allProducts);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });

  router.get("/all", authMiddleware, async (req, res) => {
    try {
      const allProducts = await Product.findAll({
        include: [
          {
            model: StockReceivingProduct,
            as: "stockReceivingProducts",
            attributes: ["product_id"],
            include: [{ model: StockReceiving, as: "stockReceiving" }],
          },
        ],
      });

      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Read a stock receiving entry by ID
  router.get("/:id", authMiddleware, async (req, res) => {
    const receivingId = parseInt(req.params.id);

    try {
      const stockReceivingEntry = await StockReceiving.findByPk(receivingId);

      if (stockReceivingEntry) {
        res.json(stockReceivingEntry);
      } else {
        res.status(404).json({ error: "Stock receiving entry not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a stock receiving entry by ID
  router.put(
    "/:id",
    authMiddleware,
    [
      body("received_quantity")
        .isInt({ min: 1 })
        .withMessage("Received quantity must be at least 1"),
      body("received_from")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Received from is required"),
      body("received_by")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Received by is required"),
    ],
    validate,
    async (req, res) => {
      const receivingId = parseInt(req.params.id);

      try {
        const [rowsUpdated, [updatedStockReceivingInstance]] =
          await StockReceiving.update(req.body, {
            where: { receiving_id: receivingId },
            returning: true,
          });

        if (rowsUpdated > 0) {
          res.json(updatedStockReceivingInstance);
        } else {
          res.status(404).json({ error: "Stock receiving entry not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Delete a stock receiving entry by ID
  router.delete("/:id", authMiddleware, async (req, res) => {
    const receivingId = parseInt(req.params.id);

    try {
      const rowsDeleted = await StockReceiving.destroy({
        where: { receiving_id: receivingId },
      });

      if (rowsDeleted > 0) {
        res.json({ message: "Stock receiving entry deleted successfully" });
      } else {
        res.status(404).json({ error: "Stock receiving entry not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

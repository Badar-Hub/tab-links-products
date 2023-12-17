// customerRoutes.js
const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../utility/authValidator");
const { validate } = require("../utility/validation");
const CustomerModel = require("../models/Customer");

const router = express.Router();

module.exports = (sequelize) => {
  const Customer = CustomerModel(sequelize);

  router.post(
    "/",
    authMiddleware,
    [
      body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
      body("phone").isMobilePhone().withMessage("Invalid phone number"),
      body("address")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Address is required"),
      body("bank_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Bank name is required"),
      body("bank_account_number")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Bank account number is required"),
    ],
    validate,
    async (req, res) => {
      try {
        const newCustomer = await Customer.create(req.body);
        res.status(201).json(newCustomer);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Read all customers
  router.get("/all", authMiddleware, async (req, res) => {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Read a customer by ID
  router.get("/:id", authMiddleware, async (req, res) => {
    const customerId = parseInt(req.params.id);

    try {
      const customer = await Customer.findByPk(customerId);

      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ error: "Customer not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a customer by ID
  router.put(
    "/:id",
    authMiddleware,
    [
      body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
      body("phone").isMobilePhone().withMessage("Invalid phone number"),
      body("address")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Address is required"),
      body("bank_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Bank name is required"),
      body("bank_account_number")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Bank account number is required"),
    ],
    validate,
    async (req, res) => {
      const customerId = parseInt(req.params.id);

      try {
        const [rowsUpdated, [updatedCustomerInstance]] = await Customer.update(
          req.body,
          {
            where: { customer_id: customerId },
            returning: true,
          }
        );

        if (rowsUpdated > 0) {
          res.json(updatedCustomerInstance);
        } else {
          res.status(404).json({ error: "Customer not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Delete a customer by ID
  router.delete("/:id", authMiddleware, async (req, res) => {
    const customerId = parseInt(req.params.id);

    try {
      const rowsDeleted = await Customer.destroy({
        where: { customer_id: customerId },
      });

      if (rowsDeleted > 0) {
        res.json({ message: "Customer deleted successfully" });
      } else {
        res.status(404).json({ error: "Customer not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

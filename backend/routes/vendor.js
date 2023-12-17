// vendorRoutes.js
const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../utility/authValidator");
const { validate } = require("../utility/validation");
const VendorModel = require("../models/Vendor");

const router = express.Router();

module.exports = (sequelize) => {
  const Vendor = VendorModel(sequelize);

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
        const newVendor = await Vendor.create(req.body);
        res.status(201).json(newVendor);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Read all vendors
  router.get("/all", authMiddleware, async (req, res) => {
    try {
      const vendors = await Vendor.findAll();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Read a vendor by ID
  router.get("/:id", authMiddleware, async (req, res) => {
    const vendorId = parseInt(req.params.id);

    try {
      const vendor = await Vendor.findByPk(vendorId);

      if (vendor) {
        res.json(vendor);
      } else {
        res.status(404).json({ error: "Vendor not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a vendor by ID
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
      const vendorId = parseInt(req.params.id);

      try {
        const [rowsUpdated, [updatedVendorInstance]] = await Vendor.update(
          req.body,
          {
            where: { vendor_id: vendorId },
            returning: true,
          }
        );

        if (rowsUpdated > 0) {
          res.json(updatedVendorInstance);
        } else {
          res.status(404).json({ error: "Vendor not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Delete a vendor by ID
  router.delete("/:id", authMiddleware, async (req, res) => {
    const vendorId = parseInt(req.params.id);

    try {
      const rowsDeleted = await Vendor.destroy({
        where: { vendor_id: vendorId },
      });

      if (rowsDeleted > 0) {
        res.json({ message: "Vendor deleted successfully" });
      } else {
        res.status(404).json({ error: "Vendor not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

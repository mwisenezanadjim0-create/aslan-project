import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import { logError } from "../utils/logger.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */
// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ category: 1, name: 1 });
        res.json(products);
    } catch (err) {
        logError("Fetch Products", err);
        res.status(500).json({ msg: "Failed to fetch menu items" });
    }
});

/* ================= ADMIN ROUTES ================= */
// Add new product
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, category, price, description, icon, chefSpecial } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ msg: "Name, category, and price are required" });
        }

        const newProduct = new Product({
            name,
            category,
            price,
            description,
            icon,
            chefSpecial
        });

        await newProduct.save();
        res.json({ msg: "Menu item added successfully", product: newProduct });
    } catch (err) {
        logError("Add Product", err);
        res.status(500).json({ msg: "Failed to add menu item" });
    }
});

// Update product
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name, category, price, description, icon, chefSpecial } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price !== undefined ? price : product.price;
        product.description = description !== undefined ? description : product.description;
        product.icon = icon || product.icon;
        product.chefSpecial = chefSpecial !== undefined ? chefSpecial : product.chefSpecial;

        await product.save();
        res.json({ msg: "Menu item updated successfully", product });
    } catch (err) {
        logError("Update Product", err);
        res.status(500).json({ msg: "Failed to update menu item" });
    }
});

// Delete product
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        await product.deleteOne();
        res.json({ msg: "Menu item removed successfully" });
    } catch (err) {
        logError("Delete Product", err);
        res.status(500).json({ msg: "Failed to remove menu item" });
    }
});

export default router;

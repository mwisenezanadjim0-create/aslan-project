import "../config/env.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { menuItems } from "../../frontend/src/data/menuItems.js";
import { logInfo, logError } from "./logger.js";

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logInfo("Connected to MongoDB for seeding...");

        // Clear existing products
        await Product.deleteMany({});
        logInfo("Cleared existing products.");

        // Format items (remove the manual id to let MongoDB generate _id)
        const formattedItems = menuItems.map(item => {
            const { id, ...rest } = item;
            return {
                ...rest,
                price: Number(rest.price) // ensure it's a number
            };
        });

        await Product.insertMany(formattedItems);
        logInfo(`Successfully seeded ${formattedItems.length} menu items!`);

        process.exit(0);
    } catch (err) {
        logError("Seeding failed", err);
        process.exit(1);
    }
}

seedDatabase();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import favoritesRoutes from "./routes/favorites.js";
import adsRoutes from "./routes/ads.js";
import notificationsRoutes from "./routes/notifications.js";
import userRoutes from "./routes/user.js";
import internshipsRoutes from "./routes/internships.js";

// Load environment variables
dotenv.config();

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/internvault";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB successfully");
        console.log(`📊 Database: ${mongoose.connection.name}`);
    })
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        console.log("\n⚠️  Make sure MongoDB is running or update MONGODB_URI in .env file");
    });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/internships", internshipsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "InternVault API is running",
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something went wrong!",
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   - GET  http://localhost:${PORT}/api/favorites/:userId`);
    console.log(`   - POST http://localhost:${PORT}/api/favorites/add`);
    console.log(`   - DELETE http://localhost:${PORT}/api/favorites/remove/:id\n`);
});

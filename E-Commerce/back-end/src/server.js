import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./mongoDB/config.js";
import { seedAdminUser } from "./utils/dbSeeder.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";

const app = express();
dotenv.config();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/admin', adminRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

// 404 Middleware
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});



// Connect to DB, seed admin user, and then start server
const PORT = process.env.PORT || 5000;

connectDB()
    .then(async () => {
        // Create default admin user if it doesn't exist
        await seedAdminUser();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("Failed to connect to the database. Server not started.", error);
        process.exit(1);
    });

import express from 'express';
import connectDB from './mongoDB/config.js';
import cors from 'cors';
// import dotenv from 'dotenv';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// 404 Middleware
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Connect to DB and then start server
connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(error => {
        console.error("Failed to connect to the database. Server not started.", error);
        process.exit(1); // Exit the process with a failure code
    });

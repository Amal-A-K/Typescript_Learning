import express from 'express';
import connectDB from './mongoDB/config';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Welcome to Chat App APIs...");
})

// 404 Middleware
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Connect to DB and then start server
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
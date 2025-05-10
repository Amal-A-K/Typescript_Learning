import express from "express";
import { createChat, findUserChat, findChat } from "../controllers/chatController.js";


const router = express.Router();

router.post("/",createChat);
router.get("/:userId",findUserChat);
router.get("/find/:firstId/:secondId",findChat );

export default router;
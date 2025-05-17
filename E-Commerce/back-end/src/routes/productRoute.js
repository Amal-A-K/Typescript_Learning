import express from "express";
import { createProduct, getProducts,getProductById,  updateProduct, deleteProduct, searchProduct } from "../controllers/productController.js";
import { isadmin, authenticateToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create and update routes with file upload middleware
router.post('/createProduct', authenticateToken, isadmin, upload.single('image'), createProduct);
router.put('/updateProduct/:id', authenticateToken, isadmin, upload.single('image'), updateProduct);

// Get and delete routes without file upload middleware
router.get('/getProducts', getProducts);
router.get('/getProductById/:id', getProductById);
router.delete('/deleteProduct/:id', authenticateToken, isadmin, deleteProduct);
router.get('/search', searchProduct);

export default router;
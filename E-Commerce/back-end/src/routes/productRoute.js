import express from "express";
import { createProduct, getProducts,getProductById,  updateProduct, deleteProduct } from "../controllers/productController";
import { isadmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/createProduct', isadmin ,createProduct);
router.get('/getProducts', getProducts);
router.get('/getProductById/:id',getProductById)
router.put('/updateProduct/:id', isadmin, updateProduct);
router.delete('/deleteProduct/:id', isadmin, deleteProduct);

export default router;
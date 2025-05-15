import Product from "../models/productModel";
import { validateProduct } from "../validation/productValidation";

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, image } = req.body;
        const savedProduct = await Product.create({ name, price, description, category, stock, image });
        if(!savedProduct){
            return res.status(404).json({ message: "New Product is not created" });
        }
        return res.status(201).json({ message: "New Product saved successfully",newProduct: savedProduct });
        
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
    
    
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt:-1 });
        if (!products) {
            return res.status(404).json({ message: "No product available."})
        }
        return res.status(200).json({ message: "Products Available", products: products });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getProductById = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ message: "No product found. Pass correct product id." });
        }
        return res.status(200).json({ message: "Product found", product: product });
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name,price,description,category,stock,image } = req.body;
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({ message: "No product found. Pass the correct product id." });
        }
        const updateProduct = await Product.findByIdAndUpdate(id,{
            name, price,description,category,stock,image
        },{ new: true });
        if (!updateProduct) {
            return res.status(404).json({ message: "Failed to update product" });
        }
        return res.status(200).json({ message: "Successfully updated product", product: updateProduct });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message})
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ message: "Product is not available. Pass correct product id." });
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Failed to delete product" });
        }
        return res.status(200).json({ message: "Successfully deleted product" });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
import api from './api';
import { Product } from '../types/product';

class ProductService {
    async getAllProducts(): Promise<Product[]> {
        const response = await api.get('/products/getProducts');
        return response.data.products;
    }

    async getProductById(id: string): Promise<Product> {
        const response = await api.get(`/products/getProductById/${id}`);
        return response.data.product;
    }

    async searchProducts(query: string): Promise<Product[]> {
        const response = await api.get(`/products/search?query=${query}`);
        return response.data.products;
    }
}

export default new ProductService();

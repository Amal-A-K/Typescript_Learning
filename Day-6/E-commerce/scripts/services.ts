import { Product, CartItem } from './models';
import { apiClient } from './api';

class ProductService {
    async getProducts(): Promise<Product[]> {
        const response = await apiClient.get<Product[]>('products');
        return response.data || [];
    }

    async getProductById(id: string): Promise<Product | null> {
        const response = await apiClient.get<Product>(`products/${id}`);
        return response.data || null;
    }

    async filterProducts(criteria: string): Promise<Product[]> {
        const response = await apiClient.get<Product[]>(`products?filter=${criteria}`);
        return response.data || [];
    }
}

class CartService {
    private items: CartItem[] = [];

    addItem(product: Product, quantity: number = 1): void {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
        this.updateStorage();
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateStorage();
    }

    updateQuantity(productId: string, quantity: number): void {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            this.updateStorage();
        }
    }

    getItems(): CartItem[] {
        return [...this.items];
    }

    getTotal(): number {
        return this.items.reduce(
            (total, item) => total + (item.product.price * item.quantity), 0
        );
    }

    clear(): void {
        this.items = [];
        this.updateStorage();
    }

    private updateStorage(): void {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadFromStorage(): void {
        const stored = localStorage.getItem('cart');
        this.items = stored ? JSON.parse(stored) : [];
    }
}

export const productService = new ProductService();
export const cartService = new CartService();
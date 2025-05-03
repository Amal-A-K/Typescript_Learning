"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.productService = void 0;
const api_1 = require("./api");
class ProductService {
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield api_1.apiClient.get('products');
            return response.data || [];
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield api_1.apiClient.get(`products/${id}`);
            return response.data || null;
        });
    }
    filterProducts(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield api_1.apiClient.get(`products?filter=${criteria}`);
            return response.data || [];
        });
    }
}
class CartService {
    constructor() {
        this.items = [];
    }
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            this.items.push({ product, quantity });
        }
        this.updateStorage();
    }
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateStorage();
    }
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            this.updateStorage();
        }
    }
    getItems() {
        return [...this.items];
    }
    getTotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
    clear() {
        this.items = [];
        this.updateStorage();
    }
    updateStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    loadFromStorage() {
        const stored = localStorage.getItem('cart');
        this.items = stored ? JSON.parse(stored) : [];
    }
}
exports.productService = new ProductService();
exports.cartService = new CartService();

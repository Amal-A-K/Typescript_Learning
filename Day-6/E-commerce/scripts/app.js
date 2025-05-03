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
const components_1 = require("./components");
const services_1 = require("./services");
class ECommerceApp {
    constructor() {
        this.currentPage = '';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            services_1.cartService.loadFromStorage();
            this.setupNavigation();
            this.detectPage();
        });
    }
    setupNavigation() {
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                if (target) {
                    window.location.href = target;
                }
            });
        });
    }
    detectPage() {
        const path = window.location.pathname.split('/').pop() || '';
        this.currentPage = path.replace('.html', '');
        switch (this.currentPage) {
            case 'index':
                this.loadProductListing();
                break;
            case 'product':
                this.loadProductDetail();
                break;
            case 'cart':
                this.loadCart();
                break;
            default:
                this.loadProductListing();
        }
    }
    loadProductListing() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield services_1.productService.getProducts();
            const container = document.getElementById('products-container');
            if (!container)
                return;
            container.innerHTML = '';
            products.forEach(product => {
                const productCard = new components_1.ProductCardComponent(product);
                const itemContainer = document.createElement('div');
                container.appendChild(itemContainer);
                productCard.render(itemContainer);
                productCard.addEventListener(event => {
                    if (event.type === 'add_to_cart') {
                        services_1.cartService.addItem(event.data);
                        this.updateCartCount();
                    }
                });
            });
            this.setupSearch();
            this.updateCartCount();
        });
    }
    loadProductDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams(window.location.search);
            const productId = params.get('id');
            if (!productId)
                return;
            const product = yield services_1.productService.getProductById(productId);
            if (!product)
                return;
            const container = document.getElementById('product-detail-container');
            const addToCartBtn = document.getElementById('add-to-cart-btn');
            const backBtn = document.getElementById('back-to-products');
            if (container) {
                const productCard = new components_1.ProductCardComponent(product);
                productCard.render(container);
            }
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    services_1.cartService.addItem(product);
                    this.updateCartCount();
                });
            }
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    window.location.href = 'index.html';
                });
            }
            this.updateCartCount();
        });
    }
    loadCart() {
        const items = services_1.cartService.getItems();
        const container = document.getElementById('cart-items-container');
        const totalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const continueBtn = document.getElementById('continue-shopping');
        if (container) {
            container.innerHTML = '';
            items.forEach(item => {
                const cartItem = new components_1.CartItemComponent(item);
                const itemContainer = document.createElement('div');
                container.appendChild(itemContainer);
                cartItem.render(itemContainer);
                cartItem.addEventListener(event => {
                    if (event.type === 'update_quantity' && event.data.quantity) {
                        services_1.cartService.updateQuantity(item.product.id, event.data.quantity);
                        this.updateCartTotal();
                    }
                    else if (event.type === 'remove_item') {
                        services_1.cartService.removeItem(item.product.id);
                        this.loadCart();
                    }
                });
            });
        }
        if (totalElement) {
            totalElement.textContent = `$${services_1.cartService.getTotal().toFixed(2)}`;
        }
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Checkout functionality would go here!');
            });
        }
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        this.updateCartCount();
    }
    updateCartCount() {
        const count = services_1.cartService.getItems().reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('#cart-link').forEach(link => {
            link.textContent = `Cart (${count})`;
        });
    }
    updateCartTotal() {
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = `$${services_1.cartService.getTotal().toFixed(2)}`;
        }
    }
    setupSearch() {
        const searchInput = document.getElementById('search');
        const categoryFilter = document.getElementById('category-filter');
        if (searchInput) {
            searchInput.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
                const products = yield services_1.productService.filterProducts(searchInput.value);
                // Update product listing
            }));
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                const products = yield services_1.productService.filterProducts(categoryFilter.value);
                // Update product listing
            }));
        }
    }
}
// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ECommerceApp();
    app.init();
});

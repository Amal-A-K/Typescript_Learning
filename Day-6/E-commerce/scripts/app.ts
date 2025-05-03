import { Product, CartItem } from './models';
import { ProductCardComponent, CartItemComponent } from './components';
import { productService, cartService } from './services';

class ECommerceApp {
    private currentPage: string = '';

    async init(): Promise<void> {
        cartService.loadFromStorage();
        this.setupNavigation();
        this.detectPage();
    }

    private setupNavigation(): void {
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = (e.target as HTMLAnchorElement).getAttribute('href');
                if (target) {
                    window.location.href = target;
                }
            });
        });
    }

    private detectPage(): void {
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

    private async loadProductListing(): Promise<void> {
        const products = await productService.getProducts();
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = '';
        products.forEach(product => {
            const productCard = new ProductCardComponent(product);
            const itemContainer = document.createElement('div');
            container.appendChild(itemContainer);
            productCard.render(itemContainer);

            productCard.addEventListener(event => {
                if (event.type === 'add_to_cart') {
                    cartService.addItem(event.data);
                    this.updateCartCount();
                }
            });
        });

        this.setupSearch();
        this.updateCartCount();
    }

    private async loadProductDetail(): Promise<void> {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        if (!productId) return;

        const product = await productService.getProductById(productId);
        if (!product) return;

        const container = document.getElementById('product-detail-container');
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const backBtn = document.getElementById('back-to-products');

        if (container) {
            const productCard = new ProductCardComponent(product);
            productCard.render(container);
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                cartService.addItem(product);
                this.updateCartCount();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        this.updateCartCount();
    }

    private loadCart(): void {
        const items = cartService.getItems();
        const container = document.getElementById('cart-items-container');
        const totalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const continueBtn = document.getElementById('continue-shopping');

        if (container) {
            container.innerHTML = '';
            items.forEach(item => {
                const cartItem = new CartItemComponent(item);
                const itemContainer = document.createElement('div');
                container.appendChild(itemContainer);
                cartItem.render(itemContainer);

                cartItem.addEventListener(event => {
                    if (event.type === 'update_quantity' && event.data.quantity) {
                        cartService.updateQuantity(item.product.id, event.data.quantity);
                        this.updateCartTotal();
                    } else if (event.type === 'remove_item') {
                        cartService.removeItem(item.product.id);
                        this.loadCart();
                    }
                });
            });
        }

        if (totalElement) {
            totalElement.textContent = `$${cartService.getTotal().toFixed(2)}`;
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

    private updateCartCount(): void {
        const count = cartService.getItems().reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('#cart-link').forEach(link => {
            link.textContent = `Cart (${count})`;
        });
    }

    private updateCartTotal(): void {
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = `$${cartService.getTotal().toFixed(2)}`;
        }
    }

    private setupSearch(): void {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;

        if (searchInput) {
            searchInput.addEventListener('input', async () => {
                const products = await productService.filterProducts(searchInput.value);
                // Update product listing
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', async () => {
                const products = await productService.filterProducts(categoryFilter.value);
                // Update product listing
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ECommerceApp();
    app.init();
});
import { Product, CartItem, ComponentEvent } from './models';

interface UIComponent<T> {
    getData(): T;
    setData(data: T): void;
    render(container: HTMLElement): void;
    destroy(): void;
    addEventListener(listener: (event: ComponentEvent<T>) => void): void;
}

abstract class BaseProductComponent<T extends Product> implements UIComponent<T> {
    protected product: T;
    protected listeners: Array<(event: ComponentEvent<T>) => void> = [];
    protected container: HTMLElement | null = null;

    constructor(product: T) {
        this.product = product;
    }

    getData(): T {
        return this.product;
    }

    setData(data: T): void {
        this.product = data;
        this.update();
    }

    render(container: HTMLElement): void {
        this.container = container;
        this.container.innerHTML = '';
        this.initialize();
    }

    destroy(): void {
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
    }

    addEventListener(listener: (event: ComponentEvent<T>) => void): void {
        this.listeners.push(listener);
    }

    protected emitEvent(type: string, data?: Partial<T>): void {
        const event: ComponentEvent<T> = {
            type,
            data: { ...this.product, ...data }
        };
        this.listeners.forEach(listener => listener(event));
    }

    protected abstract initialize(): void;
    protected abstract update(): void;
}

export class ProductCardComponent extends BaseProductComponent<Product> {
    private cardElement: HTMLElement | null = null;

    protected initialize(): void {
        if (!this.container) return;

        this.cardElement = document.createElement('div');
        this.cardElement.className = 'product-card';
        this.cardElement.dataset.id = this.product.id;

        const img = document.createElement('img');
        img.src = this.product.imageUrl;
        img.alt = this.product.name;

        const name = document.createElement('h3');
        name.textContent = this.product.name;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `$${this.product.price.toFixed(2)}`;

        const button = document.createElement('button');
        button.className = 'add-to-cart';
        button.textContent = 'Add to Cart';
        button.addEventListener('click', () => this.emitEvent('add_to_cart'));

        this.cardElement.append(img, name, price, button);
        this.container.appendChild(this.cardElement);
    }

    protected update(): void {
        if (!this.cardElement) return;
        
        const name = this.cardElement.querySelector('h3');
        const price = this.cardElement.querySelector('.price');
        
        if (name) name.textContent = this.product.name;
        if (price) price.textContent = `$${this.product.price.toFixed(2)}`;
    }
}

export class CartItemComponent implements UIComponent<CartItem> {
    private item: CartItem;
    private listeners: Array<(event: ComponentEvent<CartItem>) => void> = [];
    private container: HTMLElement | null = null;

    constructor(item: CartItem) {
        this.item = item;
    }

    getData(): CartItem {
        return this.item;
    }

    setData(item: CartItem): void {
        this.item = item;
        this.update();
    }

    render(container: HTMLElement): void {
        this.container = container;
        this.container.innerHTML = '';
        this.initialize();
    }

    destroy(): void {
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
    }

    addEventListener(listener: (event: ComponentEvent<CartItem>) => void): void {
        this.listeners.push(listener);
    }

    private initialize(): void {
        if (!this.container) return;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        const img = document.createElement('img');
        img.src = this.item.product.imageUrl;
        img.alt = this.item.product.name;

        const info = document.createElement('div');
        info.className = 'cart-item-info';

        const name = document.createElement('h4');
        name.textContent = this.item.product.name;

        const price = document.createElement('p');
        price.textContent = `$${this.item.product.price.toFixed(2)}`;

        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.value = this.item.quantity.toString();
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt((e.target as HTMLInputElement).value);
            this.emitEvent('update_quantity', { quantity: newQuantity });
        });

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-item';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => this.emitEvent('remove_item'));

        info.append(name, price);
        controls.append(quantityInput, removeButton);
        itemElement.append(img, info, controls);
        this.container.appendChild(itemElement);
    }

    private update(): void {
        if (!this.container) return;
        const quantityInput = this.container.querySelector('input');
        if (quantityInput) {
            quantityInput.value = this.item.quantity.toString();
        }
    }

    private emitEvent(type: string, data?: Partial<CartItem>): void {
        const event: ComponentEvent<CartItem> = {
            type,
            data: { ...this.item, ...data }
        };
        this.listeners.forEach(listener => listener(event));
    }
}
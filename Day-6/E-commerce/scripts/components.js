"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemComponent = exports.ProductCardComponent = void 0;
class BaseProductComponent {
    constructor(product) {
        this.listeners = [];
        this.container = null;
        this.product = product;
    }
    getData() {
        return this.product;
    }
    setData(data) {
        this.product = data;
        this.update();
    }
    render(container) {
        this.container = container;
        this.container.innerHTML = '';
        this.initialize();
    }
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
    }
    addEventListener(listener) {
        this.listeners.push(listener);
    }
    emitEvent(type, data) {
        const event = {
            type,
            data: Object.assign(Object.assign({}, this.product), data)
        };
        this.listeners.forEach(listener => listener(event));
    }
}
class ProductCardComponent extends BaseProductComponent {
    constructor() {
        super(...arguments);
        this.cardElement = null;
    }
    initialize() {
        if (!this.container)
            return;
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
    update() {
        if (!this.cardElement)
            return;
        const name = this.cardElement.querySelector('h3');
        const price = this.cardElement.querySelector('.price');
        if (name)
            name.textContent = this.product.name;
        if (price)
            price.textContent = `$${this.product.price.toFixed(2)}`;
    }
}
exports.ProductCardComponent = ProductCardComponent;
class CartItemComponent {
    constructor(item) {
        this.listeners = [];
        this.container = null;
        this.item = item;
    }
    getData() {
        return this.item;
    }
    setData(item) {
        this.item = item;
        this.update();
    }
    render(container) {
        this.container = container;
        this.container.innerHTML = '';
        this.initialize();
    }
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
    }
    addEventListener(listener) {
        this.listeners.push(listener);
    }
    initialize() {
        if (!this.container)
            return;
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
            const newQuantity = parseInt(e.target.value);
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
    update() {
        if (!this.container)
            return;
        const quantityInput = this.container.querySelector('input');
        if (quantityInput) {
            quantityInput.value = this.item.quantity.toString();
        }
    }
    emitEvent(type, data) {
        const event = {
            type,
            data: Object.assign(Object.assign({}, this.item), data)
        };
        this.listeners.forEach(listener => listener(event));
    }
}
exports.CartItemComponent = CartItemComponent;

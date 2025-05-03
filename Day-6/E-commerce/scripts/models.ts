interface BaseProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export interface Book extends BaseProduct {
    type: 'book';
    author: string;
    pages: number;
    isbn: string;
}

export interface Electronics extends BaseProduct {
    type: 'electronics';
    brand: string;
    model: string;
    warrantyMonths: number;
}

export type Product = Book | Electronics;

export interface CartItem<T extends BaseProduct = Product> {
    product: T;
    quantity: number;
}

export type ComponentEvent<T> = {
    type: string;
    data: T;
};
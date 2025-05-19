export interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: 'Electronics' | 'Clothing' | 'Home' | 'Books' | 'Phone';
    stock: number;
    image?: string[];
    createdBy?: string;
}

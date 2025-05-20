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

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartData {
  items: CartItem[];
  total: number;
}

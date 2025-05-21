// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext'; // Import useAuth to depend on authentication state

interface ProductInCart {
    id: string;
    name: string;
    image: string[];
    price: number;
}

interface CartItem {
    product: ProductInCart;
    quantity: number;
    itemTotal: number;
}

interface CartSummary {
    totalItems: number;
    totalPrice: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartSummary: CartSummary | null;
    loadingCart: boolean;
    errorCart: string | null;
    fetchCartDetails: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<boolean>;
    updateCartQuantity: (productId: string, newQuantity: number) => Promise<boolean>;
    removeFromCart: (productId: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const [errorCart, setErrorCart] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth(); // Get authentication state

    const fetchCartDetails = useCallback(async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            setCartSummary(null);
            setLoadingCart(false);
            return;
        }

        setLoadingCart(true);
        setErrorCart(null);
        try {
            const response = await api.get('/api/users/cart');
            setCartItems(response.data.cartDetails);
            setCartSummary(response.data.cartSummary);
        } catch (err: any) {
            console.error('Error fetching cart details:', err);
            setErrorCart(err.response?.data?.message || 'Failed to load cart.');
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCartDetails();
    }, [fetchCartDetails, user]); // Re-fetch when auth status or user changes

    const addToCart = async (productId: string, quantity: number): Promise<boolean> => {
        if (!isAuthenticated) {
            setErrorCart('Please login to add items to cart.');
            return false;
        }
        try {
            await api.post('/api/users/cart/add', { productId, quantity });
            await fetchCartDetails(); // Re-fetch cart after adding
            return true;
        } catch (err: any) {
            console.error('Error adding to cart:', err);
            setErrorCart(err.response?.data?.message || 'Failed to add item to cart.');
            return false;
        }
    };

    const updateCartQuantity = async (productId: string, newQuantity: number): Promise<boolean> => {
        if (!isAuthenticated) {
            setErrorCart('Please login to update cart.');
            return false;
        }
        try {
            await api.put('/api/users/cart/update', { productId, quantity: newQuantity });
            await fetchCartDetails(); // Re-fetch cart after update
            return true;
        } catch (err: any) {
            console.error('Error updating cart quantity:', err);
            setErrorCart(err.response?.data?.message || 'Failed to update cart quantity.');
            return false;
        }
    };

    const removeFromCart = async (productId: string): Promise<boolean> => {
        if (!isAuthenticated) {
            setErrorCart('Please login to remove items from cart.');
            return false;
        }
        try {
            await api.post('/api/users/cart/remove', { productId }); // Use POST as per your backend
            await fetchCartDetails(); // Re-fetch cart after removal
            return true;
        } catch (err: any) {
            console.error('Error removing from cart:', err);
            setErrorCart(err.response?.data?.message || 'Failed to remove item from cart.');
            return false;
        }
    };

    const value = {
        cartItems,
        cartSummary,
        loadingCart,
        errorCart,
        fetchCartDetails,
        addToCart,
        updateCartQuantity,
        removeFromCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
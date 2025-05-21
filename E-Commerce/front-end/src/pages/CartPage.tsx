// src/pages/CartPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    IconButton,
    CircularProgress,
    Divider,
    Alert,
    Card,
    CardContent,
    CardMedia,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    product: {
        id: string;
        name: string;
        image: string[];
        price: number;
    };
    quantity: number;
    itemTotal: number;
}

interface CartSummary {
    totalItems: number;
    totalPrice: number;
}

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }
        fetchCartDetails();
    }, [isAuthenticated, navigate]);

    const fetchCartDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/users/cart');
            setCartItems(response.data.cartDetails);
            setCartSummary(response.data.cartSummary);
        } catch (err: any) {
            console.error('Error fetching cart details:', err);
            setError(err.response?.data?.message || 'Failed to load cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 0) return; // Prevent negative quantity

        try {
            // Optimistically update UI
            setCartItems(prevItems =>
                prevItems
                    .map(item =>
                        item.product.id === productId
                            ? { ...item, quantity: newQuantity, itemTotal: item.product.price * newQuantity }
                            : item
                    )
                    .filter(item => item.quantity > 0) // Remove if quantity becomes 0
            );

            // Recalculate summary optimistically
            setCartSummary(prevSummary => {
                if (!prevSummary) return null;
                const updatedTotalItems = cartItems.reduce((sum, item) =>
                    item.product.id === productId ? sum + newQuantity : sum + item.quantity
                    , 0);
                const updatedTotalPrice = cartItems.reduce((sum, item) =>
                    item.product.id === productId ? sum + (item.product.price * newQuantity) : sum + item.itemTotal
                    , 0);
                return { totalItems: updatedTotalItems, totalPrice: updatedTotalPrice };
            });


            await api.put('/api/users/cart/update', { productId, quantity: newQuantity });
            fetchCartDetails(); // Re-fetch to ensure consistency with backend
        } catch (err: any) {
            console.error('Error updating cart quantity:', err);
            setError(err.response?.data?.message || 'Failed to update cart. Please try again.');
            fetchCartDetails(); // Revert to backend state on error
        }
    };

    const handleRemoveItem = async (productId: string) => {
        try {
            // Optimistically update UI
            setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
            // Recalculate summary optimistically (more complex, consider re-fetching for simplicity)
            // For now, let's just re-fetch after successful removal

            await api.post('/api/users/cart/remove', { productId });
            fetchCartDetails(); // Re-fetch to ensure consistency with backend
        } catch (err: any) {
            console.error('Error removing item from cart:', err);
            setError(err.response?.data?.message || 'Failed to remove item. Please try again.');
            fetchCartDetails(); // Revert to backend state on error
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading cart...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button variant="contained" onClick={fetchCartDetails} sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Container>
        );
    }

    if (cartItems.length === 0) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">Your cart is empty.</Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Shopping Cart
            </Typography>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                {/* First Grid item - Cart Items List */}
                <Box flex={2}>
                    {cartItems.map((item) => (
                        <Paper key={item.product.id} elevation={1} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 100, height: 100, objectFit: 'contain', mr: 2 }}
                                image={item.product.image && item.product.image.length > 0 ? item.product.image[0] : '/placeholder-image.png'} // Add a placeholder
                                alt={item.product.name}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{item.product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price: ₹{item.product.price.toLocaleString('en-IN')}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <Button
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleRemoveItem(item.product.id)}
                                        sx={{ ml: 2 }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </Box>
                            <Typography variant="h6" sx={{ ml: 'auto' }}>
                                ₹{item.itemTotal.toLocaleString('en-IN')}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
                {/* Second Grid item - Cart Summary */}
                <Box flex={1}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Cart Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Total Items:</Typography>
                            <Typography>{cartSummary?.totalItems}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total Price:</Typography>
                            <Typography variant="h6">₹{cartSummary?.totalPrice?.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Button variant="contained" color="primary" fullWidth>
                            Proceed to Checkout
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default CartPage;
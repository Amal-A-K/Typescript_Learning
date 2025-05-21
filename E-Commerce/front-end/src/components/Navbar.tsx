import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const { cartSummary, loadingCart } = useCart();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const cartItemCount = cartSummary ? cartSummary.totalItems : 0;

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    E-Commerce
                </Typography>
                {isAuthenticated ? (
                    <>
                        <IconButton color="inherit" onClick={() => navigate('/cart')}>
                            <Badge badgeContent={loadingCart ? 0 : cartItemCount} color="error">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                        <Button color="inherit" onClick={() => navigate('/profile')}>
                            {user?.name}
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

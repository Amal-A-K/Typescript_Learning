import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, MenuItem, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductService from '../services/product.service';
import { Product } from '../types/product';
import { useAuth } from '../contexts/AuthContext';

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Phone'];

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ProductService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: string) => {
        if (!isAuthenticated) {
            alert('Please login to add items to cart');
            return;
        }
        // Cart functionality will be implemented later
        console.log('Adding to cart:', productId);
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = category === 'All' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Our Products
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
                    <Box>
                        <TextField
                            fullWidth
                            label="Search products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                    {filteredProducts.map((product) => (
                        <Box key={product._id}>
                            <ProductCard
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
};

export default Home;

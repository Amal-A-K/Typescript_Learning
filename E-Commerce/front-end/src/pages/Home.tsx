import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    MenuItem,
    Box,
    Skeleton,
    Button,
    IconButton
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductService from '../services/product.service';
import { Product } from '../types/product';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Phone'];

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ProductService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: string) => {
        if (!isAuthenticated) {
            toast.warn('Please login to add items to cart');
            return;
        }
        const success = await addToCart(productId, 1);
        if (success) {
            toast.success('Product added to cart!');
        } else {
            toast.error('Failed to add product to cart.');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategory('All');
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = category === 'All' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(300px, 1fr))' }, gap: 3 }}>
                    {[...Array(6)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height={350} />
                    ))}
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: 'primary.main',
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                    pb: 1
                }}
            >
                Our Products
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' }
            }}>
                <TextField
                    fullWidth
                    label="Search products"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: searchTerm && (
                            <IconButton onClick={() => setSearchTerm('')} size="small">
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.paper',
                        }
                    }}
                />

                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                    <TextField
                        select
                        fullWidth
                        label="Category"
                        variant="outlined"
                        size="small"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{
                            minWidth: 180,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'background.paper',
                            }
                        }}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>

                    {(searchTerm || category !== 'All') && (
                        <Button
                            onClick={clearFilters}
                            variant="outlined"
                            size="small"
                            sx={{
                                whiteSpace: 'nowrap',
                                flexShrink: 0 // Prevent button from shrinking
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>
            </Box>

            {filteredProducts.length === 0 ? (
                <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
                    No products found. Try adjusting your search or category filters.
                </Typography>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(auto-fill, minmax(300px, 1fr))'
                    },
                    gap: 3,
                    alignItems: 'stretch'
                }}>
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default Home;
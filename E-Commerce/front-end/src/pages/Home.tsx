// import React, { useEffect, useState } from 'react';
// import { Container, Typography, TextField, MenuItem, Box } from '@mui/material';
// import ProductCard from '../components/ProductCard';
// import ProductService from '../services/product.service';
// import { Product } from '../types/product';
// import { useAuth } from '../contexts/AuthContext';
// import { useCart } from '../contexts/CartContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Phone'];

// const Home = () => {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [category, setCategory] = useState('All');
//     const [searchTerm, setSearchTerm] = useState('');
//     const { isAuthenticated } = useAuth();
//     const { addToCart } = useCart();

//     useEffect(() => {
//         loadProducts();
//     }, []);

//     const loadProducts = async () => {
//         try {
//             const data = await ProductService.getAllProducts();
//             setProducts(data);
//         } catch (error) {
//             console.error('Error loading products:', error);
//             toast.error('Failed to load products.'); 
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddToCart = async (productId: string) => {
//         if (!isAuthenticated) {
//             toast.warn('Please login to add items to cart');
//             return;
//         }
//         const success = await addToCart(productId, 1); // Add 1 quantity by default
//         if (success) {
//             toast.success('Product added to cart!');
//         } else {
//             toast.error('Failed to add product to cart.');
//         }
//     };

//     const filteredProducts = products.filter(product => {
//         const matchesCategory = category === 'All' || product.category === category;
//         const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             product.description.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesCategory && matchesSearch;
//     });

//     if (loading) {
//         return <Typography>Loading...</Typography>;
//     }

//     return (
//         <Container>
//             <Box sx={{ my: 4 }}>
//                 <Typography variant="h4" gutterBottom>
//                     Products
//                 </Typography>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
//                     <Box>
//                         <TextField
//                             fullWidth
//                             label="Search products"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </Box>
//                     <Box>
//                         <TextField
//                             select
//                             fullWidth
//                             label="Category"
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                         >
//                             {categories.map((cat) => (
//                                 <MenuItem key={cat} value={cat}>
//                                     {cat}
//                                 </MenuItem>
//                             ))}
//                         </TextField>
//                     </Box>
//                 </Box>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
//                     {filteredProducts.map((product) => (
//                         <Box key={product._id}>
//                             <ProductCard
//                                 product={product}
//                                 onAddToCart={handleAddToCart}
//                             />
//                         </Box>
//                     ))}
//                 </Box>
//             </Box>
//         </Container>
//     );
// };

// export default Home;
// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, MenuItem, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductService from '../services/product.service';
import { Product } from '../types/product';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; // Import useCart
import { toast } from 'react-toastify'; // Consider using a toast notification library
import 'react-toastify/dist/ReactToastify.css';

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Phone'];

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart(); // Use addToCart from CartContext

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ProductService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Failed to load products.'); // Use toast for user feedback
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: string) => {
        if (!isAuthenticated) {
            toast.warn('Please login to add items to cart');
            return;
        }
        const success = await addToCart(productId, 1); // Add 1 quantity by default
        if (success) {
            toast.success('Product added to cart!');
        } else {
            toast.error('Failed to add product to cart.');
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = category === 'All' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Products
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Box sx={{ flexGrow: 1 }}>
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
        </Container>
    );
};

export default Home;
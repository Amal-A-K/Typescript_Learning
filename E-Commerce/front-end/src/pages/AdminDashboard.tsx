import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Box,
    Tab,
    Tabs,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField
} from '@mui/material';
import api from '../services/api';
import { Product, CartData } from '../types/product';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        image: '',
    });
    const [cartDialogOpen, setCartDialogOpen] = useState(false);
    const [currentUserCart, setCurrentUserCart] = useState<CartData | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if (tabValue === 0) {
            loadProducts();
        } else {
            loadUsers();
        }
    }, [tabValue]);

    const loadProducts = async () => {
        try {
            const response = await api.get('/products/getProducts');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await api.get('/admin/getAllUsers');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', description: '', stock: '', image: '' });
        setOpenDialog(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: String(product.price),
            category: product.category,
            description: product.description,
            stock: String(product.stock),
            image: Array.isArray(product.image) ? product.image[0] || '' : product.image || '',
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProduct(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenCart = async (userId: string) => {
        try {
            setCurrentUserId(userId);
            const response = await api.get(`/admin/users/${userId}/cart`);
            setCurrentUserCart(response.data.cart);
            setCartDialogOpen(true);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const handleCloseCartDialog = () => {
        setCartDialogOpen(false);
        setCurrentUserCart(null);
        setCurrentUserId(null);
    };

    const handleUpdateCartItem = async (productId: string, newQuantity: number) => {
        if (!currentUserId) return;

        try {
            await api.put(`/admin/users/${currentUserId}/cart`, {
                productId,
                quantity: newQuantity
            });
            // Refresh cart data
            const response = await api.get(`/admin/users/${currentUserId}/cart`);
            setCurrentUserCart(response.data.cart);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const handleRemoveFromCart = async (productId: string) => {
        if (!currentUserId) return;

        try {
            await api.delete(`/admin/users/${currentUserId}/cart/${productId}`);
            // Refresh cart data
            const response = await api.get(`/admin/users/${currentUserId}/cart`);
            setCurrentUserCart(response.data.cart);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const handleSubmitProduct = async () => {
        try {
            if (editingProduct) {
                // Update product
                await api.put(`/products/updateProduct/${editingProduct._id}`, formData);
            } else {
                // Create new product
                await api.post('/products/createProduct', formData);
            }
            loadProducts();
            handleCloseDialog();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/deleteProduct/${productId}`);
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Admin Dashboard
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Products" />
                    <Tab label="Users" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2 }}
                    onClick={handleOpenAdd}
                >
                    Add New Product
                </Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <img
                                            src={Array.isArray(product.image) ? product.image[0] || '' : product.image || ''}
                                            alt={product.name}
                                            style={{
                                                maxWidth: '50px',
                                                maxHeight: '50px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            sx={{ mr: 1 }}
                                            onClick={() => handleOpenEdit(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Cart</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            style={{
                                                maxWidth: '50px',
                                                maxHeight: '50px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            size='medium'
                                            color='secondary'
                                            onClick={() => handleOpenCart(user._id)}
                                            disabled={!user.cartData || Object.keys(user.cartData).length === 0}
                                        >
                                            View Cart ({user.cartData ? Object.keys(user.cartData).length : 0})
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth={true}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, paddingBottom: 2 }}>
                        {(formData.image && formData.image.length > 0) && (
                            <img
                                src={formData.image}
                                alt={formData.name}
                                style={{
                                    maxWidth: '150px',
                                    maxHeight: '150px',
                                    objectFit: 'contain',
                                    marginBottom: '15px',
                                    alignSelf: 'center'
                                }}
                            />
                        )}
                        <TextField
                            label="Name"
                            name="name"
                            type='string'
                            value={formData.name}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Category"
                            name="category"
                            type='string'
                            value={formData.category}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Image"
                            name="image"
                            type="text"
                            value={formData.image}
                            onChange={handleFormChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmitProduct} variant="contained">
                        {editingProduct ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Cart Details Dialog */}
            <Dialog
                open={cartDialogOpen}
                onClose={handleCloseCartDialog}
                maxWidth='md'
                fullWidth
            >
                <DialogTitle>User Cart Details</DialogTitle>
                <DialogContent>
                    {currentUserCart ? (
                        currentUserCart.items.length > 0 ? (
                            <>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Total</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentUserCart.items.map((item) => (
                                                <TableRow key={item.productId}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            {item.image && (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{
                                                                        width: 50,
                                                                        height: 50,
                                                                        marginRight: 10,
                                                                        objectFit: 'cover'
                                                                    }}
                                                                />
                                                            )}
                                                            {item.name}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>₹{item.price.toLocaleString('en-IN')}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleUpdateCartItem(
                                                                    item.productId,
                                                                    parseInt(e.target.value) || 0
                                                                )
                                                            }
                                                            inputProps={{ min: 0 }}
                                                            size="small"
                                                            style={{ width: 70 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>₹{(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            color="error"
                                                            onClick={() => handleRemoveFromCart(item.productId)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box mt={2} textAlign="right">
                                    <Typography variant="h6">
                                        Grand Total: ₹{currentUserCart.total.toLocaleString('en-IN')}
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <DialogContentText>The cart is empty</DialogContentText>
                        )
                    ) : (
                        <DialogContentText>Loading cart data...</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCartDialog}>Close</Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default AdminDashboard;

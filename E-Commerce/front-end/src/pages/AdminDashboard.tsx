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

interface FormDataState {
    name: string;
    price: string;
    category: string;
    description: string;
    stock: string;
    image: string;
    imageFiles: FileList | null;
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
    const [formData, setFormData] = useState<FormDataState>({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        image: '',
        imageFiles: null,
    });
    const [cartDialogOpen, setCartDialogOpen] = useState(false);
    const [currentUserCart, setCurrentUserCart] = useState<CartData | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const [deleteUserConfirmOpen, setDeleteUserConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const [deleteProductConfirmOpen, setDeleteProductConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

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
        setFormData({ name: '', price: '', category: '', description: '', stock: '', image: '', imageFiles: null });
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
            imageFiles: null
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProduct(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'imageFiles' && e.target.files) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
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
            const formDataToSend = new FormData();

            // Append all text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'imageFiles' && value !== null) {
                    formDataToSend.append(key, value.toString());
                }
            });

            // Append files if they exist
            if (formData.imageFiles) {
                Array.from(formData.imageFiles).forEach((file: File) => {
                    formDataToSend.append('image', file);
                });
            }

            if (editingProduct) {
                // Update product
                await api.put(`/products/updateProduct/${editingProduct._id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Create new product
                await api.post('/products/createProduct', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            loadProducts();
            handleCloseDialog();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    // Product deletion handler
    const handleDeleteProductClick = (productId: string) => {
        setProductToDelete(productId);
        setDeleteProductConfirmOpen(true);
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            await api.delete(`/products/deleteProduct/${productToDelete}`);
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setDeleteProductConfirmOpen(false);
            setProductToDelete(null);
        }
    };

    const handleCancelDeleteProduct = () => {
        setDeleteProductConfirmOpen(false);
        setProductToDelete(null);
    };

    // admin user deletion handler
    const handleDeleteClick = (userId: string) => {
        setUserToDelete(userId);
        setDeleteUserConfirmOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`/admin/users/${userToDelete}`);
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeleteUserConfirmOpen(false);
            setUserToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteUserConfirmOpen(false);
        setUserToDelete(null);
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
                                            className='image'
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
                                            onClick={() => handleDeleteProductClick(product._id)}
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
                                            onClick={() => handleDeleteClick(user._id)}
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
                        {/* <TextField
                            label="Image"
                            name="image"
                            type="file"
                            value={formData.image}
                            onChange={handleFormChange}
                        /> */}
                        <TextField
                            label="Image URL"
                            name="image"
                            type="text"
                            value={formData.image}
                            onChange={handleFormChange}
                            fullWidth
                        />
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>OR</Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                        >
                            Upload Image
                            <input
                                type="file"
                                name="imageFiles"
                                hidden
                                accept="image/*"
                                onChange={handleFormChange}
                                multiple
                            />
                        </Button>
                        {formData.imageFiles && (
                            <Typography variant="caption">
                                {formData.imageFiles.length} file(s) selected
                            </Typography>
                        )}
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
            {/* Delete Product Confirmation Dialog */}
            <Dialog
                open={deleteProductConfirmOpen}
                onClose={handleCancelDeleteProduct}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    {productToDelete && (() => {
                        const product = products.find(u => u._id === productToDelete);
                        return (
                            <>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure want to delete product{' '}
                                    <strong>{product?.name}</strong> ?
                                </DialogContentText>
                                <DialogContentText>
                                    This action cannot be undone.
                                </DialogContentText>
                            </>
                        );
                    })()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDeleteProduct}>Cancel</Button>
                    <Button onClick={handleDeleteProduct} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteUserConfirmOpen}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    {userToDelete && (() => {
                        const user = users.find(u => u._id === userToDelete);
                        return (
                            <>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure want to delete user{' '}
                                    <strong>{user?.name}</strong> ({user?.email})?
                                </DialogContentText>
                                <DialogContentText>
                                    This action cannot be undone.
                                </DialogContentText>
                            </>
                        );
                    })()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleDeleteUser} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;

// import React, { useState } from 'react';
// import {
//     AppBar,
//     Toolbar,
//     Typography,
//     Button,
//     IconButton,
//     Badge,
//     Box,
//     Menu,
//     MenuItem,
//     useMediaQuery,
//     useTheme
// } from '@mui/material';
// import {
//     ShoppingCart,
//     Menu as MenuIcon,
//     AccountCircle
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { useCart } from '../contexts/CartContext';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const { user, logout, isAuthenticated } = useAuth();
//     const { cartSummary, loadingCart } = useCart();
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleLogout = () => {
//         handleMenuClose();
//         logout();
//         navigate('/login');
//     };

//     const cartItemCount = cartSummary ? cartSummary.totalItems : 0;

//     return (
//         <AppBar position="static" elevation={1}>
//             <Toolbar sx={{
//                 justifyContent: 'space-between',
//                 padding: { xs: '0 8px', sm: '0 16px' }
//             }}>
//                 <Typography
//                     variant="h6"
//                     component="div"
//                     sx={{
//                         fontWeight: 700,
//                         cursor: 'pointer',
//                         flexGrow: { xs: 1, sm: 0 }
//                     }}
//                     onClick={() => navigate('/')}
//                 >
//                     E-Commerce
//                 </Typography>

//                 {isMobile ? (
//                     <>
//                         <IconButton color="inherit" onClick={() => navigate('/cart')}>
//                             <Badge badgeContent={loadingCart ? 0 : cartItemCount} color="error">
//                                 <ShoppingCart />
//                             </Badge>
//                         </IconButton>
//                         <IconButton
//                             size="large"
//                             aria-label="account of current user"
//                             aria-controls="menu-appbar"
//                             aria-haspopup="true"
//                             onClick={handleMenuOpen}
//                             color="inherit"
//                         >
//                             <MenuIcon />
//                         </IconButton>
//                         <Menu
//                             id="menu-appbar"
//                             anchorEl={anchorEl}
//                             anchorOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'right',
//                             }}
//                             keepMounted
//                             transformOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'right',
//                             }}
//                             open={Boolean(anchorEl)}
//                             onClose={handleMenuClose}
//                         >
//                             {isAuthenticated ? (
//                                 [
//                                     <MenuItem key="profile" onClick={() => { navigate('/profile'); handleMenuClose(); }}>
//                                         <AccountCircle sx={{ mr: 1 }} /> Profile
//                                     </MenuItem>,
//                                     <MenuItem key="logout" onClick={handleLogout}>
//                                         Logout
//                                     </MenuItem>
//                                 ]
//                             ) : (
//                                 [
//                                     <MenuItem key="login" onClick={() => { navigate('/login'); handleMenuClose(); }}>
//                                         Login
//                                     </MenuItem>,
//                                     <MenuItem key="register" onClick={() => { navigate('/register'); handleMenuClose(); }}>
//                                         Register
//                                     </MenuItem>
//                                 ]
//                             )}
//                         </Menu>
//                     </>
//                 ) : (
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         {isAuthenticated ? (
//                             <>
//                                 <IconButton color="inherit" onClick={() => navigate('/cart')} size="large">
//                                     <Badge badgeContent={loadingCart ? 0 : cartItemCount} color="error">
//                                         <ShoppingCart />
//                                     </Badge>
//                                 </IconButton>
//                                 <Button
//                                     color="inherit"
//                                     onClick={() => navigate('/profile')}
//                                     startIcon={<AccountCircle />}
//                                     sx={{ textTransform: 'none' }}
//                                 >
//                                     {user?.name}
//                                 </Button>
//                                 <Button
//                                     color="inherit"
//                                     onClick={handleLogout}
//                                     sx={{
//                                         ml: 1,
//                                         borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
//                                         borderRadius: 0,
//                                         pl: 2
//                                     }}
//                                 >
//                                     Logout
//                                 </Button>
//                             </>
//                         ) : (
//                             <>
//                                 <Button
//                                     color="inherit"
//                                     onClick={() => navigate('/login')}
//                                     sx={{
//                                         fontWeight: 600,
//                                         '&:hover': {
//                                             backgroundColor: 'rgba(255, 255, 255, 0.1)'
//                                         }
//                                     }}
//                                 >
//                                     Login
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     color="inherit"
//                                     onClick={() => navigate('/register')}
//                                     sx={{
//                                         ml: 1,
//                                         borderColor: 'rgba(255, 255, 255, 0.5)',
//                                         '&:hover': {
//                                             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                                             borderColor: 'rgba(255, 255, 255, 0.8)'
//                                         }
//                                     }}
//                                 >
//                                     Register
//                                 </Button>
//                             </>
//                         )}
//                     </Box>
//                 )}
//             </Toolbar>
//         </AppBar>
//     );
// };

// export default Navbar;
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Box,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
    Avatar
} from '@mui/material';
import {
    ShoppingCart,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const { cartSummary, loadingCart } = useCart();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/login');
    };

    const cartItemCount = cartSummary ? cartSummary.totalItems : 0;

    // Get user's first letter for avatar if no image
    const getAvatarContent = () => {
        if (user?.image && user.image.length > 0) {
            return (
                <Avatar
                    alt={user.name}
                    src={`http://localhost:5000${user.image[0]}`}
                    sx={{ width: 32, height: 32 }}
                />
            );
        } else if (user?.name) {
            return (
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main
                    }}
                >
                    {user.name.charAt(0).toUpperCase()}
                </Avatar>
            );
        }
        return (
            <Avatar sx={{ width: 32, height: 32 }} />
        );
    };

    return (
        <AppBar position="static" elevation={1}>
            <Toolbar sx={{
                justifyContent: 'space-between',
                padding: { xs: '0 8px', sm: '0 16px' }
            }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexGrow: { xs: 1, sm: 0 }
                    }}
                    onClick={() => navigate('/')}
                >
                    E-Commerce
                </Typography>

                {isMobile ? (
                    <>
                        <IconButton color="inherit" onClick={() => navigate('/cart')}>
                            <Badge badgeContent={loadingCart ? 0 : cartItemCount} color="error">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            color="inherit"
                        >
                            {getAvatarContent()}
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {isAuthenticated ? (
                                [
                                    <MenuItem key="profile" onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                                        Profile
                                    </MenuItem>,
                                    <MenuItem key="logout" onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                ]
                            ) : (
                                [
                                    <MenuItem key="login" onClick={() => { navigate('/login'); handleMenuClose(); }}>
                                        Login
                                    </MenuItem>,
                                    <MenuItem key="register" onClick={() => { navigate('/register'); handleMenuClose(); }}>
                                        Register
                                    </MenuItem>
                                ]
                            )}
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAuthenticated ? (
                            <>
                                <IconButton color="inherit" onClick={() => navigate('/cart')} size="large">
                                    <Badge badgeContent={loadingCart ? 0 : cartItemCount} color="error">
                                        <ShoppingCart />
                                    </Badge>
                                </IconButton>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate('/profile')}
                                    startIcon={getAvatarContent()}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {user?.name}
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={handleLogout}
                                    sx={{
                                        ml: 1,
                                        borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 0,
                                        pl: 2
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        ml: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderColor: 'rgba(255, 255, 255, 0.8)'
                                        }
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
// import React, { useState, useEffect } from 'react'; 
// import {
//     Container,
//     Paper,
//     Typography,
//     TextField,
//     Button,
//     Box,
//     Avatar,
//     Alert
// } from '@mui/material';
// import { useAuth } from '../contexts/AuthContext';
// import api from '../services/api';

// const Profile = () => {
//     const { user, updateUser } = useAuth();
//     const [editing, setEditing] = useState(false);
//     const [formData, setFormData] = useState({
//         name: user?.name || '',
//         email: user?.email || '',
//         currentPassword: '',
//         newPassword: '',
//     });
//     const [image, setImage] = useState<File | null>(null);

//     // Add this useEffect for debugging, if you haven't already
//     useEffect(() => {
//         console.log("User data in Profile component:", user);
//         if (user?.image && user.image.length > 0) {
//             console.log("User image URL from backend:", user.image[0]);
//             console.log("Constructed image SRC:", `http://localhost:5000${user.image[0]}`);
//         } else {
//             console.log("User has no image or image array is empty.");
//         }
//     }, [user]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setImage(e.target.files[0]);
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const updateData = new FormData();
//             updateData.append('name', formData.name);
//             updateData.append('email', formData.email);
//             // ... (rest of your handleSubmit logic)
//             if (image) {
//                 updateData.append('image', image); // Append the image file
//             }
//             const response = await api.put(`/users/${user?.id}`, updateData);
//             updateUser(response.data.user);
//             setEditing(false);
//         } catch (error) {
//             console.error("Error updating profile:", error);
//             // Handle error appropriately
//         }
//     };


//     return (
//         <Container maxWidth="sm" sx={{ mt: 4 }}>
//             <Paper elevation={3} sx={{ p: 4 }}>
//                 <Typography variant="h4" gutterBottom align="center">
//                     User Profile
//                 </Typography>

//                 {/* This is the part that displays the image */}
//                 {user?.image && user.image.length > 0 ? (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//                         <Avatar
//                             alt={user.name || 'User Avatar'}
//                             src={`http://localhost:5000${user.image[0]}`} // THIS IS THE KEY CHANGE
//                             sx={{ width: 120, height: 120, border: '2px solid #1976d2' }}
//                         />
//                     </Box>
//                 ) : (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//                         {/* Fallback for no image */}
//                         <Avatar
//                             alt="No Image"
//                             sx={{ width: 120, height: 120, border: '2px solid #ccc', bgcolor: '#e0e0e0' }}
//                         >
//                             {user?.name ? user.name[0].toUpperCase() : '?'}
//                         </Avatar>
//                     </Box>
//                 )}

//                 {/* Add a file input for image upload */}
//                 {editing && (
//                     <Box sx={{ mb: 2 }}>
//                         <input
//                             accept="image/*"
//                             style={{ display: 'none' }}
//                             id="raised-button-file"
//                             multiple
//                             type="file"
//                             onChange={handleImageChange}
//                         />
//                         <label htmlFor="raised-button-file">
//                             <Button variant="contained" component="span" fullWidth>
//                                 {image ? image.name : 'Upload New Image'}
//                             </Button>
//                         </label>
//                     </Box>
//                 )}

//                 {editing ? (
//                     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//                         <TextField
//                             fullWidth
//                             label="Name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             margin="normal"
//                             variant="outlined"
//                         />
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             name="email"
//                             type="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             margin="normal"
//                             variant="outlined"
//                         />
//                         <TextField
//                             fullWidth
//                             label="Current Password"
//                             name="currentPassword"
//                             type="password"
//                             value={formData.currentPassword}
//                             onChange={handleChange}
//                             margin="normal"
//                             variant="outlined"
//                         />
//                         <TextField
//                             fullWidth
//                             label="New Password"
//                             name="newPassword"
//                             type="password"
//                             value={formData.newPassword}
//                             onChange={handleChange}
//                             margin="normal"
//                             variant="outlined"
//                         />
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 type="submit"
//                             >
//                                 Save Changes
//                             </Button>
//                             <Button
//                                 variant="outlined"
//                                 onClick={() => setEditing(false)}
//                             >
//                                 Cancel
//                             </Button>
//                         </Box>
//                     </Box>
//                 ) : (
//                     <>
//                         <Box>
//                             <Typography variant="body1">
//                                 <strong>Name:</strong> {user?.name}
//                             </Typography>
//                         </Box>
//                         <Box>
//                             <Typography variant="body1">
//                                 <strong>Email:</strong> {user?.email}
//                             </Typography>
//                         </Box>
//                         <Box>
//                             <Typography variant="body1">
//                                 <strong>Role:</strong> {user?.role}
//                             </Typography>
//                         </Box>
//                         <Box>
//                             <Button
//                                 variant="contained"
//                                 onClick={() => setEditing(true)}
//                             >
//                                 Edit Profile
//                             </Button>
//                         </Box>
//                     </>
//                 )}
//             </Paper>
//         </Container>
//     );
// };

// export default Profile;
import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    Alert,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
    });
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                currentPassword: '',
                newPassword: '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            // If uploading new image, don't remove existing one
            setRemoveExistingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewImage(null);
        setRemoveExistingImage(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const updateData = new FormData();
            updateData.append('name', formData.name);
            updateData.append('email', formData.email);

            // Append image if new one was selected
            if (image) {
                updateData.append('image', image);
            }

            // If user wants to remove existing image without uploading new one
            if (removeExistingImage) {
                updateData.append('removeImage', 'true');
            }

            const response = await api.put(`/users/${user?.id}`, updateData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            updateUser(response.data.user);
            setEditing(false);
            setSuccessMessage('Profile updated successfully!');

            // Reset image states
            setImage(null);
            setPreviewImage(null);
            setRemoveExistingImage(false);

        } catch (error: any) {
            console.error("Error updating profile:", error);
            setErrorMessage(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    User Profile
                </Typography>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                {/* Image display and upload section */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative' }}>
                    {previewImage ? (
                        <Avatar
                            src={previewImage}
                            sx={{ width: 120, height: 120, border: '2px solid black' }}
                        />
                    ) : user?.image && user.image.length > 0 && !removeExistingImage ? (
                        <Avatar
                            alt={user.name || 'User Avatar'}
                            src={`http://localhost:5000${user.image[0]}`}
                            sx={{ width: 120, height: 120, border: '2px solid black' }}
                        />
                    ) : (
                        <Avatar
                            alt="No Image"
                            sx={{ width: 120, height: 120, border: '2px solid #ccc', bgcolor: '#e0e0e0' }}
                        >
                            {user?.name ? user.name[0].toUpperCase() : '?'}
                        </Avatar>
                    )}

                    {editing && (user?.image && user.image.length > 0 || previewImage) && (
                        
                        <IconButton
                            onClick={handleRemoveImage}
                            size="small"
                            sx={{
                                position: 'absolute',
                                right: 'calc(50% - 55px)',
                                bottom: 0,
                                color: 'gray.900',
                                backgroundColor: 'grey.300',
                                '&:hover': {
                                    backgroundColor: 'grey.500',
                                },
                                width: 28,
                                height: 28,
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>

                    )}
                </Box>

                {editing ? (
                    <>
                        {/* File input for image upload */}
                        <Box sx={{ mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" component="span" fullWidth>
                                    {image ? 'Change Image' : 'Upload Image'}
                                </Button>
                            </label>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                helperText="Required only if changing password"
                            />
                            <TextField
                                fullWidth
                                label="New Password"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setEditing(false);
                                        setImage(null);
                                        setPreviewImage(null);
                                        setRemoveExistingImage(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box>
                            <Typography variant="body1">
                                <strong>Name:</strong> {user?.name}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1">
                                <strong>Email:</strong> {user?.email}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1">
                                <strong>Role:</strong> {user?.role}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Profile;
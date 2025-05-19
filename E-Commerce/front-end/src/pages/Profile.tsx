import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
} from '@mui/material';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updateData = new FormData();
            updateData.append('name', formData.name);
            updateData.append('email', formData.email);
            if (formData.newPassword) {
                updateData.append('currentPassword', formData.currentPassword);
                updateData.append('newPassword', formData.newPassword);
            }
            if (image) {
                updateData.append('image', image);
            }

            const response = await api.put(`/users/${user?.id}`, updateData);
            updateUser(response.data.user);
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>                <Typography variant="h4" gutterBottom>
                    Profile
                </Typography>
                <Box 
                    component="form" 
                    onSubmit={handleSubmit}
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        width: '100%'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar
                            src={user?.image?.[0]}
                            sx={{ width: 120, height: 120 }}
                        />
                    </Box>                    {editing ? (
                        <>
                            <Box>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                >
                                    Upload New Photo
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Box>
                            <Box>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Box>                            <Box>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    fullWidth
                                    label="Current Password"
                                    name="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                        onChange={handleChange}
                                    />                            </Box>
                            <Box>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                            </>
                        ) : (
                            <>                                <Box>
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
                                <Box>
                                    <Button
                                        variant="contained"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>
                            </>                        )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;

import React from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password should be of minimum 6 characters')
        .required('Password is required'),
    isAdmin: yup
        .boolean()
        .required('User type is required'),
});

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            isAdmin: false
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {            try {
                await login(values.email, values.password, values.isAdmin);
                navigate(values.isAdmin ? '/admin' : '/');
            } catch (error: any) {
                console.error('Login error:', error);
                // Use formik.setFieldError to show field-specific errors
                if (error.response?.data?.errors) {
                    const { errors } = error.response.data;
                    Object.keys(errors).forEach(field => {
                        formik.setFieldError(field, errors[field]);
                    });
                } else {
                    // Show generic error
                    formik.setStatus(error.message || 'Login failed');
                }
            }
        },
    });    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Sign in
                </Typography>
                {formik.status && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {formik.status}
                    </Typography>
                )}
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="email"
                        name="email"
                        label="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />                    <TextField
                        fullWidth
                        margin="normal"
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />                    <Box sx={{ 
                        mt: 2, 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}>
                        <Button
                            type="button"
                            variant={formik.values.isAdmin ? "contained" : "outlined"}
                            size="small"
                            onClick={() => formik.setFieldValue('isAdmin', true)}
                            sx={{ flex: 1 }}
                        >
                            Admin Login
                        </Button>
                        <Button
                            type="button"
                            variant={!formik.values.isAdmin ? "contained" : "outlined"}
                            size="small"
                            onClick={() => formik.setFieldValue('isAdmin', false)}
                            sx={{ flex: 1 }}
                        >
                            User Login
                        </Button>
                    </Box>                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Signing in...' : 
                         formik.values.isAdmin ? 'Sign In as Admin' : 'Sign In as User'}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/register')}
                    >
                        Don't have an account? Sign Up
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;

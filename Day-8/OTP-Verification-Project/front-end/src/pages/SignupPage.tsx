import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface SignupFormValues {
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .required('Phone number is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await axios.post('http://localhost:5000/api/auth/signup', {
          fullName: values.username,
          phoneNumber: `+91${values.phone}`,
          email: values.email,
          password: values.password,
        });

        setOtpSent(true);
        alert(res.data.message);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Signup failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6, p: 4, border: '1px solid #ccc', borderRadius: 3 }}>
        <Typography variant="h5" mb={3} textAlign="center">Signup</Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {['username', 'phone', 'email', 'password', 'confirmPassword'].map((field, idx) => (
              <Grid item xs={12} key={idx}>
                <TextField
                  fullWidth
                  label={
                    field === 'confirmPassword'
                      ? 'Confirm Password'
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  name={field}
                  type={field.includes('password') ? 'password' : 'text'}
                  value={(formik.values as any)[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[field as keyof SignupFormValues] && Boolean(formik.errors[field as keyof SignupFormValues])}
                  helperText={formik.touched[field as keyof SignupFormValues] && formik.errors[field as keyof SignupFormValues]}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Signup & Send OTP'}
          </Button>
          {otpSent && (
            <Typography variant="body2" color="green" mt={2} align="center">
              OTP sent to your phone!
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default Signup;

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const imageUrl = product.image && product.image.length > 0 ? product.image[0] : '/placeholder-image.png'; // Add a placeholder image

    return (
        <Card sx={{
            height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s',
            '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
            },
        }}>
            <CardMedia
                component="img"
                sx={{
                    height: 180,
                    objectFit: 'contain',
                    pt: 2,
                    backgroundColor: '#f5f5f5'
                }}
                image={imageUrl}
                alt={product.name}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.png';
                    target.onerror = null;
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 1
                    }}
                    noWrap>
                    {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ₹{product.price.toLocaleString('en-IN')}
                </Typography>
            </CardContent>
            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => onAddToCart(product._id)}
                    sx={{
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark'
                        }
                    }}
                >
                    Add to Cart
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;
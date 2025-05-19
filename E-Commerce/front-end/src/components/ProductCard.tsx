import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardMedia
                component="img"
                height="140"
                image={product.image?.[0] ? `http://localhost:5000/${product.image[0]}` : 'https://via.placeholder.com/140'}
                alt={product.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => onAddToCart(product._id)}
                    sx={{ mt: 1 }}
                    fullWidth
                >
                    Add to Cart
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProductCard;

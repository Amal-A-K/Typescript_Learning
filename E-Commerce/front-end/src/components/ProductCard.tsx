// import React from 'react';
// import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
// import { Product } from '../types/product';

// interface ProductCardProps {
//     product: Product;
//     onAddToCart: (productId: string) => void;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
//     // const imageUrl = product.image?.[0]
//     //     ? `http://localhost:5000${product.image[0]}`
//     //     : 'https://via.placeholder.com/140';
//     //     console.log("image url",imageUrl);
//     // const getImageUrl = () => {
//     //     if (!product.image?.[0]) return 'https://via.placeholder.com/140';
        
//     //     // If the URL already starts with http, use it as-is
//     //     if (product.image[0].startsWith('http')) {
//     //         return product.image[0];
//     //     }
        
//     //     // Otherwise, prepend the local server URL
//     //     return `http://localhost:5000${product.image[0]}`;
//     // };

//     // const imageUrl = getImageUrl();
//      const imageUrl = product.image && product.image.length > 0 ? product.image[0] : '/placeholder-image.png'; // Add a placeholder image

//     console.log("Final image URL:", imageUrl);
//     return (
       
//         <Card sx={{ maxWidth: 345, m: 2 }}>
        
//             <CardMedia
//                 component="img"
//                 height="140"
//                 image={imageUrl}
//                 alt={product.name}
//                 sx={{
//                     objectFit: 'contain',
//                     height: 200, // Adjust height as needed
//                     backgroundColor: '#ffffff' 
//                 }}
//                 onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.src = 'https://via.placeholder.com/140';
//                     target.onerror = null; // Prevent infinite loop
//                 }}
                
//             />
//             <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                     {product.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     {product.description}
//                 </Typography>
//                 <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
//                     ₹{product.price.toLocaleString('en-IN')}
//                 </Typography>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => onAddToCart(product._id)}
//                     sx={{ mt: 1 }}
//                     fullWidth
//                 >
//                     Add to Cart
//                 </Button>
//             </CardContent>
//         </Card>
//     );
// };

// export default ProductCard;
// src/components/ProductCard.tsx (Example - adjust as per your actual component)
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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                sx={{ height: 180, objectFit: 'contain', pt: 2 }}
                image={imageUrl}
                alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
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
                >
                    Add to Cart
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;
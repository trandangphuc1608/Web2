import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Container, Grid, Typography, Button, Box, Paper, 
    IconButton, Rating, Divider, Skeleton, Alert 
} from '@mui/material';
import { 
    ShoppingCartOutlined, ArrowLeftOutlined, 
    PlusOutlined, MinusOutlined 
} from '@ant-design/icons';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getValidImage = (url) => {
        if (!url) return 'https://placehold.co/400x400?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        return `http://localhost:8900/api/catalog/${finalPath}`;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setError(null);

        fetch(`http://localhost:8900/api/catalog/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Không tìm thấy sản phẩm này!');
                return res.json();
            })
            .then(data => setProduct(data))
            .catch(err => {
                console.error("Lỗi lấy chi tiết sản phẩm:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
    const handleIncrease = () => setQuantity(prev => prev < 20 ? prev + 1 : 20);

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
        const productRealId = product.id || product.productId;
        const index = cart.findIndex(item => (item.product.id || item.product.productId) === productRealId);

        if (index >= 0) cart[index].quantity += quantity;
        else cart.push({ product: product, quantity: quantity });

        localStorage.setItem('rainbow_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); 
        alert(`Đã thêm ${quantity} phần "${product.productName || product.name}" vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Skeleton variant="rounded" width={300} height={300} />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Skeleton variant="text" height={60} width="90%" />
                            <Skeleton variant="text" height={40} width="50%" />
                            <Skeleton variant="rectangular" height={100} sx={{ mt: 3, borderRadius: 2 }} />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
                <Button variant="contained" component={Link} to="/">Quay về thực đơn</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button 
                startIcon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)} 
                sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}
            >
                Quay lại thực đơn
            </Button>

            <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                <Grid container spacing={4} alignItems="flex-start">

                    {/* ẢNH */}
                    <Grid 
                        item 
                        xs={12} sm={5} 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Box 
                            component="img"
                            src={getValidImage(product.imageUrl || product.image || product.picture)}
                            alt={product.productName || product.name}
                            sx={{ 
                                width: '100%', 
                                maxWidth: '350px', 
                                aspectRatio: '1 / 1', 
                                objectFit: 'cover', 
                                borderRadius: 3,
                                border: '1px solid #f0f0f0',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.08)' 
                            }}
                        />
                    </Grid>

                    {/* TEXT */}
                    <Grid 
                        item 
                        xs={12} sm={7} 
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            height: 'auto'
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
                            {product.productName || product.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Rating value={5} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                                (Khách hàng yêu thích)
                            </Typography>
                        </Box>

                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#FF512F', mb: 2 }}>
                            {(product.price || 0).toLocaleString('vi-VN')} ₫
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {product.description || 'Món ăn ngon tuyệt vời.'}
                        </Typography>

                        <Divider sx={{ mb: 3, width: '100%' }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                                <IconButton onClick={handleDecrease}><MinusOutlined /></IconButton>
                                <Typography sx={{ px: 2 }}>{quantity}</Typography>
                                <IconButton onClick={handleIncrease}><PlusOutlined /></IconButton>
                            </Box>

                            <Button 
                                variant="contained"
                                startIcon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                sx={{ flexGrow: 1 }}
                            >
                                Thêm {((product.price || 0) * quantity).toLocaleString('vi-VN')} ₫
                            </Button>
                        </Box>
                    </Grid>

                </Grid>
            </Paper>
        </Container>
    );
}
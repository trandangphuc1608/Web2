import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { 
    Grid, Card, CardMedia, CardContent, CardActions, 
    Typography, Button, CircularProgress, Box, Chip, 
    TextField, InputAdornment 
} from '@mui/material';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ĐÃ SỬA: Dùng 127.0.0.1 để tránh lỗi ERR_CONNECTION_REFUSED
        fetch(`http://127.0.0.1:8900/api/catalog/products?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                // ĐÃ SỬA: Bọc thép dữ liệu để tránh lỗi API trả về mảng bọc ngoài
                let actualData = [];
                if (Array.isArray(data)) actualData = data;
                else if (data && Array.isArray(data.data)) actualData = data.data;
                else if (data && data._embedded && Array.isArray(data._embedded.products)) actualData = data._embedded.products;
                else if (data && Array.isArray(data.content)) actualData = data.content;

                setProducts(actualData);
            })
            .catch((err) => {
                console.error("Lỗi tải dữ liệu:", err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAddToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
        const index = cart.findIndex(item => item.product.id === (product.id || product.productId));

        if (index >= 0) cart[index].quantity += 1;
        else cart.push({ product: product, quantity: 1 });
        
        localStorage.setItem('rainbow_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); 
        alert(`Đã thêm "${product.productName || product.name}" vào giỏ hàng!`);
    };

    const getValidImage = (url) => {
        if (!url) return 'https://placehold.co/400x300?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;

        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        // ĐÃ SỬA: Dùng 127.0.0.1
        return `http://127.0.0.1:8900/api/catalog/${finalPath}`;
    };

    const filteredProducts = products.filter(product => {
        const name = product.productName || product.name || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainCard 
            title="Thực đơn của chúng tôi"
            contentSX={{ p: 2 }}   
        >
            {/* Search */}
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                <TextField 
                    variant="outlined" 
                    placeholder="Tìm món ăn..." 
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined />
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: { xs: '100%', sm: '260px' } }}
                />
            </Box>

            {filteredProducts.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ py: 5 }}>
                    Không tìm thấy món ăn nào phù hợp!
                </Typography>
            ) : (
                <Grid container spacing={1.5}> 
                    {filteredProducts.map((product) => {
                        const productId = product.id || product.productId;

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={productId} sx={{ display: 'flex' }}>
                                
                                <Card 
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 2,
                                        transition: '0.2s',
                                        '&:hover': { 
                                            transform: 'translateY(-3px)', 
                                            boxShadow: 3 
                                        }
                                    }}
                                >
                                    <Box 
                                        component={Link}
                                        to={`/product/${productId}`}
                                        sx={{ 
                                            textDecoration: 'none', 
                                            color: 'inherit',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexGrow: 1
                                        }}
                                    >
                                        <CardMedia 
                                            component="img"
                                            image={getValidImage(product.imageUrl || product.image || product.picture)}
                                            alt={product.productName || product.name}
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = 'https://placehold.co/400x300?text=Loi+Anh'; 
                                            }}
                                            sx={{ 
                                                width: '100%',
                                                aspectRatio: '4 / 3',
                                                maxHeight: 195,
                                                objectFit: 'cover'
                                            }}
                                        />

                                        <CardContent 
                                            sx={{ 
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                p: 1.5  
                                            }}
                                        >
                                            <Typography 
                                                variant="subtitle1"
                                                sx={{ 
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {product.productName || product.name}
                                            </Typography>

                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    mb: 1,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {product.description || 'Ngon tuyệt hảo!'}
                                            </Typography>

                                            <Box sx={{ mt: 'auto' }}>
                                                <Chip 
                                                    label={`${(product.price || 0).toLocaleString('vi-VN')} ₫`}
                                                    color="primary"
                                                    size="small"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Box>

                                    <CardActions sx={{ p: 1.5, pt: 0 }}>
                                        <Button 
                                            variant="contained"
                                            fullWidth
                                            size="small"
                                            startIcon={<ShoppingCartOutlined />}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Thêm vào giỏ
                                        </Button>
                                    </CardActions>
                                </Card>

                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </MainCard>
    );
}
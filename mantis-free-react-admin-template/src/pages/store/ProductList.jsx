import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import { 
    Card, CardMedia, CardContent, CardActions, 
    Typography, Button, CircularProgress, Box, Chip, 
    TextField, InputAdornment 
} from '@mui/material';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả'); // State lưu danh mục đang chọn
    const [loading, setLoading] = useState(true);

    // Tông màu chủ đạo của RainbowFood
    const primaryColor = '#ff4d4f'; 
    const hoverColor = '#d9363e';

    useEffect(() => {
        fetch(`${API_URL}/api/catalog/products?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
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
        return `${API_URL}/api/catalog/${finalPath}`;
    };

    // Tự động trích xuất danh sách các Category độc nhất từ Products
    const categories = useMemo(() => {
        const allCategories = products.map(p => {
            if (typeof p.category === 'string') return p.category;
            if (p.category && p.category.name) return p.category.name;
            return 'Khác';
        });
        // Lấy các giá trị độc nhất và thêm chữ "Tất cả" lên đầu
        return ['Tất cả', ...new Set(allCategories.filter(Boolean))];
    }, [products]);

    // Lọc sản phẩm theo Tên (Search) VÀ Danh mục (Category)
    const filteredProducts = products.filter(product => {
        const name = product.productName || product.name || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        
        let catName = 'Khác';
        if (typeof product.category === 'string') catName = product.category;
        else if (product.category && product.category.name) catName = product.category.name;

        const matchesCategory = selectedCategory === 'Tất cả' || catName === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress sx={{ color: primaryColor }} />
            </Box>
        );
    }

    return (
        <MainCard 
            title="Thực đơn của chúng tôi"
            contentSX={{ p: 2 }}   
        >
            {/* THÀNH PHẦN ĐIỀU HƯỚNG: LỌC DANH MỤC & TÌM KIẾM */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2 }}>
                
                {/* Dải nút Lọc Danh Mục */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        overflowX: 'auto', 
                        pb: 0.5,
                        '&::-webkit-scrollbar': { height: '6px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e0e0', borderRadius: '4px' }
                    }}
                >
                    {categories.map((cat, index) => (
                        <Chip
                            key={index}
                            label={cat}
                            onClick={() => setSelectedCategory(cat)}
                            sx={{
                                fontWeight: selectedCategory === cat ? 700 : 500,
                                bgcolor: selectedCategory === cat ? primaryColor : '#f5f5f5',
                                color: selectedCategory === cat ? '#fff' : 'text.primary',
                                border: '1px solid',
                                borderColor: selectedCategory === cat ? primaryColor : '#e0e0e0',
                                '&:hover': { 
                                    bgcolor: selectedCategory === cat ? hoverColor : '#ffeae9',
                                    color: selectedCategory === cat ? '#fff' : primaryColor,
                                    borderColor: selectedCategory === cat ? hoverColor : primaryColor
                                },
                                transition: 'all 0.2s ease',
                                px: 1
                            }}
                        />
                    ))}
                </Box>

                {/* Thanh Tìm Kiếm */}
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
                    sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}
                />
            </Box>

            {/* LƯỚI SẢN PHẨM (Đã dọn dẹp các mảng Grid lồng nhau thừa thãi) */}
            {filteredProducts.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    Không tìm thấy món ăn nào phù hợp!
                </Typography>
            ) : (
                <Box 
                    sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { 
                            xs: 'repeat(1, 1fr)', // Điện thoại: 1 món / dòng
                            sm: 'repeat(2, 1fr)', // Tablet dọc: 2 món / dòng
                            md: 'repeat(3, 1fr)', // Tablet ngang: 3 món / dòng
                            lg: 'repeat(4, 1fr)'  // Màn hình máy tính: BẮT BUỘC 4 món / dòng
                        }, 
                        gap: 3 
                    }}
                > 
                    {filteredProducts.map((product) => {
                        const productId = product.id || product.productId;

                        return (
                            <Box key={productId} sx={{ display: 'flex', width: '100%' }}>
                                <Card 
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #f0f0f0',
                                        boxShadow: 'none',
                                        '&:hover': { 
                                            transform: 'translateY(-5px)', 
                                            boxShadow: '0 8px 24px rgba(255, 77, 79, 0.15)',
                                            borderColor: '#ffa39e'
                                        },
                                        '&:hover .MuiCardMedia-root': {
                                            transform: 'scale(1.08)'
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
                                        <Box sx={{ overflow: 'hidden', width: '100%', aspectRatio: '4 / 3', maxHeight: 200 }}>
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
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease' 
                                                }}
                                            />
                                        </Box>

                                        <CardContent 
                                            sx={{ 
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                p: 2,
                                                pb: 1
                                            }}
                                        >
                                            <Typography 
                                                variant="subtitle2"
                                                sx={{ 
                                                    fontWeight: 700,
                                                    mb: 0.5,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    height: '2.6rem', // Ép chiều cao tiêu đề 2 dòng
                                                    color: '#262626',
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                {product.productName || product.name}
                                            </Typography>

                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    mb: 2,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                Món ăn nóng hổi, giòn rụm, giao hàng tận nơi trong 30 phút!
                                            </Typography>

                                            <Box sx={{ mt: 'auto' }}>
                                                <Chip 
                                                    label={`${(product.price || 0).toLocaleString('vi-VN')} ₫`}
                                                    size="medium"
                                                    sx={{ 
                                                        fontWeight: 800, 
                                                        bgcolor: '#fff1f0', 
                                                        color: primaryColor,
                                                        border: `1px solid ${primaryColor}`,
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Box>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button 
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            startIcon={<ShoppingCartOutlined />}
                                            onClick={() => handleAddToCart(product)}
                                            sx={{
                                                bgcolor: primaryColor,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                boxShadow: '0 4px 14px 0 rgba(255, 77, 79, 0.39)',
                                                '&:hover': {
                                                    bgcolor: hoverColor,
                                                    boxShadow: '0 6px 20px rgba(255, 77, 79, 0.23)'
                                                }
                                            }}
                                        >
                                            Thêm vào giỏ
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </MainCard>
    );
}
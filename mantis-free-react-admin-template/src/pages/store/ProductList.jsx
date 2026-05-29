import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import { 
    Card, CardMedia, CardContent, CardActions, 
    Typography, Button, CircularProgress, Box, Chip, 
    TextField, InputAdornment, Slider, Rating, Stack 
} from '@mui/material';
import { ShoppingCartOutlined, SearchOutlined, FilterOutlined, FireOutlined, StarFilled } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    
    const [newestProducts, setNewestProducts] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả'); 
    const [loading, setLoading] = useState(true);

    const [priceRange, setPriceRange] = useState([0, 500000]); 
    const [maxPrice, setMaxPrice] = useState(500000);
    const [flyingImage, setFlyingImage] = useState(null);

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

                const publishedOnly = actualData.filter(
                    product => product.visibilityStatus !== "DRAFT"
                );
                setProducts(publishedOnly);

                // --- 1. MÓN MỚI NHẤT (Sắp xếp theo ID giảm dần) ---
                const newest = [...publishedOnly].sort((a, b) => b.id - a.id).slice(0, 4);
                
                // --- 2. BÁN CHẠY NHẤT (Sắp xếp theo số lượng ĐÃ BÁN từ Backend) ---
                const bestSellers = [...publishedOnly].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 8);
                
                setNewestProducts(newest);
                setBestSellingProducts(bestSellers);

                if (publishedOnly.length > 0) {
                    const highestPrice = publishedOnly.reduce((max, p) => {
                        const price = Number(p.price) || 0;
                        return price > max ? price : max;
                    }, 0);
                    const roundedMax = highestPrice > 0 ? Math.ceil(highestPrice / 50000) * 50000 : 500000;
                    setMaxPrice(roundedMax);
                    setPriceRange([0, roundedMax]);
                }
            })
            .catch((err) => console.error("Lỗi tải dữ liệu:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleAddToCart = (product, event) => {
        event.preventDefault(); 
        let cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
        const index = cart.findIndex(item => item.product.id === (product.id || product.productId));

        if (index >= 0) cart[index].quantity += 1;
        else cart.push({ product: product, quantity: 1 });
        
        localStorage.setItem('rainbow_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); 
        
        const card = event.currentTarget.closest('.MuiCard-root'); 
        const img = card?.querySelector('img'); 
        
        if (img) {
            const rect = img.getBoundingClientRect(); 
            const cartIcon = document.getElementById('cart-icon'); 
            const endX = cartIcon ? cartIcon.getBoundingClientRect().left : window.innerWidth - 80;
            const endY = cartIcon ? cartIcon.getBoundingClientRect().top : 30;

            setFlyingImage({
                id: Date.now(), src: img.src,
                startX: rect.left, startY: rect.top,
                endX: endX, endY: endY
            });

            setTimeout(() => setFlyingImage(null), 800);
        }
    };

    const getValidImage = (url) => {
        if (!url) return 'https://placehold.co/400x300?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        return `${API_URL}/api/catalog/${finalPath}`;
    };

    const categories = useMemo(() => {
        const allCategories = products.map(p => {
            if (typeof p.category === 'string') return p.category;
            if (p.category && p.category.name) return p.category.name;
            return 'Khác';
        });
        return ['Tất cả', ...new Set(allCategories.filter(Boolean))];
    }, [products]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const filteredProducts = products.filter(product => {
        const name = product.productName || product.name || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        
        let catName = 'Khác';
        if (typeof product.category === 'string') catName = product.category;
        else if (product.category && product.category.name) catName = product.category.name;
        const matchesCategory = selectedCategory === 'Tất cả' || catName === selectedCategory;

        const productPrice = Number(product.price) || 0;
        const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
    });

    const isNotFiltering = searchTerm === '' && selectedCategory === 'Tất cả' && priceRange[0] === 0 && priceRange[1] === maxPrice;

    const renderProductCard = (product, badgeText = null, badgeColor = null) => {
        const productId = product.id || product.productId;
        const hasSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;

        return (
            <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                <Card 
                    className="MuiCard-root"
                    sx={{ 
                        display: 'flex', flexDirection: 'column', width: '100%', height: '100%', borderRadius: 2, transition: 'all 0.3s ease', border: '1px solid #f0f0f0', boxShadow: 'none', position: 'relative',
                        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(255, 77, 79, 0.15)', borderColor: '#ffa39e' },
                        '&:hover .MuiCardMedia-root': { transform: 'scale(1.08)' }
                    }}
                >
                    {badgeText && <Chip label={badgeText} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: badgeColor, color: '#fff', fontWeight: 'bold', zIndex: 1 }} />}
                    {hasSale && <Chip label={`-${Math.round((1 - product.salePrice/product.price) * 100)}%`} size="small" color="error" sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold', zIndex: 1 }} />}

                    <Box component={Link} to={`/product/${productId}`} sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ overflow: 'hidden', width: '100%', aspectRatio: '4 / 3', maxHeight: 200 }}>
                            <CardMedia 
                                component="img" image={getValidImage(product.imageUrl || product.image || product.picture)} alt={product.productName || product.name}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=Loi+Anh'; }}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, pb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.6rem', color: '#262626', fontSize: '0.95rem' }}>
                                {product.productName || product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                Món ăn nóng hổi, giòn rụm, giao hàng tận nơi trong 30 phút!
                            </Typography>
                            <Box sx={{ mt: 'auto' }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                    <Rating value={product.averageRating || 0} precision={0.5} size="small" readOnly />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        ({product.soldCount || 0} đã bán)
                                    </Typography>
                                </Stack>
                                {/* ----------------------------------------------- */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip label={hasSale ? formatPrice(product.salePrice) : formatPrice(product.price || 0)} size="medium" sx={{ fontWeight: 800, bgcolor: '#fff1f0', color: primaryColor, border: `1px solid ${primaryColor}`, fontSize: '0.95rem' }} />
                                    {hasSale && <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>{formatPrice(product.price)}</Typography>}
                                </Box>
                            </Box>
                        </CardContent>
                    </Box>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button 
                            variant="contained" fullWidth size="large" startIcon={<ShoppingCartOutlined />} 
                            onClick={(e) => handleAddToCart(product, e)}
                            sx={{
                                bgcolor: primaryColor, fontWeight: 600, textTransform: 'none', fontSize: '0.95rem', boxShadow: '0 4px 14px 0 rgba(255, 77, 79, 0.39)',
                                '&:hover': { bgcolor: hoverColor, boxShadow: '0 6px 20px rgba(255, 77, 79, 0.23)' }
                            }}
                        >
                            Thêm vào giỏ
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        );
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: primaryColor }} /></Box>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, pb: 4 }}>
            {isNotFiltering && (
                <>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: '#262626' }}>
                            <FireOutlined style={{ color: '#faad14' }} /> Món Mới Ra Lò
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                            {newestProducts.map((p) => (
                                <Box key={`new-${p.id || p.productId}`}>
                                    {renderProductCard(p, "MỚI", "#52c41a")}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: '#262626' }}>
                            <StarFilled style={{ color: primaryColor }} /> Món Bán Chạy Nhất
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                            {bestSellingProducts.map((p) => (
                                <Box key={`best-${p.id || p.productId}`}>
                                    {renderProductCard(p, "BEST SELLER", "#ff4d4f")}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}

            <MainCard title={isNotFiltering ? "Khám Phá Tất Cả Thực Đơn" : "Kết quả tìm kiếm"} contentSX={{ p: 2 }}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', lg: 'center' }, gap: 3 }}>
                    <Box sx={{ display: 'flex', flexGrow: 1, gap: 1, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { height: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e0e0', borderRadius: '4px' } }}>
                        {categories.map((cat, index) => (
                            <Chip key={index} label={cat} onClick={() => setSelectedCategory(cat)}
                                sx={{
                                    fontWeight: selectedCategory === cat ? 700 : 500, bgcolor: selectedCategory === cat ? primaryColor : '#f5f5f5', color: selectedCategory === cat ? '#fff' : 'text.primary',
                                    border: '1px solid', borderColor: selectedCategory === cat ? primaryColor : '#e0e0e0',
                                    '&:hover': { bgcolor: selectedCategory === cat ? hoverColor : '#ffeae9', color: selectedCategory === cat ? '#fff' : primaryColor, borderColor: selectedCategory === cat ? hoverColor : primaryColor },
                                    transition: 'all 0.2s ease', px: 1
                                }}
                            />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: { xs: '100%', sm: '260px' }, px: { xs: 0, lg: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <FilterOutlined style={{ marginRight: 4 }} /> {formatPrice(priceRange[0])}
                            </Typography>
                            <Typography variant="caption" fontWeight={600} color="text.secondary">{formatPrice(priceRange[1])}</Typography>
                        </Box>
                        <Slider value={priceRange} onChange={(e, newValue) => setPriceRange(newValue)} min={0} max={maxPrice} step={10000} size="small" sx={{ color: primaryColor, p: 0, '& .MuiSlider-thumb': { '&:hover, &.Mui-focusVisible': { boxShadow: `0px 0px 0px 8px ${primaryColor}33` } } }} />
                    </Box>

                    <TextField 
                        variant="outlined" placeholder="Tìm món ăn..." size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchOutlined /> </InputAdornment> ) }}
                        sx={{ width: { xs: '100%', sm: '280px' }, flexShrink: 0 }}
                    />
                </Box>

                {filteredProducts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>Không tìm thấy món ăn nào phù hợp với bộ lọc! 😢</Typography>
                        <Button variant="outlined" sx={{ color: primaryColor, borderColor: primaryColor }} onClick={() => { setPriceRange([0, maxPrice]); setSelectedCategory('Tất cả'); setSearchTerm(''); }}>Xóa tất cả bộ lọc</Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}> 
                        {filteredProducts.map((product) => (
                            <Box key={`all-${product.id || product.productId}`}>
                                {renderProductCard(product)}
                            </Box>
                        ))}
                    </Box>
                )}

                {flyingImage && (
                    <Box component="img" src={flyingImage.src}
                        sx={{
                            position: 'fixed', zIndex: 9999, width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', pointerEvents: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            animation: 'flyToCart 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                            '@keyframes flyToCart': {
                                '0%': { top: flyingImage.startY, left: flyingImage.startX, transform: 'scale(1)', opacity: 1 },
                                '100%': { top: flyingImage.endY, left: flyingImage.endX, transform: 'scale(0.1)', opacity: 0 }
                            }
                        }}
                    />
                )}
            </MainCard>
        </Box>
    );
}
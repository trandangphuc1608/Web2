import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Card, CardMedia, CardContent, 
    Button, Chip, Stack, CircularProgress, Rating 
} from '@mui/material';
import { ShoppingCartOutlined, FireOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { API_URL } from 'config';

export default function HomePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [newestProducts, setNewestProducts] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    const primaryColor = '#ff4d4f';

    useEffect(() => {
        fetch(`${API_URL}/api/catalog/products?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                let actualData = [];
                if (Array.isArray(data)) actualData = data;
                else if (data && Array.isArray(data.data)) actualData = data.data;
                else if (data && data._embedded && Array.isArray(data._embedded.products)) actualData = data._embedded.products;
                else if (data && Array.isArray(data.content)) actualData = data.content;

                const activeProducts = actualData.filter(p => p.visibilityStatus !== 'DRAFT');

                // SẢN PHẨM MỚI NHẤT
                const newest = [...activeProducts].sort((a, b) => b.id - a.id).slice(0, 4);
                
                // BÁN CHẠY NHẤT (Sắp xếp theo số lượng bán thật từ Database)
                const bestSellers = [...activeProducts].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 8);

                setNewestProducts(newest);
                setBestSellingProducts(bestSellers);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải sản phẩm trang chủ:", err);
                setLoading(false);
            });
    }, []);

    const getValidImage = (url) => {
        if (!url) return 'https://placehold.co/400x300?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        return `${API_URL}/api/catalog/${finalPath}`;
    };

    const ProductCard = ({ product, badgeText, badgeColor }) => {
        const hasSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;

        return (
            <Card 
                sx={{ 
                    borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative', border: '1px solid #f0f0f0', boxShadow: 'none',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(255, 77, 79, 0.15)', borderColor: '#ffa39e' }
                }}
                onClick={() => navigate(`/product/${product.id || product.productId}`)}
            >
                {badgeText && (
                    <Chip label={badgeText} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: badgeColor, color: '#fff', fontWeight: 'bold', zIndex: 1 }} />
                )}

                {hasSale && (
                    <Chip label={`-${Math.round((1 - product.salePrice/product.price) * 100)}%`} size="small" color="error" sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold', zIndex: 1 }} />
                )}

                <Box sx={{ overflow: 'hidden', height: 200, width: '100%' }}>
                    <CardMedia
                        component="img"
                        image={getValidImage(product.imageUrl || product.image || product.picture)}
                        alt={product.productName || product.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=Loi+Anh'; }}
                        sx={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.1)' } }}
                    />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8rem', color: '#262626' }}>
                        {product.productName || product.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.shortDesc || product.description || 'Hương vị tuyệt hảo, giòn rụm khó cưỡng.'}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                            
                            {/* --- ĐÃ SỬA LOGIC HIỂN THỊ SAO Ở ĐÂY --- */}
                            {Number(product.averageRating) > 0 ? (
                                <Rating value={Number(product.averageRating)} precision={0.5} size="small" readOnly />
                            ) : (
                                <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                    Chưa có đánh giá
                                </Typography>
                            )}
                            
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                ({product.soldCount || 0} đã bán)
                            </Typography>
                            {/* -------------------------------------- */}

                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box>
                                {hasSale ? (
                                    <>
                                        <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 800, lineHeight: 1 }}>
                                            {(product.salePrice || 0).toLocaleString('vi-VN')}₫
                                        </Typography>
                                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                            {(product.price || 0).toLocaleString('vi-VN')}₫
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 800 }}>
                                        {(product.price || 0).toLocaleString('vi-VN')}₫
                                    </Typography>
                                )}
                            </Box>
                            
                            <Button 
                                variant="contained" 
                                sx={{ bgcolor: primaryColor, minWidth: '40px', p: 1, borderRadius: 2, boxShadow: '0 4px 14px 0 rgba(255, 77, 79, 0.39)', '&:hover': { bgcolor: '#d9363e', boxShadow: '0 6px 20px rgba(255, 77, 79, 0.23)' } }}
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    alert("Đã thêm món vào giỏ!"); 
                                }}
                            >
                                <ShoppingCartOutlined style={{ fontSize: '18px' }} />
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: primaryColor }} /></Box>;

    return (
        <Box sx={{ pb: 8, pt: 2 }}>
            {/* --- SECTION 1: SẢN PHẨM MỚI NHẤT --- */}
            <Box sx={{ mb: 8 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, color: '#262626' }}>
                        <FireOutlined style={{ color: '#faad14' }} /> Món Mới Ra Lò
                    </Typography>
                    <Button onClick={() => navigate('/menu')} sx={{ color: primaryColor, fontWeight: 600 }}>Xem tất cả &gt;</Button>
                </Stack>
                <Grid container spacing={3}>
                    {newestProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={`new-${product.id}`}>
                            <ProductCard product={product} badgeText="MỚI" badgeColor="#52c41a" />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* --- SECTION 2: BÁN CHẠY NHẤT (BEST SELLER) --- */}
            <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, color: '#262626' }}>
                        <StarFilled style={{ color: primaryColor }} /> Món Bán Chạy Nhất
                    </Typography>
                    <Button onClick={() => navigate('/menu')} sx={{ color: primaryColor, fontWeight: 600 }}>Xem tất cả &gt;</Button>
                </Stack>
                <Grid container spacing={3}>
                    {bestSellingProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={`best-${product.id}`}>
                            <ProductCard product={product} badgeText="BEST SELLER" badgeColor="#ff4d4f" />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
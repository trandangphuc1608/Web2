import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, Stack, Button, Card, CardContent, CircularProgress } from '@mui/material';
import {
    RocketOutlined, CheckCircleOutlined, SyncOutlined, CustomerServiceOutlined,
    StarFilled, ShopOutlined, SafetyCertificateOutlined, FireFilled, PhoneOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // HÀM XỬ LÝ LỖI ĐƯỜNG DẪN ẢNH (/uploads/...) TỪ DATABASE
    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/400x250?text=Sản+Phẩm';
        if (url.startsWith('http')) return url; // Nếu là link mạng ngoài thì giữ nguyên
        // Nối với cổng Catalog Service (8810) nơi lưu trữ file vật lý
        return `http://localhost:8810${url}`; 
    };

    useEffect(() => {
        // 1. GỌI API ĐÁNH GIÁ (QUA API GATEWAY: 8900)
        const fetchReviews = async () => {
            try {
                // Đang cấu hình chuẩn theo prefix thường dùng của Gateway
                const response = await fetch('http://localhost:8900/api/recommendation/reviews');
                
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data.slice(0, 3));
                } else {
                    console.error("Lỗi Gateway Đánh Giá:", response.status);
                    setReviews([]);
                }
            } catch (error) {
                setReviews([]);
            } finally {
                setLoadingReviews(false);
            }
        };

        // 2. GỌI API SẢN PHẨM (QUA API GATEWAY: 8900)
        const fetchProducts = async () => {
            try {
                // Đang cấu hình chuẩn theo prefix thường dùng của Gateway
                const response = await fetch('http://localhost:8900/api/catalog/products');
                
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.slice(0, 3));
                } else {
                    console.error("Lỗi Gateway Sản Phẩm:", response.status);
                    setProducts([]);
                }
            } catch (error) {
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchReviews();
        fetchProducts();
    }, []);

    return (
        <Box sx={{ pb: 8, animation: 'fadeIn 0.5s ease-in-out', bgcolor: '#f4f6f8', width: '100%' }}>

            {/* 1. HERO SECTION */}
            <Box
                sx={{
                    position: 'relative', width: '100%', minHeight: '80vh',
                    display: 'flex', alignItems: 'center', mb: 10,
                    background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop")',
                    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
                    <Grid container>
                        <Grid size={{ xs: 12, md: 8, lg: 6 }}>
                            <Typography variant="overline" sx={{ color: '#FF512F', fontWeight: 900, fontSize: '1.2rem', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FireFilled /> HOT & FRESH EVERYDAY
                            </Typography>
                            <Typography variant="h1" sx={{ fontWeight: 900, color: 'white', mb: 3, fontSize: { xs: '3rem', md: '4.5rem' }, lineHeight: 1.1 }}>
                                Tinh Hoa Ẩm Thực <br /><span style={{ color: '#FF512F' }}>Nhanh & Sạch</span>
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 5, fontWeight: 400, lineHeight: 1.6, fontSize: '1.2rem' }}>
                                RainbowFood mang đến những bữa ăn nóng hổi, dinh dưỡng với nguyên liệu 100% Organic. Đặt hàng ngay - Giao tận tay chỉ trong 30 phút!
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button component={Link} to="/" variant="contained" size="large" sx={{ py: 2, px: 5, borderRadius: 30, fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)', boxShadow: '0 10px 25px rgba(255, 81, 47, 0.4)' }}>
                                    XEM THỰC ĐƠN
                                </Button>
                                <Button component={Link} to="/contact" variant="outlined" size="large" sx={{ py: 2, px: 5, borderRadius: 30, fontWeight: 800, fontSize: '1.1rem', color: 'white', borderColor: 'white', '&:hover': { borderColor: '#FF512F', color: '#FF512F', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                    LIÊN HỆ TƯ VẤN
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl">
                {/* 2. GIỚI THIỆU THƯƠNG HIỆU */}
                <Grid container spacing={8} sx={{ mb: 12 }}>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                        <Box sx={{ position: 'relative', width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop" alt="Nhà hàng RainbowFood" style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover' }} />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="overline" sx={{ color: '#FF512F', fontWeight: 'bold', letterSpacing: 3, fontSize: '1rem' }}>Câu Chuyện Thương Hiệu</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, color: '#1e293b', fontSize: { xs: '2rem', md: '3rem' } }}>
                            Định nghĩa lại Fast Food.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'justify' }}>
                            Khởi nguồn từ một gian hàng nhỏ ở TP. Thủ Đức, RainbowFood ra đời với sứ mệnh đập tan định kiến "thức ăn nhanh là kém lành mạnh".
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'justify' }}>
                            Chúng tôi tự hào phục vụ hơn 5.000+ bữa ăn mỗi ngày với cam kết: <strong>Nguyên liệu sạch - Giá minh bạch - Phục vụ từ tâm</strong>. Dù bạn là nhân viên văn phòng bận rộn hay sinh viên, RainbowFood luôn có một phần ăn hoàn hảo dành cho bạn.
                        </Typography>

                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 1 }}>
                            {['100% Thịt Bò Úc', 'Rau Sạch Nông Trại', 'Không Chất Bảo Quản', 'Bếp Chuẩn 5 Sao'].map((item, idx) => (
                                <Typography key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700, color: '#333', fontSize: { xs: '0.85rem', lg: '1rem' } }}>
                                    <CheckCircleOutlined style={{ color: '#FF512F' }} /> {item}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                {/* 3. ĐIỂM NỔI BẬT */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Tại Sao Chọn RainbowFood?</Typography>
                    <Box sx={{ width: 80, height: 5, bgcolor: '#FF512F', mx: 'auto', mb: 6, borderRadius: 2 }}></Box>
                </Box>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '96px', justifyContent: 'center' }}>
                    {[
                        { icon: <RocketOutlined />, title: 'Giao Hàng Siêu Tốc', desc: 'Cam kết nóng hổi tận tay chỉ trong 30 phút.' },
                        { icon: <SafetyCertificateOutlined />, title: 'Đảm Bảo An Toàn', desc: 'Đạt chuẩn vệ sinh an toàn thực phẩm quốc tế.' },
                        { icon: <SyncOutlined />, title: 'Đổi Trả Dễ Dàng', desc: 'Hoàn tiền 100% nếu món ăn không đúng mô tả.' },
                        { icon: <CustomerServiceOutlined />, title: 'Hỗ Trợ 24/7', desc: 'Tổng đài & AI Chatbot luôn sẵn sàng phục vụ.' }
                    ].map((item, index) => (
                        <div key={index} style={{ flex: '1 1 250px', display: 'flex' }}>
                            <Paper elevation={0} sx={{ width: '100%', p: 4, textAlign: 'center', borderRadius: 4, bgcolor: '#fffaf1', border: '1px solid #ffe0cc', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 15px 30px rgba(255,81,47,0.1)' } }}>
                                <Box sx={{ fontSize: '40px', color: '#FF512F', mb: 2 }}>{item.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{item.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                            </Paper>
                        </div>
                    ))}
                </div>

                {/* 4. SẢN PHẨM NỔI BẬT */}
                <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 6 }, borderRadius: 6, boxShadow: '0 10px 40px rgba(0,0,0,0.03)', mb: 12 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 4 }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b' }}>Best Seller</Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }}>Những món ăn làm nên tên tuổi của RainbowFood</Typography>
                        </Box>
                        <Button component={Link} to="/" sx={{ color: '#FF512F', fontWeight: 700 }}>Xem tất cả &rarr;</Button>
                    </Stack>
                    
                    {loadingProducts ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress sx={{ color: '#FF512F' }} />
                        </Box>
                    ) : products.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                            {products.map((prod, idx) => (
                                <div key={prod.id || idx} style={{ flex: '1 1 300px', display: 'flex' }}>
                                    <Card sx={{ height: '100%', width: '100%', borderRadius: 4, boxShadow: 'none', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', '&:hover': { borderColor: '#FF512F' } }}>
                                        
                                        {/* GỌI HÀM getImageUrl ĐỂ FIX VỠ ẢNH TỪ DATABASE */}
                                        <Box 
                                            component="img" 
                                            src={getImageUrl(prod.imageUrl || prod.image)} 
                                            alt={prod.productName || prod.name} 
                                            sx={{ height: 250, width: '100%', objectFit: 'cover', flexShrink: 0, display: 'block' }}
                                        />

                                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" title={prod.productName || prod.name} sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '60px' }}>
                                                {prod.productName || prod.name || 'Sản phẩm ngon'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1, color: '#faaf00' }}>
                                                <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                    Đã bán {prod.sold || Math.floor(Math.random() * 1000) + 100}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
                                                <Typography variant="h5" fontWeight="900" color="#FF512F">
                                                    {prod.price ? prod.price.toLocaleString() + 'đ' : 'Liên hệ'}
                                                </Typography>
                                                <Button component={Link} to="/" variant="contained" size="small" sx={{ bgcolor: '#1e293b', borderRadius: 2 }}>Mua Ngay</Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
                            Không kết nối được Gateway. Đang báo lỗi 404.
                        </Typography>
                    )}
                </Box>

                {/* 5. FEEDBACK KHÁCH HÀNG */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Khách Hàng Nói Gì?</Typography>
                    <Box sx={{ width: 80, height: 5, bgcolor: '#FF512F', mx: 'auto', mb: 6, borderRadius: 2 }}></Box>
                </Box>

                {loadingReviews ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 12 }}>
                        <CircularProgress sx={{ color: '#FF512F' }} />
                    </Box>
                ) : reviews.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '96px' }}>
                        {reviews.map((fb, idx) => (
                            <div key={idx} style={{ flex: '1 1 300px', display: 'flex' }}>
                                <Paper elevation={0} sx={{ width: '100%', p: 4, borderRadius: 4, bgcolor: '#fff', border: '1px solid #eaeaea', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ fontSize: '40px', color: '#ffe0cc', position: 'absolute', top: 20, right: 30, fontFamily: 'serif' }}>"</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, color: '#faaf00', mb: 2 }}>
                                        {[...Array(fb.rating || 5)].map((_, i) => <StarFilled key={i} />)}
                                    </Box>
                                    
                                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, lineHeight: 1.8, flexGrow: 1, textAlign: 'justify' }}>
                                        "{fb.text || fb.comment || 'Món ăn tuyệt vời!'}"
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#FF512F' }}>
                                            {(fb.author || fb.customerName || 'K')[0].toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">{fb.author || fb.customerName || 'Khách hàng'}</Typography>
                                            <Typography variant="caption" color="text.secondary">Thực khách</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 12 }}>
                        Không kết nối được Gateway. Đang báo lỗi 404.
                    </Typography>
                )}

                {/* 6. CHÍNH SÁCH BÁN HÀNG */}
                <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, bgcolor: '#1e293b', color: 'white', mb: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <Typography variant="h5" fontWeight="bold" mb={1}>Chính Sách Uy Tín</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Bảo vệ quyền lợi khách hàng 100%.</Typography>
                        </div>
                        {[
                            { title: 'Chính sách vận chuyển', desc: 'Freeship cho đơn hàng trên 200k.' },
                            { title: 'Chính sách đổi trả', desc: '1 đổi 1 nếu phát hiện dị vật.' },
                            { title: 'Bảo mật thông tin', desc: 'Mã hóa dữ liệu khách hàng tuyệt đối.' }
                        ].map((policy, idx) => (
                            <div key={idx} style={{ flex: '1 1 200px', display: 'flex', gap: '16px' }}>
                                <CheckCircleOutlined style={{ color: '#FF512F', fontSize: '24px' }} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>{policy.title}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.7 }}>{policy.desc}</Typography>
                                </Box>
                            </div>
                        ))}
                    </div>
                </Paper>

                {/* 7. THÔNG TIN LIÊN HỆ NHANH */}
                <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Typography variant="h4" fontWeight="800" mb={2}>Cần Hỗ Trợ Gấp?</Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>Đội ngũ RainbowFood luôn ở đây để giúp bạn giải quyết mọi vấn đề.</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button component={Link} to="/contact" variant="contained" size="large" startIcon={<CustomerServiceOutlined />} sx={{ py: 1.5, px: 4, borderRadius: 30, bgcolor: '#FF512F', '&:hover': { bgcolor: '#e03e1c' } }}>
                            Đến Trang Liên Hệ
                        </Button>
                        <Button variant="outlined" size="large" startIcon={<PhoneOutlined />} sx={{ py: 1.5, px: 4, borderRadius: 30, borderColor: '#FF512F', color: '#FF512F' }}>
                            Hotline: 1900 6868
                        </Button>
                    </Stack>
                </Box>

            </Container>
        </Box>
    );
}
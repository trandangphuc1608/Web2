import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Button, IconButton } from '@mui/material';
import { RocketOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
// Import CSS của thư viện react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { API_URL } from 'config';

// Tùy chỉnh Nút chuyển qua trái/phải của Banner
const NextArrow = ({ onClick }) => (
    <IconButton onClick={onClick} sx={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', zIndex: 10, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: '#fff' } }}>
        <RightOutlined />
    </IconButton>
);

const PrevArrow = ({ onClick }) => (
    <IconButton onClick={onClick} sx={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', zIndex: 10, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: '#fff' } }}>
        <LeftOutlined />
    </IconButton>
);

export default function HeroBanner() {
    const location = useLocation();
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- GỌI API LẤY DANH SÁCH BANNER ĐANG ACTIVE ---
    useEffect(() => {
        if (location.pathname !== '/') return; // Chỉ lấy data khi ở trang chủ

        fetch(`${API_URL}/api/catalog/banners/active?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sắp xếp lại theo sortOrder cho chắc chắn
                    setBanners(data.sort((a, b) => a.sortOrder - b.sortOrder));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi tải banner:", err);
                setLoading(false);
            });
    }, [location.pathname]);

    // Chỉ hiển thị ở trang chủ
    if (location.pathname !== '/') return null;

    // Cấu hình chạy của Slider
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        appendDots: dots => (
            <div style={{ bottom: '10px' }}>
                <ul style={{ margin: "0px", padding: 0 }}> {dots} </ul>
            </div>
        )
    };

    const getValidImage = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        return `${API_URL}/api/catalog/${cleanPath.startsWith('uploads/') ? cleanPath : 'uploads/' + cleanPath}`;
    };

    const handleBannerClick = (url) => {
        if (url && url !== '#') {
            if (url.startsWith('http')) window.open(url, '_blank');
            else navigate(url);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Container maxWidth="xl">
                {loading || banners.length === 0 ? (
                    // ====== FALLBACK: Nếu không có banner nào, hiện lại khung chữ cam cũ ======
                    <Paper 
                        elevation={0}
                        sx={{ 
                            borderRadius: 4, overflow: 'hidden',
                            background: 'linear-gradient(135deg, #FF9D6C 0%, #BB4E75 100%)',
                            color: 'white', py: { xs: 6, md: 10 }, px: { xs: 3, md: 8 },
                            position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'
                        }}
                    >
                        <Box sx={{ zIndex: 2, maxWidth: '600px' }}>
                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                Đói bụng chưa? <br/> Thưởng thức tinh hoa ẩm thực!
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, opacity: 0.9, lineHeight: 1.5 }}>
                                RainbowFood mang đến những món ăn nóng hổi, giòn rụm và thơm ngon nhất ngay tận cửa nhà bạn chỉ trong 30 phút.
                            </Typography>
                            <Button 
                                variant="contained" size="large" startIcon={<RocketOutlined />}
                                sx={{ 
                                    bgcolor: '#fff', color: '#BB4E75', fontWeight: 700, px: 4, py: 1.5, borderRadius: '30px',
                                    '&:hover': { bgcolor: '#f0f0f0', transform: 'translateY(-2px)' }, transition: 'all 0.2s'
                                }}
                                onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
                            >
                                Khám phá thực đơn
                            </Button>
                        </Box>
                        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                        <Box sx={{ position: 'absolute', bottom: -100, right: 150, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    </Paper>
                ) : (
                    // ====== SLIDER: Hiển thị các Banner từ Admin ======
                    <Box sx={{ borderRadius: 4, overflow: 'hidden', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <Slider {...sliderSettings}>
                            {banners.map((banner) => (
                                <Box key={banner.id} onClick={() => handleBannerClick(banner.targetUrl)} sx={{ cursor: banner.targetUrl && banner.targetUrl !== '#' ? 'pointer' : 'default', outline: 'none' }}>
                                    <Box 
                                        component="img" 
                                        src={getValidImage(banner.imageUrl)} 
                                        alt={banner.title}
                                        sx={{ width: '100%', height: { xs: 200, sm: 300, md: 400, lg: 500 }, objectFit: 'cover', display: 'block' }}
                                    />
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
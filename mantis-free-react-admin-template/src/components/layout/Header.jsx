import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

// Nhận các props (dữ liệu) từ StoreLayout truyền xuống
export default function Header({ user, cartCount, onLoginClick, onLogout }) {
    const location = useLocation();

    return (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'text.primary', zIndex: 1000 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ py: 1 }}>
                    {/* LOGO */}
                    <Typography variant="h3" component={Link} to="/" sx={{ mr: 4, fontWeight: 800, textDecoration: 'none', background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 1 }}>
                        🍔 RainbowFood
                    </Typography>
                    
                    {/* MENU */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Button component={Link} to="/" sx={{ fontWeight: 600, color: location.pathname === '/' ? '#FF512F' : 'text.secondary', '&:hover': { color: '#FF512F', bgcolor: 'transparent' } }}>Trang Chủ</Button>
                        <Button component={Link} to="/" sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: '#FF512F', bgcolor: 'transparent' } }}>Thực Đơn</Button>
                        <Button component={Link} to="/gioi-thieu" sx={{ fontWeight: 600, color: location.pathname === '/gioi-thieu' ? '#FF512F' : 'text.secondary', '&:hover': { color: '#FF512F', bgcolor: 'transparent' } }}>Giới Thiệu</Button>
                        <Button component={Link} to="/contact" sx={{ fontWeight: 600, color: location.pathname === '/contact' ? '#FF512F' : 'text.secondary', '&:hover': { color: '#FF512F', bgcolor: 'transparent' } }}>Liên Hệ</Button>
                        {user && <Button component={Link} to="/history" sx={{ fontWeight: 600, color: location.pathname === '/history' ? '#FF512F' : 'text.secondary', '&:hover': { color: '#FF512F', bgcolor: 'transparent' } }}>Lịch Sử Mua Hàng</Button>}
                    </Box>
                    
                    {/* TÀI KHOẢN */}
                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2, bgcolor: '#fff0e6', px: 2, py: 0.8, borderRadius: '20px', border: '1px solid #ffe0cc' }}>
                            <UserOutlined style={{ color: '#FF512F' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#d43b11' }}>Chào, {user.name}</Typography>
                            {/* Gọi hàm onLogout từ file cha */}
                            <IconButton size="small" sx={{ color: '#d43b11' }} onClick={onLogout} title="Đăng xuất"><LogoutOutlined /></IconButton>
                        </Box>
                    ) : (
                        // --- ĐÃ THÊM ID VÀO ĐÂY ĐỂ TRANG CHI TIẾT CÓ THỂ GỌI MỞ POPUP ---
                        <Button 
                            id="login-btn-header" 
                            variant="contained" 
                            sx={{ mr: 2, borderRadius: '20px', px: 3, fontWeight: 600, background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)', boxShadow: '0 4px 14px 0 rgba(255, 81, 47, 0.39)' }} 
                            onClick={onLoginClick}
                        >
                            Đăng nhập
                        </Button>
                    )}

                    {/* GIỎ HÀNG - ĐÃ THÊM ID="cart-icon" ĐỂ HỨNG ANIMATION */}
                    <IconButton id="cart-icon" component={Link} to="/cart" size="large" sx={{ bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { bgcolor: '#f9f9f9' } }}>
                        <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
                            <ShoppingCartOutlined style={{ color: '#333' }} />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
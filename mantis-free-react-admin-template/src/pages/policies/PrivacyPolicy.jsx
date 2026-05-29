import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Chính sách bảo mật</Typography>
                </Breadcrumbs>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#333' }}>Chính Sách Bảo Mật</Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>1. Mục đích thu thập dữ liệu</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Chúng tôi chỉ thu thập thông tin cơ bản nhằm xử lý đơn hàng, tối ưu trải nghiệm và gửi các khuyến mãi phù hợp.</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>2. Bảo mật hệ thống</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Toàn bộ giao dịch và dữ liệu cá nhân được mã hóa qua giao thức SSL an toàn nhất. Không bán hoặc cung cấp dữ liệu cho bên thứ ba.</Typography>
                </Paper>
            </Container>
        </Box>
    );
};
export default PrivacyPolicy;
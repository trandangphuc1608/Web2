import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const WarrantyPolicy = () => {
    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Chính sách bảo hành</Typography>
                </Breadcrumbs>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#333' }}>Quy Định Bảo Quản & Bảo Hành</Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>1. Đối với Thực phẩm tươi sống</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Vui lòng kiểm tra kỹ chất lượng ngay khi nhận hàng. Chúng tôi bảo hành chất lượng trong vòng 12 giờ nếu bảo quản đúng chuẩn tủ lạnh.</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>2. Đối với Đồ khô & Đóng hộp</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Bảo hành chất lượng theo đúng hạn sử dụng in trên bao bì. Cam kết 1 đổi 1 nếu sản phẩm bị rách bao bì, biến dạng từ NSX.</Typography>
                </Paper>
            </Container>
        </Box>
    );
};
export default WarrantyPolicy;
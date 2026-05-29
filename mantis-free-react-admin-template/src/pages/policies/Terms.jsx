import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Terms = () => {
    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Điều khoản dịch vụ</Typography>
                </Breadcrumbs>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#333' }}>Điều Khoản Dịch Vụ</Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>1. Quyền lợi và Nghĩa vụ Khách hàng</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Khách hàng có trách nhiệm cung cấp thông tin giao hàng chính xác. Bất kỳ sự cố nào do sai lệch địa chỉ, RainbowFood sẽ không chịu trách nhiệm hoàn tiền.</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>2. Quyền Sở hữu Trí tuệ</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Mọi hình ảnh, nội dung, logo thương hiệu trên website đều thuộc bản quyền của RainbowFood, nghiêm cấm sao chép dưới mọi hình thức.</Typography>
                </Paper>
            </Container>
        </Box>
    );
};
export default Terms;
import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ReturnPolicy = () => {
    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Trả hàng & Hoàn tiền</Typography>
                </Breadcrumbs>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#333' }}>Chính Sách Trả Hàng & Hoàn Tiền</Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>1. Điều kiện áp dụng</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Đổi trả ngay lập tức nếu thực phẩm ôi thiu, hỏng hóc trong quá trình vận chuyển, hoặc giao sai món so với đơn đặt hàng.</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>2. Thời gian hoàn tiền</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>Hoàn tiền mặt ngay lập tức đối với đơn COD, hoặc từ 2-5 ngày làm việc đối với thanh toán qua thẻ ngân hàng/ví điện tử.</Typography>
                </Paper>
            </Container>
        </Box>
    );
};
export default ReturnPolicy;
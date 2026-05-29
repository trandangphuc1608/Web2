import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ShoppingGuide = () => {
    const steps = [
        { title: 'Bước 1: Chọn món', desc: 'Duyệt qua thực đơn đa dạng và chọn món ăn, thực phẩm bạn yêu thích.' },
        { title: 'Bước 2: Thêm vào giỏ', desc: 'Kiểm tra lại số lượng và giá tiền, sau đó nhấn "Thêm vào giỏ hàng".' },
        { title: 'Bước 3: Điền thông tin', desc: 'Nhập chính xác địa chỉ giao hàng và số điện thoại liên hệ.' },
        { title: 'Bước 4: Thanh toán', desc: 'Chọn thanh toán COD (Tiền mặt) hoặc thanh toán online qua Thẻ/Ví điện tử.' }
    ];

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Hướng dẫn mua hàng</Typography>
                </Breadcrumbs>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#333', textAlign: 'center' }}>CÁCH ĐẶT HÀNG TẠI RAINBOWFOOD</Typography>
                    <Grid container spacing={3}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Box sx={{ p: 3, border: '1px solid #eee', borderRadius: 2, height: '100%', bgcolor: index % 2 === 0 ? '#fff5f2' : '#f4faff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#FF512F' }}>{step.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default ShoppingGuide;
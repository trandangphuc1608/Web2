import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const CustomerSupport = () => {
    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Chăm sóc khách hàng</Typography>
                </Breadcrumbs>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>LIÊN HỆ VỚI CHÚNG TÔI</Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 5, color: 'text.secondary' }}>Đội ngũ RainbowFood luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7.</Typography>
                    
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', border: '1px solid #eaeaea', borderRadius: 2, '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' } }}>
                                <PhoneOutlined style={{ fontSize: '40px', color: '#1877F2', marginBottom: '16px' }} />
                                <Typography variant="h6" fontWeight={700}>Tổng đài hỗ trợ</Typography>
                                <Typography variant="body1" color="#FF512F" fontWeight={800} sx={{ mt: 1 }}>1900 1234 567</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', border: '1px solid #eaeaea', borderRadius: 2, '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' } }}>
                                <MailOutlined style={{ fontSize: '40px', color: '#EA4335', marginBottom: '16px' }} />
                                <Typography variant="h6" fontWeight={700}>Email hỗ trợ</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>support@rainbowfood.com</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', border: '1px solid #eaeaea', borderRadius: 2, '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' } }}>
                                <EnvironmentOutlined style={{ fontSize: '40px', color: '#34A853', marginBottom: '16px' }} />
                                <Typography variant="h6" fontWeight={700}>Văn phòng</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Khu Đô thị ĐHQG, Dĩ An, BD</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default CustomerSupport;
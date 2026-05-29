import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SafetyCertificateOutlined, CheckCircleOutlined } from '@ant-design/icons';

const AuthenticGuarantee = () => {
    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Cam kết chính hãng</Typography>
                </Breadcrumbs>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: 'center' }}>
                    <SafetyCertificateOutlined style={{ fontSize: '64px', color: '#FF512F', marginBottom: '16px' }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#333' }}>CAM KẾT CHẤT LƯỢNG & CHÍNH HÃNG</Typography>
                    
                    <Box sx={{ textAlign: 'left', bgcolor: '#f9f9f9', p: 4, borderRadius: 2 }}>
                        <Stack spacing={3}>
                            <Box display="flex">
                                <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '16px', marginTop: '2px' }} />
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>100% Nguồn gốc rõ ràng</Typography>
                                    <Typography variant="body2" color="text.secondary">Tất cả nguyên liệu và thực phẩm tại RainbowFood đều được nhập khẩu và thu mua từ các nông trại, nhà cung cấp đạt chuẩn VietGAP, GlobalGAP.</Typography>
                                </Box>
                            </Box>
                            <Box display="flex">
                                <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '16px', marginTop: '2px' }} />
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>Đảm bảo Vệ sinh An toàn Thực phẩm</Typography>
                                    <Typography variant="body2" color="text.secondary">Quy trình chế biến và đóng gói khép kín, được cấp giấy chứng nhận VSATTP bởi Bộ Y Tế.</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthenticGuarantee;
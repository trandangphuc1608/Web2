import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, Divider } from '@mui/material';
import {
    FacebookFilled,
    InstagramOutlined,
    YoutubeFilled,
    CreditCardOutlined,
    CarOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: '#fbfbfb', pt: 6, pb: 4, mt: 8, borderTop: '1px solid #e0e0e0' }}>
            {/* ĐÃ ĐỔI: maxWidth="xl" để Footer rộng ra, vừa vặn với Header */}
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
                <Grid container spacing={4} justifyContent="space-between">

                    {/* Cột 1: CHĂM SÓC KHÁCH HÀNG */}
                    <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                            CHĂM SÓC KHÁCH HÀNG
                        </Typography>
                        <Stack spacing={1.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                            <Link component={RouterLink} to="/trung-tam-tro-giup" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Trung tâm trợ giúp</Link>
                            <Link component={RouterLink} to="/huong-dan-mua-hang" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Hướng dẫn mua hàng</Link>
                            <Link component={RouterLink} to="/tra-hang-hoan-tien" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Trả hàng & Hoàn tiền</Link>
                            <Link component={RouterLink} to="/cham-soc-khach-hang" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Chăm sóc khách hàng</Link>
                            <Link component={RouterLink} to="/chinh-sach-bao-hanh" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Chính sách bảo hành</Link>
                        </Stack>
                    </Grid>

                    {/* Cột 2: VỀ RAINBOWFOOD */}
                    <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                            VỀ RAINBOWFOOD
                        </Typography>
                        <Stack spacing={1.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                            <Link component={RouterLink} to="/gioi-thieu" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Giới thiệu RainbowFood</Link>
                            <Link component={RouterLink} to="/tuyen-dung" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Tuyển dụng</Link>
                            <Link component={RouterLink} to="/dieu-khoan" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Điều khoản RainbowFood</Link>
                            <Link component={RouterLink} to="/chinh-sach-bao-mat" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Chính sách bảo mật</Link>
                            <Link component={RouterLink} to="/chinh-hang" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', '&:hover': { color: '#FF512F' } }}>Chính hãng</Link>
                        </Stack>
                    </Grid>

                    {/* Cột 3: THANH TOÁN & VẬN CHUYỂN (Chia đều md={3}) */}
                    <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                            THANH TOÁN
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                            <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1, display: 'flex', alignItems: 'center', bgcolor: '#fff' }}>
                                <CreditCardOutlined style={{ fontSize: '20px', color: '#1976d2' }} />
                            </Box>
                            <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1, display: 'flex', alignItems: 'center', bgcolor: '#fff' }}>
                                <SafetyCertificateOutlined style={{ fontSize: '20px', color: '#2e7d32' }} />
                            </Box>
                        </Stack>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                            VẬN CHUYỂN
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1, display: 'flex', alignItems: 'center', bgcolor: '#fff' }}>
                                <CarOutlined style={{ fontSize: '20px', color: '#FF512F' }} />
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Cột 4: THEO DÕI CHÚNG TÔI TRÊN (Chia đều md={3}) */}
                    <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333', textAlign: { xs: 'center', md: 'left' } }}>
                            THEO DÕI CHÚNG TÔI TRÊN
                        </Typography>
                        <Stack spacing={1.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                            <Link href="#" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', '&:hover': { color: '#FF512F' } }}>
                                <FacebookFilled style={{ fontSize: '18px', marginRight: '8px', color: '#1877F2' }} /> Facebook
                            </Link>
                            <Link href="#" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', '&:hover': { color: '#FF512F' } }}>
                                <InstagramOutlined style={{ fontSize: '18px', marginRight: '8px', color: '#E1306C' }} /> Instagram
                            </Link>
                            <Link href="#" underline="none" color="text.secondary" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', '&:hover': { color: '#FF512F' } }}>
                                <YoutubeFilled style={{ fontSize: '18px', marginRight: '8px', color: '#FF0000' }} /> YouTube
                            </Link>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Phần thông tin công ty dưới cùng - Vẫn giữ căn giữa */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        © 2026 Bản quyền thuộc về Công ty TNHH RainbowFood
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        Địa chỉ: Khu đô thị Đại học Quốc gia TP.HCM, Dĩ An, Bình Dương. Điện thoại: 1900 1234 567
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        Mã số doanh nghiệp: 0123456789 do Sở Kế hoạch & Đầu tư cấp lần đầu ngày 01/01/2026
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Chịu trách nhiệm quản lý nội dung: Trần Phúc
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
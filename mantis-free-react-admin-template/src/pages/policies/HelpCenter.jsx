import React, { useState } from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

const HelpCenter = () => {
    const [expanded, setExpanded] = useState('panel1');
    const handleChange = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false);

    const faqs = [
        { id: 'panel1', q: 'Làm sao để tôi đặt hàng trên RainbowFood?', a: 'Rất đơn giản! Bạn chỉ cần chọn món ăn yêu thích, thêm vào giỏ hàng, điền thông tin nhận hàng và chọn phương thức thanh toán. Hệ thống sẽ gửi email xác nhận ngay sau khi đặt thành công.' },
        { id: 'panel2', q: 'RainbowFood giao hàng trong bao lâu?', a: 'Đối với thực phẩm tươi sống và đồ ăn chế biến sẵn, chúng tôi cam kết giao hỏa tốc trong vòng 30 - 60 phút nội thành.' },
        { id: 'panel3', q: 'Tôi có thể thay đổi đơn hàng sau khi đặt không?', a: 'Bạn có thể thay đổi hoặc hủy đơn trong vòng 5 phút kể từ lúc đặt. Vui lòng gọi ngay Hotline 1900 1234 567 để được hỗ trợ.' }
    ];

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Trung tâm trợ giúp</Typography>
                </Breadcrumbs>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#FF512F', textAlign: 'center' }}>TRUNG TÂM TRỢ GIÚP</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>Giải đáp nhanh chóng các thắc mắc của bạn</Typography>
                    
                    {faqs.map((faq) => (
                        <Accordion key={faq.id} expanded={expanded === faq.id} onChange={handleChange(faq.id)} sx={{ mb: 1, boxShadow: 'none', border: '1px solid #eaeaea', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<DownOutlined />} sx={{ fontWeight: 600 }}>
                                {faq.q}
                            </AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: '#fafafa', color: '#555' }}>
                                {faq.a}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>
            </Container>
        </Box>
    );
};

export default HelpCenter;
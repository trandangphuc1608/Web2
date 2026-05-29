import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, TextField, Button, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { 
    EnvironmentOutlined, PhoneOutlined, MailOutlined, SendOutlined, 
    MessageOutlined, ClockCircleOutlined, DownOutlined, ShopOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [expanded, setExpanded] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Cảm ơn ${formData.name}! Lời nhắn của bạn đã được gửi đến RainbowFood.`);
        setFormData({ name: '', phone: '', email: '', message: '' });
    };

    return (
        <Box sx={{ pb: 8, animation: 'fadeIn 0.5s ease-in-out', bgcolor: '#f4f6f8', width: '100%' }}>
            
            {/* 1. BANNER ĐẦU TRANG */}
            <Box 
                sx={{ 
                    position: 'relative', width: '100%', py: { xs: 8, md: 12 }, mb: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1920&auto=format&fit=crop")',
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }}
            >
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, color: 'white' }}>
                    <Typography variant="overline" sx={{ color: '#FF512F', fontWeight: 900, fontSize: '1.2rem', letterSpacing: 2 }}>
                        HỖ TRỢ KHÁCH HÀNG
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                        Liên Hệ Với Chúng Tôi
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, lineHeight: 1.6 }}>
                        Nếu bạn cần tư vấn về thực đơn, hỗ trợ đơn hàng hay có bất kỳ góp ý nào, đội ngũ RainbowFood luôn sẵn sàng lắng nghe và giải quyết nhanh chóng!
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl">
                
                {/* 2. THÔNG TIN LIÊN HỆ (Card Grid) */}
                <Grid container spacing={4} sx={{ mb: 10, px: { xs: 0, lg: 4 } }}>
                    {[
                        { icon: <PhoneOutlined />, title: 'Hotline Đặt Hàng', desc: '1900 6868', sub: 'Miễn phí cước gọi' },
                        { icon: <MessageOutlined />, title: 'Zalo / Messenger', desc: 'RainbowFood Support', sub: 'Chat trực tiếp 24/7' },
                        { icon: <MailOutlined />, title: 'Email Hỗ Trợ', desc: 'hotro@rainbowfood.vn', sub: 'Phản hồi trong 24h' },
                        { icon: <ClockCircleOutlined />, title: 'Giờ Hoạt Động', desc: '08:00 - 22:00', sub: 'Từ Thứ 2 - Chủ Nhật' }
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'white', border: '1px solid #f0f0f0', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#FF512F', boxShadow: '0 15px 30px rgba(255,81,47,0.1)' } }}>
                                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff0e6', color: '#FF512F', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: '28px' }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">{item.title}</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', my: 0.5 }}>{item.desc}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.sub}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* 3 & 4. FORM LIÊN HỆ & GOOGLE MAPS */}
                <Grid container spacing={6} alignItems="stretch" sx={{ mb: 12, px: { xs: 0, lg: 4 } }}>
                    
                    {/* Form Liên Hệ */}
                    <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
                        <Paper elevation={12} sx={{ width: '100%', p: { xs: 4, sm: 5 }, borderRadius: 4, boxShadow: '0 15px 50px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>Nhận Tư Vấn</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Vui lòng điền thông tin bên dưới, nhân viên sẽ liên hệ lại với bạn ngay lập tức.
                            </Typography>

                            <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <TextField fullWidth label="Họ và tên *" name="name" required value={formData.name} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                <TextField fullWidth label="Số điện thoại *" name="phone" required value={formData.phone} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                <TextField fullWidth label="Email (Tùy chọn)" type="email" name="email" value={formData.email} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                <TextField fullWidth label="Nội dung cần hỗ trợ *" name="message" required multiline rows={4} value={formData.message} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                
                                <Button 
                                    type="submit" variant="contained" size="large" 
                                    endIcon={<SendOutlined />}
                                    sx={{ 
                                        mt: 'auto', py: 1.8, borderRadius: 2, fontWeight: 800, fontSize: '1.1rem',
                                        background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)',
                                        boxShadow: '0 8px 20px rgba(255, 81, 47, 0.3)', textTransform: 'none'
                                    }}
                                >
                                    Gửi Yêu Cầu
                                </Button>
                            </form>
                        </Paper>
                    </Grid>

                    {/* Google Maps */}
                    <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
                        <Paper elevation={0} sx={{ width: '100%', borderRadius: 4, overflow: 'hidden', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EnvironmentOutlined style={{ color: '#FF512F', fontSize: '20px' }} />
                                <Typography fontWeight="bold">Trụ sở chính: Lô E2a-7, Đường D1, TP. Thủ Đức, TP. HCM</Typography>
                            </Box>
                            
                            {/* KHU VỰC ÉP BẢN ĐỒ FULL KÍCH THƯỚC */}
                            <Box sx={{ position: 'relative', width: '100%', flexGrow: 1, minHeight: '400px' }}>
                                <iframe 
                                    title="RainbowFood Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105370224!2d106.80730807583874!3d10.84112758931162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1715694266205!5m2!1svi!2s" 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                                    allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* 5. FAQ NGẮN (Câu hỏi thường gặp) */}
                <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 12 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 4, textAlign: 'center' }}>Câu Hỏi Thường Gặp</Typography>
                    
                    {[
                        { q: 'Bao lâu thì tôi nhận được đồ ăn?', a: 'Thông thường RainbowFood sẽ giao hàng trong vòng 20 - 30 phút tùy thuộc vào khoảng cách từ cửa hàng gần nhất đến địa chỉ của bạn.' },
                        { q: 'Cửa hàng có hỗ trợ thanh toán khi nhận hàng (COD) không?', a: 'Có! Bạn hoàn toàn có thể chọn thanh toán bằng tiền mặt khi nhận đồ ăn. Ngoài ra chúng tôi còn hỗ trợ thanh toán qua thẻ Visa, VNPay và ví MoMo.' },
                        { q: 'Tôi muốn thay đổi hoặc hủy đơn hàng thì làm thế nào?', a: 'Bạn có thể hủy hoặc thay đổi món trong vòng 3 phút đầu tiên kể từ khi đặt hàng thành công bằng cách gọi ngay vào Hotline 1900 6868.' },
                        { q: 'Thức ăn giao đến bị nguội hoặc sai món thì sao?', a: 'RainbowFood cam kết đổi trả 100% hoặc hoàn tiền nếu món ăn giao đến bị sai lệch so với đơn đặt hàng hoặc không đảm bảo chất lượng nóng hổi.' }
                    ].map((faq, idx) => (
                        <Accordion 
                            key={idx} 
                            expanded={expanded === `panel${idx}`} 
                            onChange={handleAccordionChange(`panel${idx}`)}
                            sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}
                        >
                            <AccordionSummary expandIcon={<DownOutlined />} sx={{ p: 2 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: expanded === `panel${idx}` ? '#FF512F' : '#1e293b' }}>
                                    {faq.q}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 2, pb: 3, pt: 0 }}>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>{faq.a}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* 6. CTA CUỐI TRANG */}
                <Paper elevation={0} sx={{ p: { xs: 5, md: 8 }, borderRadius: 6, bgcolor: '#1e293b', color: 'white', textAlign: 'center', mb: 4, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
                    <Typography variant="h3" fontWeight="900" mb={2}>Bạn Đã Sẵn Sàng Thưởng Thức?</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8, mb: 5, maxWidth: '600px', mx: 'auto' }}>
                        Đội ngũ đầu bếp và giao hàng của RainbowFood đã sẵn sàng phục vụ bạn bữa ăn tuyệt vời nhất ngay bây giờ.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button component={Link} to="/" variant="contained" size="large" startIcon={<ShopOutlined />} sx={{ py: 1.5, px: 5, borderRadius: 30, fontWeight: 800, bgcolor: '#FF512F', '&:hover': { bgcolor: '#e03e1c' } }}>
                            ĐẶT MÓN NGAY
                        </Button>
                        <Button variant="outlined" size="large" startIcon={<MessageOutlined />} sx={{ py: 1.5, px: 5, borderRadius: 30, fontWeight: 800, color: 'white', borderColor: 'white', '&:hover': { borderColor: '#FF512F', color: '#FF512F', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            CHAT VỚI CHUYÊN VIÊN
                        </Button>
                    </Stack>
                </Paper>

            </Container>
        </Box>
    );
}
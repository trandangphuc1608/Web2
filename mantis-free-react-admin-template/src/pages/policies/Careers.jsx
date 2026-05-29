import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Paper, Grid, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Careers = () => {
    const jobs = [
        { title: 'Nhân Viên Giao Hàng (Shipper)', type: 'Toàn thời gian / Bán thời gian', salary: '10 - 15 triệu/tháng' },
        { title: 'Nhân Viên Bếp / Chế Biến', type: 'Toàn thời gian', salary: '8 - 12 triệu/tháng' },
        { title: 'Chuyên Viên CSKH', type: 'Bán thời gian', salary: 'Thỏa thuận' },
    ];

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
                    <Typography color="text.primary">Tuyển dụng</Typography>
                </Breadcrumbs>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#333' }}>GIA NHẬP ĐỘI NGŨ RAINBOWFOOD</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Cùng chúng tôi mang những bữa ăn ngon đến mọi nhà</Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                        {jobs.map((job, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Box sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" fontWeight={700} color="#FF512F">{job.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{job.type}</Typography>
                                    <Typography variant="body2" fontWeight={600} sx={{ mt: 1, mb: 3 }}>Lương: {job.salary}</Typography>
                                    <Button variant="outlined" color="warning" sx={{ mt: 'auto', borderRadius: 8 }}>Ứng Tuyển Ngay</Button>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Careers;
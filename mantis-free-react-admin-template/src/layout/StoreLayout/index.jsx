import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress,
    Grid, Paper, Stack, Divider
} from '@mui/material';
import { 
    ShoppingCartOutlined, UserOutlined, LogoutOutlined, 
    FireFilled, RocketOutlined, FacebookOutlined, GithubOutlined, LinkedinOutlined, 
    EnvironmentOutlined, PhoneOutlined, MailOutlined
} from '@ant-design/icons';
import AIChatBox from 'sections/AIChatBox';

export default function StoreLayout() {
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    
    // Auth States
    const [authOpen, setAuthOpen] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isForgotMode, setIsForgotMode] = useState(false); // Thêm state quản lý Quên mật khẩu
    
    // Form States
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState(''); // Lưu email khôi phục
    const [forgotMessage, setForgotMessage] = useState(null); // Lưu thông báo gửi email

    const [isProcessing, setIsProcessing] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
        setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    useEffect(() => {
        updateCartCount();
        const loggedUser = JSON.parse(localStorage.getItem('rainbow_user'));
        if (loggedUser) setUser(loggedUser);

        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    // XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ
    const handleAuth = async () => {
        if (!loginName.trim() || !loginPassword.trim()) {
            return alert("Vui lòng nhập đầy đủ tên và mật khẩu!");
        }
        
        setIsProcessing(true);
        const endpoint = isLoginMode ? 'login' : 'register';

        try {
            const response = await fetch(`http://localhost:8900/api/accounts/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: loginName, password: loginPassword })
            });

            if (response.ok) {
                const userData = await response.json();
                const userInfo = { id: userData.id, name: userData.userName };
                
                localStorage.setItem('rainbow_user', JSON.stringify(userInfo));
                setUser(userInfo);
                
                alert(isLoginMode ? "Đăng nhập thành công!" : "Đăng ký thành công!");
                
                setAuthOpen(false);
                setLoginName('');
                setLoginPassword('');
            } else {
                if (response.status === 401) alert("Tên đăng nhập hoặc mật khẩu không đúng!");
                else if (response.status === 409) alert("Tên này đã có người sử dụng. Hãy chọn tên khác!");
                else alert("Có lỗi xảy ra từ máy chủ!");
            }
        } catch (error) {
            alert("Lỗi kết nối đến Backend Server!");
        } finally {
            setIsProcessing(false);
        }
    };

    // XỬ LÝ QUÊN MẬT KHẨU
    const handleForgotPassword = async () => {
        if (!forgotEmail.trim()) {
            return alert("Vui lòng nhập địa chỉ email của bạn!");
        }

        setIsProcessing(true);
        setForgotMessage(null);

        try {
            const response = await fetch(`http://localhost:8900/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });

            if (response.ok) {
                setForgotMessage({ type: 'success', text: 'Mã xác nhận đã được gửi đến email của bạn!' });
            } else {
                setForgotMessage({ type: 'error', text: 'Email không tồn tại trong hệ thống!' });
            }
        } catch (error) {
            setForgotMessage({ type: 'error', text: 'Lỗi kết nối đến máy chủ!' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('rainbow_user');
        setUser(null);
        navigate('/');
    };

    const openAuthModal = () => {
        setLoginName('');
        setLoginPassword('');
        setForgotEmail('');
        setForgotMessage(null);
        setIsLoginMode(true);
        setIsForgotMode(false);
        setAuthOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            
            {/* NAVBAR HIỆU ỨNG KÍNH (GLASSMORPHISM) */}
            <AppBar 
                position="sticky" 
                elevation={0} 
                sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.85)', 
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    color: 'text.primary',
                    zIndex: 1000
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ py: 1 }}>
                        {/* Logo */}
                        <Typography 
                            variant="h3" 
                            component={Link} 
                            to="/" 
                            sx={{ 
                                flexGrow: 1, 
                                fontWeight: 800, 
                                textDecoration: 'none',
                                background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'flex', alignItems: 'center', gap: 1
                            }}
                        >
                            🍔 RainbowFood
                        </Typography>
                        
                        {/* Menu Links */}
                        <Button component={Link} to="/" sx={{ mr: 2, fontWeight: 600, color: 'text.secondary', '&:hover': { color: '#FF512F', bgcolor: 'transparent' } }}>
                            Thực đơn
                        </Button>
                        
                        {user && (
                            <Button component={Link} to="/history" sx={{ mr: 2, fontWeight: 600, color: 'text.secondary', '&:hover': { color: '#FF512F', bgcolor: 'transparent' } }}>
                                Lịch sử mua hàng
                            </Button>
                        )}
                        
                        {/* User / Login Actions */}
                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2, bgcolor: '#fff0e6', px: 2, py: 0.8, borderRadius: '20px', border: '1px solid #ffe0cc' }}>
                                <UserOutlined style={{ color: '#FF512F' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#d43b11' }}>Chào, {user.name}</Typography>
                                <IconButton size="small" sx={{ color: '#d43b11' }} onClick={handleLogout} title="Đăng xuất"><LogoutOutlined /></IconButton>
                            </Box>
                        ) : (
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    mr: 2, borderRadius: '20px', px: 3, fontWeight: 600,
                                    background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)',
                                    boxShadow: '0 4px 14px 0 rgba(255, 81, 47, 0.39)'
                                }} 
                                onClick={openAuthModal}
                            >
                                Đăng nhập
                            </Button>
                        )}

                        {/* Cart Icon */}
                        <IconButton component={Link} to="/cart" size="large" sx={{ bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { bgcolor: '#f9f9f9' } }}>
                            <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
                                <ShoppingCartOutlined style={{ color: '#333' }} />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* HERO BANNER CHỈ HIỆN Ở TRANG CHỦ (/) */}
            {location.pathname === '/' && (
                <Box sx={{ p: 2 }}>
                    <Container maxWidth="xl">
                        <Paper 
                            elevation={0}
                            sx={{ 
                                borderRadius: 4, 
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, #FF9D6C 0%, #BB4E75 100%)',
                                color: 'white',
                                py: { xs: 6, md: 10 },
                                px: { xs: 3, md: 8 },
                                position: 'relative',
                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'
                            }}
                        >
                            <Box sx={{ zIndex: 2, maxWidth: '600px' }}>
                                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                    Đói bụng chưa? <br/> Thưởng thức tinh hoa ẩm thực!
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, opacity: 0.9, lineHeight: 1.5 }}>
                                    RainbowFood mang đến những món ăn nóng hổi, giòn rụm và thơm ngon nhất ngay tận cửa nhà bạn chỉ trong 30 phút.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    startIcon={<RocketOutlined />}
                                    sx={{ 
                                        bgcolor: '#fff', color: '#BB4E75', fontWeight: 700, px: 4, py: 1.5, borderRadius: '30px',
                                        '&:hover': { bgcolor: '#f0f0f0', transform: 'translateY(-2px)' },
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
                                >
                                    Khám phá thực đơn
                                </Button>
                            </Box>
                            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                            <Box sx={{ position: 'absolute', bottom: -100, right: 150, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                        </Paper>
                    </Container>
                </Box>
            )}

            {/* VÙNG CHỨA NỘI DUNG CHÍNH */}
            <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </Container>

            {/* CHÂN TRANG (FOOTER) */}
            <Box component="footer" sx={{ bgcolor: '#ffffff', pt: 8, pb: 4, borderTop: '1px solid #eaeaea', mt: 'auto' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4} justifyContent="space-between">
                        
                        {/* CỘT 1: THƯƠNG HIỆU & GIỚI THIỆU */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF512F', mb: 2 }}>
                                🍔 RainbowFood
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                                Hệ thống đặt đồ ăn nhanh chóng, tiện lợi và an toàn. Cam kết mang lại trải nghiệm ẩm thực tuyệt vời nhất cho bạn mỗi ngày.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton size="small" sx={{ color: '#1877F2', bgcolor: '#f0f2f5', '&:hover': { bgcolor: '#e4e6eb' } }}>
                                    <FacebookOutlined />
                                </IconButton>
                                <IconButton size="small" sx={{ color: '#333', bgcolor: '#f0f2f5', '&:hover': { bgcolor: '#e4e6eb' } }}>
                                    <GithubOutlined />
                                </IconButton>
                                <IconButton size="small" sx={{ color: '#0A66C2', bgcolor: '#f0f2f5', '&:hover': { bgcolor: '#e4e6eb' } }}>
                                    <LinkedinOutlined />
                                </IconButton>
                            </Stack>
                        </Grid>

                        {/* CỘT 2, 3, 4: LIÊN KẾT & HỖ TRỢ */}
                        <Grid item xs={12} md={8} lg={8}>
                            <Grid container spacing={4}>
                                
                                {/* Cột Về chúng tôi */}
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                                        Về chúng tôi
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {['Giới thiệu', 'Cửa hàng', 'Blog ẩm thực', 'Tuyển dụng'].map(item => (
                                            <Typography key={item} variant="body2" color="text.secondary" sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { color: '#FF512F', transform: 'translateX(4px)' } }}>
                                                {item}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Grid>

                                {/* Cột Hỗ trợ */}
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                                        Hỗ trợ khách hàng
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {['Trung tâm trợ giúp', 'Chính sách bảo mật', 'Điều khoản dịch vụ', 'Hoàn tiền & Khiếu nại'].map(item => (
                                            <Typography key={item} variant="body2" color="text.secondary" sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { color: '#FF512F', transform: 'translateX(4px)' } }}>
                                                {item}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Grid>

                                {/* Cột Liên hệ */}
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                                        Liên hệ
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <EnvironmentOutlined style={{ color: '#FF512F', marginTop: '4px' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Khu vực TP. Thủ Đức,<br/>TP. Hồ Chí Minh
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <PhoneOutlined style={{ color: '#FF512F' }} />
                                            <Typography variant="body2" color="text.secondary">1900 6868</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <MailOutlined style={{ color: '#FF512F' }} />
                                            <Typography variant="body2" color="text.secondary">hotro@rainbowfood.vn</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4, borderColor: '#f0f0f0' }} />

                    {/* BẢN QUYỀN & PHƯƠNG THỨC THANH TOÁN */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                            © {new Date().getFullYear()} RainbowFood. Đồ án tốt nghiệp - Phát triển bởi Phúc Trần.
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: 0.7 }}>
                            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" height="24" />
                            <img src="https://vnpay.vn/s1/vnpay/logo.svg" alt="VNPAY" height="20" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" height="16" />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Popup Đăng Nhập / Đăng Ký / Quên Mật Khẩu */}
            <Dialog open={authOpen} onClose={() => !isProcessing && setAuthOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: '1.5rem', pb: 1, color: '#333' }}>
                    {isForgotMode ? 'QUÊN MẬT KHẨU' : (isLoginMode ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN')}
                </DialogTitle>
                
                <DialogContent>
                    {isForgotMode ? (
                        // ================= FORM QUÊN MẬT KHẨU =================
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã khôi phục cho bạn.
                            </Typography>
                            
                            {forgotMessage && (
                                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: forgotMessage.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {forgotMessage.text}
                                </Typography>
                            )}

                            <TextField 
                                fullWidth 
                                label="Địa chỉ Email" 
                                variant="outlined" 
                                margin="normal" 
                                type="email" 
                                value={forgotEmail} 
                                onChange={(e) => setForgotEmail(e.target.value)} 
                                disabled={isProcessing} 
                            />
                            
                            <Typography 
                                variant="body2" 
                                sx={{ mt: 3, textAlign: 'center', cursor: 'pointer', color: 'text.secondary', fontWeight: 600, '&:hover': { color: '#FF512F' } }} 
                                onClick={() => { if(!isProcessing) { setIsForgotMode(false); setForgotMessage(null); } }}
                            >
                                ← Quay lại đăng nhập
                            </Typography>
                        </Box>
                    ) : (
                        // ================= FORM ĐĂNG NHẬP / ĐĂNG KÝ =================
                        <Box sx={{ mt: 1 }}>
                            <TextField fullWidth label="Tên hiển thị" variant="outlined" margin="normal" value={loginName} onChange={(e) => setLoginName(e.target.value)} disabled={isProcessing} />
                            <TextField fullWidth label="Mật khẩu" type="password" variant="outlined" margin="normal" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyPress={(e) => { if(e.key === 'Enter') handleAuth(); }} disabled={isProcessing} />
                            
                            {isLoginMode && (
                                <Typography 
                                    variant="body2" 
                                    sx={{ mt: 1, textAlign: 'right', cursor: 'pointer', color: 'text.secondary', '&:hover': { color: '#FF512F' } }} 
                                    onClick={() => { if(!isProcessing) { setIsForgotMode(true); setForgotMessage(null); setForgotEmail(''); } }}
                                >
                                    Quên mật khẩu?
                                </Typography>
                            )}

                            <Typography 
                                variant="body2" 
                                sx={{ mt: 3, textAlign: 'center', cursor: 'pointer', color: '#FF512F', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }} 
                                onClick={() => { if(!isProcessing) setIsLoginMode(!isLoginMode) }}
                            >
                                {isLoginMode ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        size="large" 
                        onClick={isForgotMode ? handleForgotPassword : handleAuth} 
                        disabled={isProcessing} 
                        sx={{ py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)', fontWeight: 'bold' }}
                    >
                        {isProcessing 
                            ? <CircularProgress size={24} color="inherit" /> 
                            : (isForgotMode ? 'GỬI YÊU CẦU' : (isLoginMode ? 'VÀO CỬA HÀNG' : 'ĐĂNG KÝ'))
                        }
                    </Button>
                </DialogActions>
            </Dialog>
            <AIChatBox />
        </Box>
    );
}
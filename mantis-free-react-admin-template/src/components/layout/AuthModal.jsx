import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, TextField, Button, CircularProgress, Divider, Stack } from '@mui/material';
import { GoogleOutlined, FacebookFilled } from '@ant-design/icons';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login'; // Import thư viện mới

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

const GoogleLoginButton = ({ onGoogleSuccess, disabled }) => {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => onGoogleSuccess(tokenResponse.access_token),
        onError: () => alert("Đăng nhập Google thất bại!")
    });
    return (
        <Button fullWidth variant="outlined" startIcon={<GoogleOutlined style={{ color: '#DB4437' }} />} onClick={() => login()} disabled={disabled} sx={{ color: '#333', borderColor: '#eaeaea', borderRadius: 2, py: 1, '&:hover': { bgcolor: '#f9f9f9', borderColor: '#ddd' } }}>
            Google
        </Button>
    );
};

export default function AuthModal({ open, onClose, onLoginSuccess }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAuth = async () => {
        setIsProcessing(true);
        const endpoint = isLoginMode ? 'login' : 'register';
        try {
            const response = await fetch(`http://localhost:8900/api/accounts/${endpoint}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: loginName, password: loginPassword })
            });
            if (response.ok) {
                const userData = await response.json();
                onLoginSuccess({ id: userData.id, name: userData.userName });
                handleClose();
            } else alert("Đăng nhập thất bại!");
        } catch (error) { alert("Lỗi server!"); }
        finally { setIsProcessing(false); }
    };

    const handleGoogleSuccess = async (token) => {
        setIsProcessing(true);
        try {
            const response = await fetch('http://localhost:8900/api/accounts/google', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            if (response.ok) {
                const userData = await response.json();
                onLoginSuccess({ id: userData.id, name: userData.userName });
                handleClose();
            }
        } finally { setIsProcessing(false); }
    };

    const handleFacebookSuccess = async (response) => {
        setIsProcessing(true);
        try {
            const res = await fetch('http://localhost:8900/api/accounts/facebook', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: response.accessToken })
            });
            if (res.ok) {
                const userData = await res.json();
                onLoginSuccess({ id: userData.id, name: userData.userName });
                handleClose();
            }
        } finally { setIsProcessing(false); }
    };

    const handleClose = () => { onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>{isLoginMode ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <TextField fullWidth label="Tên hiển thị" margin="normal" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
                    <TextField fullWidth label="Mật khẩu" type="password" margin="normal" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    <Button variant="contained" fullWidth size="large" onClick={handleAuth} sx={{ mt: 3, py: 1.5, borderRadius: 2 }}>
                        {isProcessing ? <CircularProgress size={24}/> : (isLoginMode ? 'VÀO CỬA HÀNG' : 'ĐĂNG KÝ')}
                    </Button>
                    <Box sx={{ my: 3 }}><Divider>HOẶC</Divider></Box>
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <Stack direction="row" spacing={2}>
                            <GoogleLoginButton onGoogleSuccess={handleGoogleSuccess} disabled={isProcessing} />
                            <FacebookLogin
                                    appId={FACEBOOK_APP_ID}
                                    autoLoad={false}
                                    fields="name,picture" 
                                    scope="public_profile"
                                    onSuccess={handleFacebookSuccess}
                                    onFail={(error) => {
                                        console.error("Facebook Login Error:", error);
                                        alert("Đăng nhập Facebook thất bại!");
                                    }}
                                    render={({ onClick }) => (
                                        <Button 
                                            fullWidth variant="outlined" startIcon={<FacebookFilled style={{ color: '#1877F2' }} />}
                                            onClick={onClick} disabled={isProcessing}
                                            sx={{ color: '#333', borderColor: '#eaeaea', borderRadius: 2, py: 1, '&:hover': { bgcolor: '#f9f9f9', borderColor: '#ddd' } }}
                                        >
                                            Facebook
                                        </Button>
                                    )}
                                />
                        </Stack>
                    </GoogleOAuthProvider>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
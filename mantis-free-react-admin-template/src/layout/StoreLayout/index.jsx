import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AIChatBox from 'sections/AIChatBox';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroBanner from '../../components/layout/HeroBanner';
import AuthModal from '../../components/layout/AuthModal';

export default function StoreLayout() {
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [authOpen, setAuthOpen] = useState(false);
    
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('rainbow_user');
        setUser(null);
        navigate('/');
    };

    const handleLoginSuccess = (userInfo) => {
        localStorage.setItem('rainbow_user', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            
            <Header 
                user={user} 
                cartCount={cartCount} 
                onLoginClick={() => setAuthOpen(true)} 
                onLogout={handleLogout} 
            />

            <HeroBanner />

            <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </Container>

            <Footer />

            <AuthModal 
                open={authOpen} 
                onClose={() => setAuthOpen(false)} 
                onLoginSuccess={handleLoginSuccess} 
            />
            
            <AIChatBox />
            
        </Box>
    );
}
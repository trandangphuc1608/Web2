import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Grid, Typography, Box, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
        setCartItems(cart);
    }, []);

    const handleRemoveItem = (index) => {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        setCartItems(newCart);
        localStorage.setItem('rainbow_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
    };

    // ==============================|| XỬ LÝ THANH TOÁN (KẾT NỐI API) ||============================== //
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        
        // KIỂM TRA ĐĂNG NHẬP TRƯỚC KHI ĐẶT HÀNG
        const currentUser = JSON.parse(localStorage.getItem('rainbow_user'));
        if (!currentUser) {
            alert("Vui lòng đăng nhập ở góc trên bên phải trước khi đặt hàng nhé!");
            return;
        }

        setIsProcessing(true);
        const cartId = new Date().getTime().toString();
        const userId = currentUser.id; // LẤY ID THẬT CỦA USER

        try {
            for (const item of cartItems) {
                const productId = item.product.id || item.product.productId;
                await fetch(`http://localhost:8900/api/shop/cart?productId=${productId}&quantity=${item.quantity}`, {
                    method: 'POST', headers: { 'Cart-Id': cartId }
                });
            }
            const orderRes = await fetch(`http://localhost:8900/api/shop/order/${userId}`, {
                method: 'POST', headers: { 'Cart-Id': cartId }
            });

            if (orderRes.ok) {
                alert('🎉 Đặt hàng thành công! Cửa hàng đang chuẩn bị món cho bạn.');
                localStorage.removeItem('rainbow_cart');
                setCartItems([]);
                window.dispatchEvent(new Event('cartUpdated')); 
            } else {
                alert('Có lỗi xảy ra trong quá trình tạo đơn.');
            }
        } catch (error) {
            alert("Lỗi kết nối đến máy chủ Backend!");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Button component={Link} to="/" startIcon={<ArrowLeftOutlined />} sx={{ mb: 2 }}>
                    Tiếp tục mua sắm
                </Button>
                <MainCard title="Giỏ hàng của bạn">
                    {cartItems.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ py: 5 }}>
                            Giỏ hàng đang trống. Hãy chọn vài món ngon nhé!
                        </Typography>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell align="center">Đơn giá</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                        <TableCell align="right">Thành tiền</TableCell>
                                        <TableCell align="center">Xóa</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>
                                                {item.product.productName || item.product.name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(item.product.price || 0).toLocaleString('vi-VN')} ₫
                                            </TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                {((item.product.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fafafa', mt: 2, borderRadius: 1 }}>
                                <Typography variant="h5">Tổng cộng:</Typography>
                                <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>
                                    {calculateTotal().toLocaleString('vi-VN')} ₫
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 3, textAlign: 'right' }}>
                                <Button 
                                    variant="contained" 
                                    size="large" 
                                    color="success" 
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'ĐANG XỬ LÝ...' : 'TIẾN HÀNH ĐẶT HÀNG'}
                                </Button>
                            </Box>
                        </TableContainer>
                    )}
                </MainCard>
            </Grid>
        </Grid>
    );
}
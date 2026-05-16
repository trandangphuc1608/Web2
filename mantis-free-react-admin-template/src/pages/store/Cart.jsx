import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Grid, Typography, Box, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Divider, Avatar
} from '@mui/material';
import { DeleteOutlined, ArrowLeftOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); 
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const location = useLocation();
    const navigate = useNavigate();

    // KIỂM TRA TRẠNG THÁI THANH TOÁN TỪ VNPAY TRẢ VỀ
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get('payment');

        if (paymentStatus === 'success') {
            // Xóa sạch giỏ hàng khi thanh toán thành công
            localStorage.removeItem('rainbow_cart');
            setCartItems([]);
            setSelectedItems([]);
            window.dispatchEvent(new Event('cartUpdated'));
            
            alert('🎉 Thanh toán VNPAY thành công! Cửa hàng đang chuẩn bị món cho bạn.');
            navigate('/cart', { replace: true }); // Xóa param trên URL cho sạch
        } else if (paymentStatus === 'failed') {
            alert('Thanh toán VNPAY thất bại hoặc đã bị hủy!');
            navigate('/cart', { replace: true });
            
            // Load lại giỏ hàng cũ vì thanh toán thất bại
            const cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
            setCartItems(cart);
            setSelectedItems(cart.map((_, index) => index));
        } else {
            // Nếu truy cập bình thường thì load giỏ hàng
            const cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
            setCartItems(cart);
            setSelectedItems(cart.map((_, index) => index)); 
        }
    }, [location.search, navigate]);

    const getValidImage = (url) => {
        if (!url) return 'https://placehold.co/400x400?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        return `http://localhost:8900/api/catalog/${finalPath}`;
    };

    const handleSelectItem = (index) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(selectedItems.filter(i => i !== index));
        } else {
            setSelectedItems([...selectedItems, index]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map((_, index) => index));
        } else {
            setSelectedItems([]);
        }
    };

    const handleUpdateQuantity = (index, delta) => {
        const newCart = [...cartItems];
        const newQuantity = newCart[index].quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 50) { 
            newCart[index].quantity = newQuantity;
            setCartItems(newCart);
            localStorage.setItem('rainbow_cart', JSON.stringify(newCart));
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    const handleRemoveItem = (index) => {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        setCartItems(newCart);
        localStorage.setItem('rainbow_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));

        const newSelected = selectedItems
            .filter(i => i !== index)
            .map(i => i > index ? i - 1 : i);
        setSelectedItems(newSelected);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item, index) => {
            if (selectedItems.includes(index)) {
                return total + (item.product.price || 0) * item.quantity;
            }
            return total;
        }, 0);
    };

    const handleCheckout = async () => {
        const itemsToCheckout = cartItems.filter((_, index) => selectedItems.includes(index));

        if (itemsToCheckout.length === 0) {
            alert("Vui lòng tick chọn ít nhất 1 sản phẩm để thanh toán!");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('rainbow_user'));
        if (!currentUser) {
            alert("Vui lòng đăng nhập trước khi đặt hàng!");
            return;
        }

        setIsProcessing(true);
        const cartId = new Date().getTime().toString();
        const userId = currentUser.id;

        try {
            for (const item of itemsToCheckout) {
                const productId = item.product.id || item.product.productId;
                await fetch(
                    `http://localhost:8900/api/shop/cart?productId=${productId}&quantity=${item.quantity}`,
                    { method: 'POST', headers: { 'Cart-Id': cartId } }
                );
            }

            const orderRes = await fetch(
                `http://localhost:8900/api/shop/order/${userId}`,
                { method: 'POST', headers: { 'Cart-Id': cartId } }
            );

            if (orderRes.ok) {
                let orderId = null;
                const responseData = await orderRes.text();
                try {
                    const parsedData = JSON.parse(responseData);
                    orderId = parsedData.id || parsedData.orderId || parsedData;
                } catch (e) {
                    orderId = responseData; 
                }

                if (paymentMethod === 'vnpay') {
                    if (!orderId) {
                        alert("Không lấy được mã đơn hàng để thanh toán VNPAY!");
                        return;
                    }
                    
                    const vnpayRes = await fetch(`http://localhost:8900/api/shop/payment/create/${orderId}`, {
                        method: 'GET'
                    });

                    if (vnpayRes.ok) {
                        const paymentUrl = await vnpayRes.text(); 
                        
                        window.location.href = paymentUrl;
                        //window.open(paymentUrl, '_blank');

                    } else {
                        alert("Lỗi khi tạo link thanh toán VNPAY!");
                    }
                } else {
                    // Nếu là TIỀN MẶT thì xử lý bình thường
                    const remainingCart = cartItems.filter((_, index) => !selectedItems.includes(index));
                    localStorage.setItem('rainbow_cart', JSON.stringify(remainingCart));
                    setCartItems(remainingCart);
                    setSelectedItems([]); 
                    window.dispatchEvent(new Event('cartUpdated'));

                    alert('🎉 Đặt hàng thành công! Cửa hàng đang chuẩn bị món cho bạn.');
                }
            } else {
                alert('Có lỗi khi tạo đơn!');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối server!');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 4, lg: 6, xl: 10 } }}>
            <Button
                component={Link}
                to="/"
                startIcon={<ArrowLeftOutlined />}
                sx={{ mb: 4, fontWeight: 'bold', fontSize: '1rem' }}
            >
                Tiếp tục mua sắm
            </Button>

            {cartItems.length === 0 ? (
                <MainCard title="Giỏ hàng">
                    <Typography variant="h5" align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        Giỏ hàng đang trống. Hãy chọn vài món ngon nhé!
                    </Typography>
                </MainCard>
            ) : (
                <Grid container spacing={4} alignItems="flex-start" sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

                    {/* CỘT TRÁI (SẢN PHẨM) */}
                    <Grid item xs={12} md={8} lg={8} sx={{ width: '100%', minWidth: 0 }}>
                        <MainCard
                            title={`Giỏ hàng (${cartItems.length} sản phẩm)`}
                            content={false}
                            sx={{ height: '100%' }}
                        >
                            <TableContainer sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 600 }}>
                                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                                        <TableRow>
                                            <TableCell padding="checkbox" sx={{ pl: 2 }}>
                                                <Checkbox 
                                                    color="primary"
                                                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 15 }}>Sản phẩm</TableCell>
                                            <TableCell align="center">Đơn giá</TableCell>
                                            <TableCell align="center">Số lượng</TableCell>
                                            <TableCell align="right">Thành tiền</TableCell>
                                            <TableCell align="center">Xóa</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {cartItems.map((item, index) => {
                                            const isSelected = selectedItems.includes(index);
                                            const productName = item.product.productName || item.product.name;
                                            const productImage = item.product.imageUrl || item.product.image || item.product.picture;

                                            return (
                                                <TableRow key={index} hover selected={isSelected}>
                                                    <TableCell padding="checkbox" sx={{ pl: 2 }}>
                                                        <Checkbox 
                                                            color="primary"
                                                            checked={isSelected}
                                                            onChange={() => handleSelectItem(index)}
                                                        />
                                                    </TableCell>

                                                    <TableCell sx={{ maxWidth: 300 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar 
                                                                variant="rounded" 
                                                                src={getValidImage(productImage)} 
                                                                sx={{ width: 56, height: 56, border: '1px solid #f0f0f0' }} 
                                                            />
                                                            <Typography 
                                                                title={productName}
                                                                sx={{ 
                                                                    fontWeight: 600, 
                                                                    fontSize: 15,
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                            >
                                                                {productName}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                        {(item.product.price || 0).toLocaleString('vi-VN')} ₫
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                                                            <IconButton size="small" onClick={() => handleUpdateQuantity(index, -1)} disabled={item.quantity <= 1}>
                                                                <MinusOutlined style={{ fontSize: '14px' }} />
                                                            </IconButton>
                                                            <Typography sx={{ px: 1.5, minWidth: 20, textAlign: 'center', fontWeight: 'bold' }}>
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton size="small" onClick={() => handleUpdateQuantity(index, 1)} disabled={item.quantity >= 50}>
                                                                <PlusOutlined style={{ fontSize: '14px' }} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
                                                        {((item.product.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                                                            <DeleteOutlined />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>
                    </Grid>

                    {/* CỘT PHẢI (THANH TOÁN) */}
                    <Grid item xs={12} md={4} lg={4} sx={{ width: '100%', minWidth: { md: 320 } }}>
                        <Box sx={{ position: 'sticky', top: 24 }}>
                            <MainCard title="Tóm tắt đơn hàng" sx={{ p: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body1" color="text.secondary">Tạm tính ({selectedItems.length} món):</Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {calculateTotal().toLocaleString('vi-VN')} ₫
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" color="text.secondary">Tổng cộng:</Typography>
                                    <Typography variant="h3" color="error" fontWeight={900}>
                                        {calculateTotal().toLocaleString('vi-VN')} ₫
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <FormLabel sx={{ mb: 1.5, fontWeight: 'bold', color: 'text.primary' }}>
                                        Phương thức thanh toán
                                    </FormLabel>

                                    <RadioGroup
                                        row
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        sx={{ display: 'flex', gap: 1.5, flexWrap: 'nowrap' }}
                                    >
                                        <Paper 
                                            variant="outlined" 
                                            onClick={() => setPaymentMethod('cash')}
                                            sx={{ 
                                                flex: 1, 
                                                p: 1.5, 
                                                borderColor: paymentMethod === 'cash' ? 'error.main' : 'divider', 
                                                bgcolor: paymentMethod === 'cash' ? '#fff1f0' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                minWidth: 0
                                            }}
                                        >
                                            <FormControlLabel
                                                value="cash"
                                                control={<Radio color="error" size="small" />}
                                                label={<Typography variant="body2" fontWeight={paymentMethod === 'cash' ? 'bold' : 'normal'} noWrap>Tiền mặt</Typography>}
                                                sx={{ width: '100%', m: 0 }}
                                            />
                                        </Paper>

                                        <Paper 
                                            variant="outlined" 
                                            onClick={() => setPaymentMethod('vnpay')}
                                            sx={{ 
                                                flex: 1, 
                                                p: 1.5, 
                                                borderColor: paymentMethod === 'vnpay' ? 'primary.main' : 'divider', 
                                                bgcolor: paymentMethod === 'vnpay' ? '#e6f7ff' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                minWidth: 0
                                            }}
                                        >
                                            <FormControlLabel
                                                value="vnpay"
                                                control={<Radio color="primary" size="small" />}
                                                label={<Typography variant="body2" fontWeight={paymentMethod === 'vnpay' ? 'bold' : 'normal'} noWrap>VNPAY</Typography>}
                                                sx={{ width: '100%', m: 0 }}
                                            />
                                        </Paper>
                                    </RadioGroup>
                                </FormControl>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    color={paymentMethod === 'vnpay' ? 'primary' : 'success'}
                                    onClick={handleCheckout}
                                    disabled={isProcessing || selectedItems.length === 0}
                                    sx={{ py: 1.8, fontSize: '1.1rem', fontWeight: 'bold' }}
                                >
                                    {isProcessing ? 'ĐANG XỬ LÝ...' : (paymentMethod === 'vnpay' ? 'THANH TOÁN VNPAY' : 'ĐẶT HÀNG')}
                                </Button>
                            </MainCard>
                        </Box>
                    </Grid>

                </Grid>
            )}
        </Container>
    );
}
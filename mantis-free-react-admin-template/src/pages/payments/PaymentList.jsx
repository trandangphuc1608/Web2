import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Button, Chip
} from '@mui/material';
import { DollarOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';

export default function PaymentList() {
    const [unpaidOrders, setUnpaidOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchUnpaidOrders = () => {
        const timestamp = new Date().getTime();
        fetch(`http://localhost:8900/api/shop/orders?t=${timestamp}`)
            .then(res => {
                if (!res.ok) return [];
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    // Chỉ lọc ra những đơn hàng đang chờ thanh toán
                    const pendingPayments = data
                        .filter(order => order.status === 'PAYMENT_EXPECTED')
                        .sort((a, b) => b.id - a.id);
                    setUnpaidOrders(pendingPayments);
                } else {
                    setUnpaidOrders([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi tải dữ liệu thanh toán:', err);
                setUnpaidOrders([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUnpaidOrders();
    }, []);

    const handleConfirmPayment = async (orderId) => {
        if (!window.confirm(`Xác nhận đã nhận tiền cho đơn hàng #${orderId}?`)) return;
        setProcessingId(orderId);
        
        try {
            const res = await fetch(`http://localhost:8900/api/shop/order/${orderId}/pay`, {
                method: 'POST'
            });

            if (res.ok) {
                alert('Thanh toán thành công!');
                fetchUnpaidOrders(); // Refresh lại danh sách
            } else {
                alert('Lỗi xác nhận thanh toán. Vui lòng kiểm tra lại Backend!');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Lỗi kết nối Server!');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <Typography sx={{ p: 3 }}>Đang tải dữ liệu thanh toán...</Typography>;

    return (
        <MainCard title="Xác nhận Thanh toán (Chờ thu tiền)">
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
                <Table sx={{ minWidth: 650 }} aria-label="Bảng thanh toán">
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell align="center" width="80">Mã ĐH</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell align="right">Tổng tiền cần thu</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unpaidOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Không có đơn hàng nào cần thu tiền.</TableCell>
                            </TableRow>
                        ) : (
                            unpaidOrders.map((row) => (
                                <TableRow hover key={row.id}>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" color="primary">
                                            {row.userId || row.user?.userName || 'Khách vãng lai'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body1" fontWeight="bold" color="error">
                                            {row.total ? row.total.toLocaleString('vi-VN') : '0'} ₫
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label="Chờ thanh toán" color="warning" size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            startIcon={<DollarOutlined />}
                                            onClick={() => handleConfirmPayment(row.id)}
                                            disabled={processingId === row.id}
                                            size="small"
                                        >
                                            {processingId === row.id ? 'Đang xử lý...' : 'Xác nhận thu tiền'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, IconButton, Tooltip, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Stack, Select, MenuItem, InputLabel
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchOrders = () => {
        const timestamp = new Date().getTime();
        fetch(`http://localhost:8900/api/shop/orders?t=${timestamp}`)
            .then(res => {
                // Nếu Backend báo 404 (chưa có đơn hàng) hoặc lỗi khác, trả về mảng rỗng để không bị sập React
                if (!res.ok) return []; 
                return res.json();
            })
            .then(data => {
                // Kiểm tra chắc chắn data là mảng thì mới dùng .sort()
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => b.id - a.id);
                    setOrders(sortedData);
                } else {
                    setOrders([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi tải dữ liệu đơn hàng:', err);
                setOrders([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOpenEdit = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status || 'PAYMENT_EXPECTED');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    const handleUpdateStatus = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:8900/api/shop/order/${selectedOrder.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                alert('Cập nhật trạng thái thành công!');
                setOpenDialog(false);
                fetchOrders();
            } else {
                alert('Lỗi cập nhật. Hãy kiểm tra lại Backend API!');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Lỗi kết nối Server!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAYMENT_EXPECTED':
            case 'CREATED':
            case 'PENDING': return 'warning';
            case 'SHIPPED': return 'info';
            case 'DELIVERED': return 'success';
            case 'CANCELED': return 'error';
            default: return 'default';
        }
    };

    if (loading) return <Typography sx={{ p: 3 }}>Đang tải dữ liệu đơn hàng...</Typography>;

    return (
        <>
            <MainCard title="Quản lý Đơn hàng">
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="Bảng đơn hàng">
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell align="center" width="80">Mã ĐH</TableCell>
                                <TableCell>Khách hàng (User ID)</TableCell>
                                <TableCell align="right">Tổng tiền (VNĐ)</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Chưa có đơn hàng nào.</TableCell>
                                </TableRow>
                            ) : (
                                orders.map((row) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1" color="primary">
                                                {row.userId || row.user?.userName || 'Khách vãng lai'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body1" fontWeight="bold">
                                                {row.total ? row.total.toLocaleString('vi-VN') : '0'} ₫
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={row.status || 'PAYMENT_EXPECTED'} 
                                                color={getStatusColor(row.status)} 
                                                size="small" 
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Cập nhật trạng thái">
                                                <IconButton color="primary" onClick={() => handleOpenEdit(row)}>
                                                    <EditOutlined />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle>Cập nhật Đơn hàng #{selectedOrder?.id}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <InputLabel>Trạng thái giao hàng</InputLabel>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="PAYMENT_EXPECTED">Chờ thanh toán (PAYMENT_EXPECTED)</MenuItem>
                            <MenuItem value="PENDING">Chờ xử lý (PENDING)</MenuItem>
                            <MenuItem value="SHIPPED">Đang giao (SHIPPED)</MenuItem>
                            <MenuItem value="DELIVERED">Đã giao thành công (DELIVERED)</MenuItem>
                            <MenuItem value="CANCELED">Đã hủy (CANCELED)</MenuItem>
                        </Select>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="secondary">Hủy bỏ</Button>
                    <Button onClick={handleUpdateStatus} variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
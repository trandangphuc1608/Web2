import { useEffect, useState } from 'react';
import { 
    Typography, Box, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import MainCard from 'components/MainCard';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Lấy thông tin user
        const currentUser = JSON.parse(localStorage.getItem('rainbow_user'));
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // 2. Gọi API lấy toàn bộ đơn
        fetch(`http://localhost:8900/api/shop/orders?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    
                    // CƠ CHẾ LỌC AN TOÀN TUYỆT ĐỐI: Dùng == để JS tự ép kiểu
                    const myOrders = data.filter(order => {
                        // Trích xuất ID an toàn, bất kể nó nằm ở order.user.id hay order.userId
                        const backendId = order?.user?.id || order?.userId;
                        
                        // So sánh lỏng (Ví dụ: 1 == "1" vẫn ra true)
                        return backendId == currentUser.id;
                    });
                    
                    // Sắp xếp đơn mới nhất lên đầu
                    setOrders(myOrders.sort((a, b) => b.id - a.id)); 
                }
            })
            .catch(err => console.error("Lỗi lấy lịch sử:", err))
            .finally(() => setLoading(false));
    }, []);

    // 3. Render trạng thái đẹp mắt
    const getStatusChip = (status) => {
        switch(status) {
            case 'PAYMENT_EXPECTED': 
                return <Chip label="Chờ thanh toán" color="warning" size="small" />;
            case 'PAID': 
                return <Chip label="Đã thanh toán" color="success" size="small" />;
            case 'DELIVERED': 
                return <Chip label="Đã giao hàng" color="info" size="small" />;
            default: 
                return <Chip label={status || 'Đang xử lý'} size="small" />;
        }
    };

    if (loading) return <Typography sx={{ p: 3 }}>Đang tải lịch sử mua hàng...</Typography>;

    return (
        <MainCard title="Lịch sử mua hàng của bạn">
            {orders.length === 0 ? (
                <Typography align="center" sx={{ py: 5 }} color="text.secondary">
                    Bạn chưa có đơn hàng nào.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell align="center">Mã Đơn</TableCell>
                                <TableCell>Ngày đặt hàng</TableCell>
                                <TableCell align="right">Tổng thanh toán</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((row) => (
                                <TableRow hover key={row.id}>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                        #{row.id}
                                    </TableCell>
                                    <TableCell>
                                        {row.orderedDate ? new Date(row.orderedDate).toLocaleDateString('vi-VN') : 'Hôm nay'}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                        {row.total ? row.total.toLocaleString('vi-VN') : '0'} ₫
                                    </TableCell>
                                    <TableCell align="center">
                                        {getStatusChip(row.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </MainCard>
    );
}
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, Chip, Typography, Button, IconButton, Tooltip
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = () => {
        const timestamp = new Date().getTime();
        // SỬA LOCALHOST THÀNH 127.0.0.1
        fetch(`${API_URL}/api/catalog/products?t=${timestamp}`)
            .then((response) => response.json())
            .then((data) => {
                let actualData = [];
                if (Array.isArray(data)) actualData = data;
                else if (data && Array.isArray(data.data)) actualData = data.data;
                else if (data && data._embedded && Array.isArray(data._embedded.products)) actualData = data._embedded.products;
                else if (data && Array.isArray(data.content)) actualData = data.content;

                const sortedData = actualData.sort((a, b) => {
                    const idA = a.id || a.productId || 0;
                    const idB = b.id || b.productId || 0;
                    return idB - idA;
                });

                setProducts(sortedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
        try {
            // SỬA LOCALHOST THÀNH 127.0.0.1
            const res = await fetch(`${API_URL}/api/catalog/admin/products/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setProducts(products.filter(item => (item.id || item.productId) !== id));
                alert('Xóa sản phẩm thành công!');
            } else {
                alert('Lỗi: Không thể xóa sản phẩm!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
        }
    };

    const getValidImage = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        // SỬA LOCALHOST THÀNH 127.0.0.1
        return `${API_URL}/api/catalog/${finalPath}`;
    };

    if (loading) {
        return <Typography variant="h6" sx={{ p: 3 }}>Đang tải dữ liệu...</Typography>;
    }

    const addProductButton = (
        <Button component={RouterLink} to="/admin/products/add" variant="contained" color="primary" startIcon={<PlusOutlined />}>
            Thêm sản phẩm
        </Button>
    );

    return (
        <MainCard title="Danh sách sản phẩm hệ thống" secondary={addProductButton}>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
                <Table sx={{ minWidth: 650 }} aria-label="Bảng sản phẩm">
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell align="center" width="80">ID</TableCell>
                            <TableCell width="120">Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            {/* THÊM CỘT MÔ TẢ */}
                            <TableCell width="250">Mô tả</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell align="right">Đơn giá (VNĐ)</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">Không có sản phẩm nào.</TableCell>
                            </TableRow>
                        ) : (
                            products.map((row) => {
                                const rId = row.id || row.productId;
                                const rName = row.productName || row.name || 'Không tên';
                                const rImage = row.imageUrl || row.image || row.picture;
                                const rPrice = row.price || 0;
                                const rCategory = row.category || row.categoryName || 'Chưa phân loại';
                                const rDesc = row.description || '';

                                return (
                                    <TableRow hover key={rId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{rId}</TableCell>
                                        <TableCell>
                                            <Avatar
                                                alt={rName}
                                                src={getValidImage(rImage)}
                                                variant="rounded"
                                                sx={{ width: 60, height: 60, bgcolor: '#e6f7ff', color: '#1890ff' }}
                                            >
                                                {rName.charAt(0)}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell><Typography variant="subtitle1">{rName}</Typography></TableCell>
                                        
                                        {/* HIỂN THỊ MÔ TẢ TỰ ĐỘNG CẮT NGẮN */}
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {rDesc}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>{rCategory}</TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body1" fontWeight="bold">
                                                {rPrice.toLocaleString('vi-VN')} ₫
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={(row.availability !== undefined ? row.availability : 1) > 0 ? 'Còn hàng' : 'Hết hàng'}
                                                color={(row.availability !== undefined ? row.availability : 1) > 0 ? 'success' : 'error'}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Sửa">
                                                <IconButton color="primary" component={RouterLink} to={`/admin/products/edit/${rId}`}>
                                                    <EditOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton color="error" onClick={() => handleDelete(rId)}>
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
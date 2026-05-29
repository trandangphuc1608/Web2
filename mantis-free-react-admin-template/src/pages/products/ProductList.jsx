import { useEffect, useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, Typography, Button, IconButton, Tooltip, Box,
    TextField, InputAdornment, FormControl, Select, MenuItem,
    Checkbox, Switch, TablePagination
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function ProductList() {
    // --- 1. STATES QUẢN LÝ DỮ LIỆU ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 2. STATES QUẢN LÝ BỘ LỌC ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // --- 3. STATES QUẢN LÝ BẢNG (PHÂN TRANG & CHECKBOX) ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [selected, setSelected] = useState([]);

    const fetchProducts = () => {
        const timestamp = new Date().getTime();
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

    // --- LẤY DANH SÁCH DANH MỤC (ĐỂ LÀM BỘ LỌC) ---
    const categories = useMemo(() => {
        const allCategories = products.map(p => p.category || p.categoryName || 'Chưa phân loại');
        return ['All', ...new Set(allCategories.filter(Boolean))];
    }, [products]);

    // --- XỬ LÝ LỌC SẢN PHẨM ---
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const pName = (p.productName || p.name || '').toLowerCase();
            const pCat = p.category || p.categoryName || 'Chưa phân loại';
            const isAvailable = (p.availability !== undefined ? p.availability : 1) > 0;

            const matchSearch = pName.includes(searchTerm.toLowerCase());
            const matchCat = filterCategory === 'All' || pCat === filterCategory;
            const matchStatus = filterStatus === 'All' || 
                               (filterStatus === 'InStock' && isAvailable) || 
                               (filterStatus === 'OutOfStock' && !isAvailable);

            return matchSearch && matchCat && matchStatus;
        });
    }, [products, searchTerm, filterCategory, filterStatus]);

    // --- XỬ LÝ PHÂN TRANG ---
    const handleChangePage = (event, newPage) => setPage(newPage);
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // --- XỬ LÝ CHECKBOX ---
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredProducts.map((n) => n.id || n.productId);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
        else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
        else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        setSelected(newSelected);
    };

    // --- XỬ LÝ NÚT GẠT TRẠNG THÁI (BẾP) ---
    const handleToggleStatus = async (id, currentStatus) => {
        // MẸO: Chỗ này bạn gọi API PUT để update trạng thái lên Backend nhé.
        // Dưới đây là code Update giao diện ngay lập tức (Optimistic UI Update)
        const updatedProducts = products.map(p => {
            const pId = p.id || p.productId;
            if (pId === id) {
                return { ...p, availability: currentStatus > 0 ? 0 : 1 }; // Đảo trạng thái
            }
            return p;
        });
        setProducts(updatedProducts);
    };

    // --- XỬ LÝ XÓA ---
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
        try {
            const res = await fetch(`${API_URL}/api/catalog/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(item => (item.id || item.productId) !== id));
                alert('Xóa sản phẩm thành công!');
            } else alert('Lỗi: Không thể xóa sản phẩm!');
        } catch (error) { console.error('Lỗi khi xóa:', error); }
    };

    const getValidImage = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        return `${API_URL}/api/catalog/${finalPath}`;
    };

    if (loading) return <Typography variant="h6" sx={{ p: 3 }}>Đang tải dữ liệu...</Typography>;

    // Cắt mảng sản phẩm theo trang hiện tại
    const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <MainCard title="Danh sách sản phẩm hệ thống" contentSX={{ p: 0 }}>
            
            {/* --- 1. THANH CÔNG CỤ (TOP BAR & FILTERS) --- */}
            <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
                    {/* Tìm kiếm */}
                    <TextField 
                        size="small" placeholder="Tìm tên món ăn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
                        sx={{ width: { xs: '100%', sm: 250 } }}
                    />
                    
                    {/* Lọc Danh mục */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} displayEmpty>
                            <MenuItem value="All">Tất cả danh mục</MenuItem>
                            {categories.filter(c => c !== 'All').map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Lọc Trạng thái */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <MenuItem value="All">Tất cả trạng thái</MenuItem>
                            <MenuItem value="InStock">Còn hàng</MenuItem>
                            <MenuItem value="OutOfStock">Tạm hết</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Nút thêm sản phẩm */}
                <Button component={RouterLink} to="/admin/products/add" variant="contained" sx={{ bgcolor: '#ff4d4f', '&:hover': { bgcolor: '#d9363e' }, fontWeight: 'bold' }} startIcon={<PlusOutlined />}>
                    Thêm sản phẩm
                </Button>
            </Box>

            {/* --- 2. BẢNG DANH SÁCH (MAIN TABLE) --- */}
            <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox 
                                    indeterminate={selected.length > 0 && selected.length < filteredProducts.length}
                                    checked={filteredProducts.length > 0 && selected.length === filteredProducts.length}
                                    onChange={handleSelectAllClick}
                                    color="error"
                                />
                            </TableCell>
                            <TableCell width="80">Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell align="right">Giá bán</TableCell>
                            <TableCell align="center">Trạng thái (Bếp)</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.length === 0 ? (
                            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}>Không tìm thấy sản phẩm nào.</TableCell></TableRow>
                        ) : (
                            paginatedProducts.map((row) => {
                                const rId = row.id || row.productId;
                                const isItemSelected = selected.indexOf(rId) !== -1;
                                const rName = row.productName || row.name || 'Không tên';
                                const rImage = row.imageUrl || row.image || row.picture;
                                const rPrice = row.price || 0;
                                const rOriginalPrice = rPrice * 1.2; // Gỉa lập giá gốc (cao hơn 20%) để test UI
                                const rCategory = row.category || row.categoryName || 'Chưa phân loại';
                                const isAvailable = (row.availability !== undefined ? row.availability : 1) > 0;

                                return (
                                    <TableRow hover selected={isItemSelected} key={rId}>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, rId)} color="error" />
                                        </TableCell>
                                        <TableCell>
                                            <Avatar src={getValidImage(rImage)} variant="rounded" sx={{ width: 50, height: 50, border: '1px solid #eee' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#262626' }}>{rName}</Typography>
                                            <Typography variant="caption" color="textSecondary">SKU: RF-{String(rId).padStart(4, '0')}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{rCategory}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle2" color="error" fontWeight="bold">
                                                {rPrice.toLocaleString('vi-VN')} ₫
                                            </Typography>
                                            {rOriginalPrice > rPrice && (
                                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                                    {rOriginalPrice.toLocaleString('vi-VN')} ₫
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={isAvailable ? "Tắt nếu hết nguyên liệu" : "Bật nếu đã nhập hàng"}>
                                                <Switch 
                                                    checked={isAvailable} 
                                                    onChange={() => handleToggleStatus(rId, isAvailable ? 1 : 0)} 
                                                    color="success" 
                                                />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Sửa chi tiết">
                                                <IconButton color="primary" component={RouterLink} to={`/admin/products/edit/${rId}`}>
                                                    <EditOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa món">
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

            {/* --- 3. PHÂN TRANG (PAGINATION) --- */}
            <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Hiển thị:"
                labelDisplayedRows={({ from, to, count }) => `Hiển thị ${from}-${to} trong tổng số ${count} món`}
                sx={{ borderTop: '1px solid #f0f0f0' }}
            />
        </MainCard>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Button, Grid, InputLabel, OutlinedInput, Stack, Typography, 
    Select, MenuItem, Box, Paper, TextField, Switch, FormControlLabel, 
    Checkbox, FormGroup, InputAdornment, Chip, Divider, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, CircularProgress
} from '@mui/material';
import { 
    PictureOutlined, ArrowLeftOutlined, SaveOutlined, 
    DeleteOutlined, EyeOutlined, CloseOutlined 
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function EditProduct() {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const navigate = useNavigate();
    
    // --- STATES DỮ LIỆU ---
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [formData, setFormData] = useState({
        productName: '',
        shortDesc: '',
        description: '',
        price: '',
        salePrice: '',
        inStock: true, 
        category: 'Thức ăn nhanh',
        prepTime: '15',
        seoTitle: '',
        seoDesc: '',
        seoSlug: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedTags, setSelectedTags] = useState(['HOT']); // Giả lập dữ liệu cũ

    const primaryColor = '#ff4d4f';

    // --- LẤY DỮ LIỆU SẢN PHẨM CŨ ĐỂ ĐIỀN VÀO FORM ---
    useEffect(() => {
        fetch(`${API_URL}/api/catalog/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData({
                    productName: data.productName || data.name || '',
                    shortDesc: data.shortDesc || '',
                    description: data.description || '',
                    price: data.price || '',
                    salePrice: data.salePrice || '',
                    inStock: (data.availability !== undefined ? data.availability : 1) > 0,
                    category: data.category || 'Thức ăn nhanh',
                    prepTime: data.prepTime || '15',
                    seoTitle: data.seoTitle || '',
                    seoDesc: data.seoDesc || '',
                    seoSlug: data.seoSlug || ''
                });

                // Lấy link ảnh từ server
                const rawImg = data.imageUrl || data.image || data.picture;
                if (rawImg) {
                    const cleanPath = rawImg.startsWith('/') ? rawImg.substring(1) : rawImg;
                    const finalPath = cleanPath.startsWith('http') ? cleanPath : `${API_URL}/api/catalog/${cleanPath.startsWith('uploads/') ? cleanPath : 'uploads/' + cleanPath}`;
                    setImagePreview(finalPath);
                }
                
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi tải dữ liệu:', err);
                alert('Không tìm thấy sản phẩm!');
                navigate('/admin/products');
            });
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý up ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    // Xóa ảnh hiện tại (Nút X đỏ)
    const handleRemoveImage = (e) => {
        e.preventDefault();
        setImagePreview(null);
        setImageFile(null);
        // Lưu ý: Nếu muốn báo backend xóa ảnh cũ, bạn cần thêm state isImageDeleted = true
    };

    const handleTagToggle = (tag) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    // --- API: CẬP NHẬT SẢN PHẨM ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Cập nhật thông tin JSON (Dùng PUT thay vì POST)
            const productRes = await fetch(`${API_URL}/api/catalog/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: formData.productName,
                    category: formData.category,
                    price: parseFloat(formData.price || 0),
                    availability: formData.inStock ? 100 : 0, 
                    description: formData.description || formData.shortDesc,
                    visibilityStatus: "PUBLISHED"
                })
            });

            if (!productRes.ok) throw new Error('Không thể cập nhật sản phẩm!');

            // 2. Upload ảnh mới (nếu có chọn)
            if (imageFile) {
                const imgData = new FormData();
                imgData.append('file', imageFile);
                await fetch(`${API_URL}/api/catalog/admin/products/${id}/image`, {
                    method: 'POST',
                    body: imgData
                });
            }

            alert('Cập nhật sản phẩm thành công!');
            navigate('/admin/products'); 
        } catch (error) {
            console.error('Lỗi:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- API: XÓA SẢN PHẨM ---
    const handleDeleteProduct = async () => {
        try {
            const res = await fetch(`${API_URL}/api/catalog/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert('Đã xóa món ăn khỏi hệ thống!');
                navigate('/admin/products');
            } else {
                alert('Không thể xóa món này. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Lỗi xóa:', error);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: primaryColor }}/></Box>;
    }

    // --- TIÊU ĐỀ KÈM NÚT "XEM NGOÀI WEBSITE" ---
    const headerTitle = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h5" fontWeight={700}>Chỉnh sửa: {formData.productName}</Typography>
            <Tooltip title="Mở menu khách hàng trong tab mới">
                <Button 
                    variant="outlined" size="small" startIcon={<EyeOutlined />} 
                    onClick={() => window.open(`/product/${id}`, '_blank')}
                    sx={{ color: '#1890ff', borderColor: '#1890ff', bgcolor: '#e6f7ff', '&:hover': { borderColor: '#096dd9', bgcolor: '#bae7ff' } }}
                >
                    Xem ngoài Website
                </Button>
            </Tooltip>
        </Box>
    );

    return (
        <MainCard title={headerTitle} contentSX={{ bgcolor: '#fafafb', p: { xs: 2, md: 3 }, pb: '100px !important' }}>
            <Box component="form" onSubmit={handleUpdate}>
                
                {/* BỐ CỤC 70/30 BẰNG FLEXBOX (Chống rớt cột khi zoom) */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    
                    {/* ========================================== */}
                    {/* CỘT TRÁI (70%) - CHỈNH SỬA NỘI DUNG */}
                    {/* ========================================== */}
                    <Box sx={{ flex: 2, minWidth: 0 }}>
                        <Stack spacing={3}>
                            
                            {/* 1. KHỐI THÔNG TIN CƠ BẢN */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>1. Thông tin cơ bản</Typography>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Tên món ăn <span style={{color: 'red'}}>*</span></InputLabel>
                                        <OutlinedInput name="productName" value={formData.productName} onChange={handleChange} required fullWidth />
                                    </Box>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Mô tả ngắn</InputLabel>
                                        <TextField name="shortDesc" value={formData.shortDesc} onChange={handleChange} fullWidth multiline rows={2} />
                                    </Box>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Mô tả chi tiết (Nguyên liệu, định lượng...)</InputLabel>
                                        <TextField name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={5} />
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* 2. KHỐI GIÁ CẢ & KHO HÀNG */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>2. Giá cả & Trạng thái</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Giá bán (đ) <span style={{color: 'red'}}>*</span></InputLabel>
                                        <OutlinedInput type="number" name="price" value={formData.price} onChange={handleChange} required fullWidth startAdornment={<InputAdornment position="start">₫</InputAdornment>} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Giá khuyến mãi</InputLabel>
                                        <OutlinedInput type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} fullWidth startAdornment={<InputAdornment position="start">₫</InputAdornment>} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <FormControlLabel 
                                            control={<Switch color="success" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} />} 
                                            label={<Typography fontWeight={600}>{formData.inStock ? "🟢 Đang bật (Còn món)" : "🔴 Đang tắt (Tạm hết nguyên liệu)"}</Typography>} 
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* 3. KHỐI TÙY CHỌN MÓN */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>3. Tùy chọn món (Size / Topping)</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Kích thước (Size)</Typography>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Cỡ vừa (Mặc định)" />
                                            <FormControlLabel control={<Checkbox />} label="Cỡ lớn (+15.000 ₫)" />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Hương vị</Typography>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Cay vừa" />
                                            <FormControlLabel control={<Checkbox />} label="Cay nhiều" />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Topping / Add-ons</Typography>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Thêm Phô mai (+10k)" />
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Gấp đôi thịt (+25k)" />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>
                    </Box>

                    {/* ========================================== */}
                    {/* CỘT PHẢI (30%) - ẢNH CŨ & PHÂN LOẠI */}
                    {/* ========================================== */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack spacing={3}>
                            
                            {/* 4. KHỐI HÌNH ẢNH THÔNG MINH */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Hình ảnh món ăn</Typography>
                                
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Ảnh đại diện chính</InputLabel>
                                <Box sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#f5f5f5', border: '2px dashed #d9d9d9', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', mb: 2 }}>
                                    
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            {/* Nút Xóa Ảnh Màu Đỏ */}
                                            <IconButton 
                                                onClick={handleRemoveImage}
                                                size="small"
                                                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255, 77, 79, 0.9)', color: '#fff', '&:hover': { bgcolor: '#d9363e' }, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                                            >
                                                <CloseOutlined style={{ fontSize: '14px' }} />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Box component="label" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { color: primaryColor } }}>
                                            <PictureOutlined style={{ fontSize: '32px', color: '#bfbfbf', marginBottom: '8px' }} />
                                            <Typography variant="body2" color="text.secondary">Nhấp tải ảnh mới (Vuông)</Typography>
                                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                        </Box>
                                    )}
                                </Box>

                                <InputLabel sx={{ mb: 1, fontWeight: 600, mt: 3 }}>Nhãn dán (Tags)</InputLabel>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {['HOT', 'NEW', 'SPICY 🌶️', 'BEST SELLER'].map(tag => (
                                        <Chip 
                                            key={tag} label={tag} onClick={() => handleTagToggle(tag)}
                                            sx={{ fontWeight: 600, cursor: 'pointer', bgcolor: selectedTags.includes(tag) ? primaryColor : '#f0f0f0', color: selectedTags.includes(tag) ? '#fff' : 'text.primary' }} 
                                        />
                                    ))}
                                </Box>
                            </Paper>

                            {/* 5. KHỐI DANH MỤC */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Phân loại món</Typography>
                                <Box sx={{ mb: 2.5 }}>
                                    <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Danh mục hiện tại</InputLabel>
                                    <Select name="category" value={formData.category} onChange={handleChange} fullWidth size="small">
                                        <MenuItem value="Thức ăn nhanh">Thức ăn nhanh</MenuItem>
                                        <MenuItem value="Burger & Sandwich">Burger & Sandwich</MenuItem>
                                        <MenuItem value="Pizza">Pizza</MenuItem>
                                        <MenuItem value="Đồ uống">Đồ uống</MenuItem>
                                    </Select>
                                </Box>
                            </Paper>
                        </Stack>
                    </Box>
                </Box>

                {/* ========================================== */}
                {/* THANH CHỨC NĂNG STICKY (CỐ ĐỊNH DƯỚI CÙNG) */}
                {/* ========================================== */}
                <Box 
                    sx={{ 
                        position: 'fixed', bottom: 0, left: { xs: 0, sm: 260 }, right: 0, // 260px là khoảng chừa cho Sidebar của Mantis
                        bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)',
                        borderTop: '1px solid #e0e0e0', p: 2, px: 4,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000,
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
                    }}
                >
                    <Button color="error" startIcon={<DeleteOutlined />} onClick={() => setOpenDeleteDialog(true)} sx={{ fontWeight: 'bold' }}>
                        Xóa món ăn này
                    </Button>

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color="inherit" onClick={() => navigate('/admin/products')} disabled={isSubmitting} sx={{ fontWeight: 600 }}>
                            Hủy (Quay lại)
                        </Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={<SaveOutlined />} sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: '#d9363e' }, fontWeight: 'bold', px: 4 }}>
                            {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật / Lưu Thay Đổi'}
                        </Button>
                    </Stack>
                </Box>
            </Box>

            {/* POPUP XÁC NHẬN XÓA (CẢNH BÁO UX) */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', color: primaryColor, pb: 1 }}>Cảnh báo xóa món ăn!</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#262626' }}>
                        Bạn có chắc chắn muốn xóa món <b>{formData.productName}</b> không? 
                        <br/>Hành động này <b>không thể hoàn tác</b> và sẽ gỡ món này khỏi hệ thống ngay lập tức!
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="inherit" sx={{ fontWeight: 600 }}>Giữ lại món</Button>
                    <Button onClick={handleDeleteProduct} variant="contained" color="error" sx={{ fontWeight: 'bold' }}>Vâng, Xóa Ngay</Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}
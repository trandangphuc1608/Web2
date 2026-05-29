import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Button, Grid, InputLabel, OutlinedInput, Stack, Typography, 
    Select, MenuItem, Box, Paper, TextField, Switch, FormControlLabel, 
    Checkbox, FormGroup, InputAdornment, Chip, Divider
} from '@mui/material';
import { PictureOutlined, ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function AddProduct() {
    const navigate = useNavigate();
    
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTags, setSelectedTags] = useState(['HOT']);

    const primaryColor = '#ff4d4f';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const handleTagToggle = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async (e, isDraft = false) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const productRes = await fetch(`${API_URL}/api/catalog/admin/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: formData.productName,
                    category: formData.category,
                    price: parseFloat(formData.price || 0),
                    availability: formData.inStock ? 100 : 0, 
                    description: formData.description || formData.shortDesc,
                    visibilityStatus: isDraft ? "DRAFT" : "PUBLISHED"
                })
            });

            if (!productRes.ok) throw new Error('Không thể tạo sản phẩm!');
            const savedProduct = await productRes.json();

            if (imageFile && savedProduct.id) {
                const imgData = new FormData();
                imgData.append('file', imageFile);

                const imgRes = await fetch(`${API_URL}/api/catalog/admin/products/${savedProduct.id}/image`, {
                    method: 'POST',
                    body: imgData
                });
                
                if (!imgRes.ok) throw new Error('Tạo sản phẩm thành công nhưng lỗi upload ảnh!');
            }

            alert(isDraft ? 'Đã lưu bản nháp thành công!' : 'Đăng sản phẩm thành công!');
            navigate('/admin/products'); 
        } catch (error) {
            console.error('Lỗi:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const topBarControls = (
        <Stack direction="row" spacing={2}>
            <Button variant="text" color="inherit" onClick={() => navigate('/admin/products')} startIcon={<ArrowLeftOutlined />}>
                Hủy
            </Button>
            <Button variant="outlined" color="primary" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting} startIcon={<SaveOutlined />}>
                Lưu Nháp
            </Button>
            <Button variant="contained" onClick={(e) => handleSubmit(e, false)} disabled={isSubmitting} startIcon={<SendOutlined />} sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: '#d9363e' } }}>
                {isSubmitting ? 'Đang xử lý...' : 'Đăng Sản Phẩm'}
            </Button>
        </Stack>
    );

    return (
        <MainCard title="Thêm Sản Phẩm Mới" secondary={topBarControls} contentSX={{ bgcolor: '#fafafb', p: 3 }}>
            <Box component="form" onSubmit={(e) => handleSubmit(e, false)}>
                
                {/* ĐÃ SỬA ĐỔI: Dùng Flexbox thay cho Grid để ép form luôn nằm ngang 70/30 */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                    
                    {/* ========================================== */}
                    {/* CỘT TRÁI (Chiếm 2 phần - ~66%) */}
                    {/* ========================================== */}
                    <Box sx={{ flex: 2, minWidth: 0 }}>
                        <Stack spacing={3}>
                            
                            {/* 1. KHỐI THÔNG TIN CƠ BẢN */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>1. Thông tin cơ bản</Typography>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Tên món ăn <span style={{color: 'red'}}>*</span></InputLabel>
                                        <OutlinedInput name="productName" value={formData.productName} onChange={handleChange} required placeholder="Ví dụ: Gà Rán Sốt Cay Hàn Quốc" fullWidth />
                                    </Box>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Mô tả ngắn</InputLabel>
                                        <TextField name="shortDesc" value={formData.shortDesc} onChange={handleChange} placeholder="Hiển thị nhanh ở danh sách món ngoài web..." fullWidth multiline rows={2} />
                                    </Box>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Mô tả chi tiết (Nguyên liệu, định lượng...)</InputLabel>
                                        <TextField name="description" value={formData.description} onChange={handleChange} placeholder="Viết mô tả chi tiết cho sản phẩm..." fullWidth multiline rows={5} />
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* 2. KHỐI GIÁ CẢ & KHO HÀNG */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>2. Giá cả & Trạng thái</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Giá bán (đ) <span style={{color: 'red'}}>*</span></InputLabel>
                                        <OutlinedInput type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="Ví dụ: 50000" fullWidth startAdornment={<InputAdornment position="start">₫</InputAdornment>} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Giá khuyến mãi (Tùy chọn)</InputLabel>
                                        <OutlinedInput type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} placeholder="Để trống nếu không giảm giá" fullWidth startAdornment={<InputAdornment position="start">₫</InputAdornment>} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <FormControlLabel 
                                            control={<Switch color="success" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} />} 
                                            label={<Typography fontWeight={600}>{formData.inStock ? "🟢 Còn món (Đang kinh doanh)" : "🔴 Tạm hết món (Hết nguyên liệu)"}</Typography>} 
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* 3. KHỐI TÙY CHỌN MÓN */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>3. Tùy chọn món (Size / Topping)</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Kích thước (Size)</Typography>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Cỡ vừa (Mặc định)" />
                                            <FormControlLabel control={<Checkbox />} label="Cỡ lớn (+15.000 ₫)" />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Hương vị / Mức độ</Typography>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Cay vừa" />
                                            <FormControlLabel control={<Checkbox />} label="Cay nhiều" />
                                            <FormControlLabel control={<Checkbox />} label="Không cay" />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* 4. KHỐI CẤU HÌNH SEO */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>⚙️ Cấu hình SEO</Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>URL / Slug</InputLabel>
                                        <OutlinedInput size="small" name="seoSlug" value={formData.seoSlug} onChange={handleChange} placeholder="ga-ran-sot-cay..." fullWidth startAdornment={<InputAdornment position="start">rainbowfood.com/</InputAdornment>} />
                                    </Box>
                                    <Box>
                                        <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Meta Title</InputLabel>
                                        <TextField size="small" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Tiêu đề hiển thị trên Google..." fullWidth />
                                    </Box>
                                </Stack>
                            </Paper>

                        </Stack>
                    </Box>

                    {/* ========================================== */}
                    {/* CỘT PHẢI (Chiếm 1 phần - ~33%) */}
                    {/* ========================================== */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack spacing={3}>
                            
                            {/* 5. KHỐI HÌNH ẢNH & NHÃN */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Hình ảnh & Nhãn</Typography>
                                
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Ảnh đại diện chính <span style={{color: 'red'}}>*</span></InputLabel>
                                <Box component="label" sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#f5f5f5', border: '2px dashed #d9d9d9', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', mb: 2, '&:hover': { borderColor: primaryColor } }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <>
                                            <PictureOutlined style={{ fontSize: '32px', color: '#bfbfbf', marginBottom: '8px' }} />
                                            <Typography variant="body2" color="text.secondary">Nhấp để tải ảnh lên (Vuông)</Typography>
                                        </>
                                    )}
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} required={!imagePreview} />
                                </Box>

                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Nhãn dán (Tags)</InputLabel>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {['HOT', 'NEW', 'SPICY 🌶️', 'BEST SELLER'].map(tag => (
                                        <Chip 
                                            key={tag} label={tag} 
                                            onClick={() => handleTagToggle(tag)}
                                            sx={{ 
                                                fontWeight: 600, cursor: 'pointer',
                                                bgcolor: selectedTags.includes(tag) ? primaryColor : '#f0f0f0',
                                                color: selectedTags.includes(tag) ? '#fff' : 'text.primary',
                                            }} 
                                        />
                                    ))}
                                </Box>
                            </Paper>

                            {/* 6. KHỐI DANH MỤC & VẬN CHUYỂN */}
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Phân loại món</Typography>
                                
                                <Box sx={{ mb: 2.5 }}>
                                    <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Danh mục món ăn <span style={{color: 'red'}}>*</span></InputLabel>
                                    <Select name="category" value={formData.category} onChange={handleChange} fullWidth size="small">
                                        <MenuItem value="Thức ăn nhanh">Thức ăn nhanh</MenuItem>
                                        <MenuItem value="Burger & Sandwich">Burger & Sandwich</MenuItem>
                                        <MenuItem value="Pizza">Pizza</MenuItem>
                                        <MenuItem value="Đồ uống">Đồ uống</MenuItem>
                                    </Select>
                                </Box>

                                <Box>
                                    <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Thời gian chuẩn bị (Phút)</InputLabel>
                                    <OutlinedInput type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} size="small" fullWidth endAdornment={<InputAdornment position="end">Phút</InputAdornment>} />
                                </Box>
                            </Paper>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </MainCard>
    );
}
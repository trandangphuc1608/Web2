import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, InputLabel, OutlinedInput, Stack, Select, MenuItem, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

export default function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    
    const [formData, setFormData] = useState({
        id: '',
        productName: '',
        category: '',
        price: '',
        availability: '',
        imageUrl: '',
        description: '' 
    });
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = fetch(`http://localhost:8900/api/catalog/products/${id}`).then(res => res.json());
        const fetchCategories = fetch(`http://localhost:8900/api/catalog/admin/categories`).then(res => res.json());

        Promise.all([fetchProduct, fetchCategories])
            .then(([productData, categoryData]) => {
                setCategories(Array.isArray(categoryData) ? categoryData : []);
                setFormData({
                    id: productData.id,
                    productName: productData.productName,
                    category: productData.category || '',
                    price: productData.price,
                    availability: productData.availability,
                    imageUrl: productData.imageUrl,
                    description: productData.description || '' 
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi tải dữ liệu:', err);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // CHẶN LOGIC: Không cho phép submit nếu giá trị < 0
        if (parseFloat(formData.price) < 0) {
            return alert("Đơn giá không được là số âm!");
        }
        if (parseInt(formData.availability, 10) < 0) {
            return alert("Số lượng trong kho không được là số âm!");
        }

        setIsSubmitting(true);

        try {
            const productRes = await fetch('http://localhost:8900/api/catalog/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.id, 
                    productName: formData.productName,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    availability: parseInt(formData.availability, 10),
                    description: formData.description, 
                    imageUrl: formData.imageUrl 
                })
            });

            if (!productRes.ok) throw new Error('Không thể cập nhật thông tin!');
            
            if (imageFile) {
                const imgData = new FormData();
                imgData.append('file', imageFile);
                const imgRes = await fetch(`http://localhost:8900/api/catalog/admin/products/${id}/image`, {
                    method: 'POST',
                    body: imgData
                });
                if (!imgRes.ok) throw new Error('Cập nhật thông tin thành công nhưng lỗi upload ảnh!');
            }

            alert('Cập nhật sản phẩm thành công!');
            navigate('/admin/products', { replace: true });
        } catch (error) {
            console.error('Lỗi:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Typography sx={{ p: 3 }}>Đang tải dữ liệu sản phẩm...</Typography>;

    return (
        <MainCard title={`Sửa Sản Phẩm (ID: ${id})`}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Tên sản phẩm</InputLabel>
                            <OutlinedInput name="productName" value={formData.productName} onChange={handleChange} required fullWidth />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Danh mục</InputLabel>
                            <Select name="category" value={formData.category} onChange={handleChange} fullWidth displayEmpty required>
                                <MenuItem value="" disabled>-- Chọn danh mục --</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Đơn giá (VNĐ)</InputLabel>
                            {/* THÊM RÀNG BUỘC MIN = 0 */}
                            <OutlinedInput 
                                type="number" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleChange} 
                                required 
                                fullWidth 
                                inputProps={{ min: 0 }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Số lượng trong kho</InputLabel>
                            {/* THÊM RÀNG BUỘC MIN = 0 */}
                            <OutlinedInput 
                                type="number" 
                                name="availability" 
                                value={formData.availability} 
                                onChange={handleChange} 
                                required 
                                fullWidth 
                                inputProps={{ min: 0 }}
                            />
                        </Stack>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Mô tả chi tiết</InputLabel>
                            <OutlinedInput 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                fullWidth 
                                multiline 
                                rows={4} 
                                placeholder="Nhập mô tả sản phẩm..."
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Hình ảnh sản phẩm (Chỉ chọn nếu muốn đổi ảnh khác)</InputLabel>
                            <OutlinedInput 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setImageFile(e.target.files[0])} 
                                fullWidth 
                            />
                            {formData.imageUrl && !imageFile && (
                                <Typography variant="caption" color="textSecondary">
                                    Ảnh hiện tại: {formData.imageUrl}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/products')}>Hủy bỏ</Button>
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang lưu...' : 'Cập nhật sản phẩm'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
}
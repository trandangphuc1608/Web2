import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, InputLabel, OutlinedInput, Stack, Typography, Select, MenuItem } from '@mui/material';
import MainCard from 'components/MainCard';

export default function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        category: 'Thức ăn nhanh',
        price: '',
        availability: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Gọi API tạo thông tin sản phẩm trước
            const productRes = await fetch('http://localhost:8900/api/catalog/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: formData.productName,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    availability: parseInt(formData.availability, 10),
                    description: 'Sản phẩm mới' 
                })
            });

            if (!productRes.ok) throw new Error('Không thể tạo sản phẩm!');
            const savedProduct = await productRes.json();

            // 2. Nếu tạo thành công và có chọn file ảnh -> Gọi API Upload ảnh
            if (imageFile && savedProduct.id) {
                const imgData = new FormData();
                imgData.append('file', imageFile);

                const imgRes = await fetch(`http://localhost:8900/api/catalog/admin/products/${savedProduct.id}/image`, {
                    method: 'POST',
                    body: imgData
                });
                
                if (!imgRes.ok) throw new Error('Tạo sản phẩm thành công nhưng lỗi upload ảnh!');
            }

            alert('Thêm sản phẩm thành công!');
            navigate('/products'); // Quay lại trang danh sách
        } catch (error) {
            console.error('Lỗi:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainCard title="Thêm Sản Phẩm Mới">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Tên sản phẩm</InputLabel>
                            <OutlinedInput name="productName" value={formData.productName} onChange={handleChange} required placeholder="Nhập tên sản phẩm..." fullWidth />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Danh mục</InputLabel>
                            <Select name="category" value={formData.category} onChange={handleChange} fullWidth>
                                <MenuItem value="Thức ăn nhanh">Thức ăn nhanh</MenuItem>
                                <MenuItem value="Đồ uống">Đồ uống</MenuItem>
                                <MenuItem value="Tráng miệng">Tráng miệng</MenuItem>
                            </Select>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Đơn giá (VNĐ)</InputLabel>
                            <OutlinedInput type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="Ví dụ: 50000" fullWidth />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Số lượng trong kho</InputLabel>
                            <OutlinedInput type="number" name="availability" value={formData.availability} onChange={handleChange} required placeholder="Ví dụ: 100" fullWidth />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Hình ảnh sản phẩm</InputLabel>
                            <OutlinedInput 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setImageFile(e.target.files[0])} 
                                fullWidth 
                                required
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" color="secondary" onClick={() => navigate('/products')}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
}
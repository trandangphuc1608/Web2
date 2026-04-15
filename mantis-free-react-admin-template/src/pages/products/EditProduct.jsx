import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, InputLabel, OutlinedInput, Stack, Select, MenuItem, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

export default function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    
    const [formData, setFormData] = useState({
        id: '',
        productName: '',
        category: 'Thức ăn nhanh',
        price: '',
        availability: '',
        imageUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Tải dữ liệu sản phẩm cũ lên Form
    useEffect(() => {
        fetch(`http://localhost:8900/api/catalog/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData({
                    id: data.id,
                    productName: data.productName,
                    category: data.category || 'Thức ăn nhanh',
                    price: data.price,
                    availability: data.availability,
                    imageUrl: data.imageUrl
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
        setIsSubmitting(true);

        try {
            // 1. Cập nhật thông tin text (Truyền thêm ID để Backend hiểu là lệnh Update)
            const productRes = await fetch('http://localhost:8900/api/catalog/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.id, // Bắt buộc phải có ID để ghi đè
                    productName: formData.productName,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    availability: parseInt(formData.availability, 10),
                    discription: 'Đã cập nhật',
                    imageUrl: formData.imageUrl // Giữ nguyên ảnh cũ nếu không đổi
                })
            });

            if (!productRes.ok) throw new Error('Không thể cập nhật thông tin!');
            
            // 2. Nếu có chọn file ảnh mới thì gọi API Upload ảnh ghi đè
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
                            <OutlinedInput type="number" name="price" value={formData.price} onChange={handleChange} required fullWidth />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <InputLabel>Số lượng trong kho</InputLabel>
                            <OutlinedInput type="number" name="availability" value={formData.availability} onChange={handleChange} required fullWidth />
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
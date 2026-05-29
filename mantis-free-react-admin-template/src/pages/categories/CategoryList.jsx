import React, { useState, useEffect } from "react";
import {
  Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Stack, IconButton, Tooltip, Switch, FormControlLabel, 
  FormControl, InputLabel, Select, MenuItem, Avatar, Chip, InputAdornment
} from "@mui/material";
import { EditOutlined, DeleteOutlined, PlusOutlined, PictureOutlined, SearchOutlined } from "@ant-design/icons";
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

const CategoryList = () => {
  // --- STATES QUẢN LÝ DỮ LIỆU ---
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  
  // --- ĐÃ THÊM: STATE CHO THANH TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATES QUẢN LÝ DIALOG ---
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({ 
      id: "", name: "", parentId: "root", description: "",
      status: true, sortOrder: 0, seoTitle: "", seoDesc: "", imageFile: null 
  });

  const primaryColor = '#ff4d4f';

  // --- 1. HÀM LẤY DỮ LIỆU & ĐẾM SẢN PHẨM ---
  const fetchData = async () => {
    try {
        const timestamp = new Date().getTime();
        
        // Lấy danh mục
        const catRes = await fetch(`${API_URL}/api/catalog/admin/categories?t=${timestamp}`);
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : []);

        // Lấy sản phẩm để đếm
        const prodRes = await fetch(`${API_URL}/api/catalog/products?t=${timestamp}`);
        const prodData = await prodRes.json();
        
        let actualProducts = [];
        if (Array.isArray(prodData)) actualProducts = prodData;
        else if (prodData && Array.isArray(prodData.data)) actualProducts = prodData.data;
        else if (prodData && prodData._embedded && Array.isArray(prodData._embedded.products)) actualProducts = prodData._embedded.products;
        else if (prodData && Array.isArray(prodData.content)) actualProducts = prodData.content;

        // Đếm món ăn cho từng danh mục
        const counts = {};
        actualProducts.forEach(product => {
            let catName = 'Khác';
            if (typeof product.category === 'string') catName = product.category;
            else if (product.category && product.category.name) catName = product.category.name;
            counts[catName] = (counts[catName] || 0) + 1;
        });
        
        setProductCounts(counts);
        setLoading(false);
    } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. HÀM XỬ LÝ ẢNH (LẤY LINK TỪ SERVER) ---
  const getValidImage = (url) => {
      if (!url) return null;
      if (url.startsWith('http') || url.startsWith('data:image')) return url;
      const cleanPath = url.startsWith('/') ? url.substring(1) : url;
      const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
      return `${API_URL}/api/catalog/${finalPath}`;
  };

  // --- 3. ĐÃ THÊM: LOGIC LỌC TÌM KIẾM THEO TÊN ---
  const filteredCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 4. HÀM MỞ/ĐÓNG DIALOG & XỬ LÝ ẢNH ---
  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({
          ...category,
          parentId: category.parentId || "root",
          status: category.status !== false, 
          sortOrder: category.sortOrder || 0,
          seoTitle: category.seoTitle || "",
          seoDesc: category.seoDesc || "",
          imageFile: null
      });
      // Nếu danh mục có ảnh sẵn từ DB thì hiện lên, không thì bỏ trống
      setImagePreview(getValidImage(category.image || category.imageUrl || category.picture) || null); 
      setIsEditing(true);
    } else {
      setFormData({ id: "", name: "", parentId: "root", description: "", status: true, sortOrder: 0, seoTitle: "", seoDesc: "", imageFile: null });
      setImagePreview(null);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setImagePreview(URL.createObjectURL(file));
          setFormData({ ...formData, imageFile: file });
      }
  };

  // --- 5. ĐÃ THÊM LÕI LOGIC: HÀM LƯU DÙNG FORMDATA (CÓ THỂ GỬI ẢNH) ---
  const executeSave = async () => {
    if (!formData.name.trim()) {
        alert("Tên danh mục không được để trống!");
        return false;
    }

    const url = isEditing 
        ? `${API_URL}/api/catalog/admin/categories/${formData.id}`
        : `${API_URL}/api/catalog/admin/categories`;
        
    try {
        const submitData = new FormData();
        
        // Nếu có chọn ảnh mới thì đính kèm file
        if (formData.imageFile) {
            submitData.append("image", formData.imageFile);
        }

        // Đóng gói các thông tin chữ vào JSON (Chuẩn hóa cho Spring Boot)
        submitData.append("category", new Blob([JSON.stringify({
            name: formData.name,
            description: formData.description,
            parentId: formData.parentId,
            sortOrder: formData.sortOrder,
            status: formData.status,
            seoTitle: formData.seoTitle,
            seoDesc: formData.seoDesc
        })], { type: "application/json" }));

        const res = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            body: submitData 
        });

        if (!res.ok) throw new Error("Lỗi lưu dữ liệu");
        
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        fetchData();
        return true;
    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra khi lưu! (Kiểm tra lại cấu hình Backend xem đã hỗ trợ Multipart chưa)");
        return false;
    }
  };

  const handleSave = async () => {
      const success = await executeSave();
      if (success) handleCloseDialog();
  };

  const handleSaveAndContinue = async () => {
      const success = await executeSave();
      if (success) {
          setFormData({ id: "", name: "", parentId: "root", description: "", status: true, sortOrder: 0, seoTitle: "", seoDesc: "", imageFile: null });
          setImagePreview(null);
          setIsEditing(false);
      }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      fetch(`${API_URL}/api/catalog/admin/categories/${id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            alert("Xóa thành công!");
            setCategories(categories.filter((c) => c.id !== id));
          } else {
            alert("Lỗi khi xóa! Có thể danh mục này đang chứa sản phẩm.");
          }
        });
    }
  };

  // --- ĐÃ SỬA: THANH CÔNG CỤ (TÌM KIẾM & NÚT THÊM) ---
  const topBarControls = (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField 
            variant="outlined" 
            placeholder="Tìm danh mục..." 
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchOutlined /> </InputAdornment> ) }}
            sx={{ width: 250, bgcolor: '#fff' }}
        />
        <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={() => handleOpenDialog()} sx={{ fontWeight: 600 }}>
            Thêm danh mục
        </Button>
    </Box>
  );

  return (
    <MainCard title="Quản Lý Danh Mục Hệ Thống" secondary={topBarControls}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: primaryColor }} /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell align="center" width="80">Ảnh</TableCell>
                <TableCell width="250">Tên Danh Mục</TableCell>
                <TableCell align="center">Sản phẩm</TableCell>
                <TableCell align="center">Thứ tự</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center" width="120">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* ĐÃ SỬA: Map qua danh sách đã được Lọc (filteredCategories) thay vì bản gốc */}
              {filteredCategories.map((row) => {
                const imgUrl = getValidImage(row.image || row.imageUrl || row.picture);
                return (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">
                        {imgUrl ? (
                            <Avatar variant="rounded" src={imgUrl} sx={{ width: 40, height: 40, mx: 'auto', border: '1px solid #eaeaea' }} />
                        ) : (
                            <Avatar variant="rounded" sx={{ bgcolor: '#f0f0f0', color: '#bfbfbf', width: 40, height: 40, mx: 'auto' }}>
                                <PictureOutlined />
                            </Avatar>
                        )}
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ fontWeight: 'bold', color: primaryColor }}>{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.description || "Chưa có mô tả"}</Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Chip label={`${productCounts[row.name] || 0} món`} size="small" sx={{ bgcolor: '#e6f7ff', color: '#1890ff', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="center">{row.sortOrder || 0}</TableCell>
                    <TableCell align="center">
                        <Switch checked={row.status !== false} color="success" size="small" />
                    </TableCell>
                    <TableCell align="center">
                        <Tooltip title="Sửa">
                            <IconButton color="primary" onClick={() => handleOpenDialog(row)}><EditOutlined /></IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton color="error" onClick={() => handleDelete(row.id)}><DeleteOutlined /></IconButton>
                        </Tooltip>
                    </TableCell>
                    </TableRow>
                );
              })}
              {filteredCategories.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}>Không tìm thấy danh mục nào.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* --- DIALOG THÊM/SỬA --- */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
            {isEditing ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, p: 3, bgcolor: '#fafafb' }}>
                
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Thông tin chung</Typography>
                        <Stack spacing={3}>
                            <TextField label="Tên danh mục" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <TextField label="Mô tả danh mục" fullWidth multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Cấu hình SEO</Typography>
                        <Stack spacing={3}>
                            <TextField label="Meta Title" fullWidth size="small" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} placeholder="Tiêu đề hiển thị trên Google..." />
                            <TextField label="Meta Description" fullWidth multiline rows={2} size="small" value={formData.seoDesc} onChange={(e) => setFormData({ ...formData, seoDesc: e.target.value })} placeholder="Mô tả hiển thị trên Google..." />
                        </Stack>
                    </Paper>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Phân loại</Typography>
                        <Stack spacing={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Danh mục cha</InputLabel>
                                <Select value={formData.parentId} label="Danh mục cha" onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}>
                                    <MenuItem value="root">-- Danh mục Gốc --</MenuItem>
                                    {categories.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField label="Thứ tự hiển thị" type="number" fullWidth size="small" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} />
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, textAlign: 'left' }}>Hình đại diện</Typography>
                        <Box 
                            component="label"
                            sx={{ width: '100%', height: 120, bgcolor: '#f5f5f5', border: '1px dashed #d9d9d9', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', '&:hover': { borderColor: primaryColor } }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Typography variant="body2" color="text.secondary">+ Tải ảnh lên</Typography>
                            )}
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Box>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Trạng thái</Typography>
                        <FormControlLabel 
                            control={<Switch color="success" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} />} 
                            label={formData.status ? "Đang hiển thị" : "Đang ẩn"} 
                        />
                    </Paper>
                </Box>
            </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={handleCloseDialog} color="inherit" sx={{ fontWeight: 600 }}>Hủy bỏ</Button>
          <Button onClick={handleSaveAndContinue} variant="outlined" color="primary" sx={{ fontWeight: 600 }}>Lưu & Thêm tiếp</Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontWeight: 600 }}>Lưu Danh Mục</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CategoryList;
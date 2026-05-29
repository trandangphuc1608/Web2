import React, { useState, useEffect } from "react";
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Stack, IconButton, Tooltip, Switch, FormControlLabel
} from "@mui/material";
import { EditOutlined, DeleteOutlined, PlusOutlined, PictureOutlined } from "@ant-design/icons";
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({ 
      id: "", title: "", targetUrl: "", sortOrder: 0, isActive: true, imageFile: null 
  });

  const fetchBanners = async () => {
    try {
        const res = await fetch(`${API_URL}/api/catalog/admin/banners?t=${new Date().getTime()}`);
        const data = await res.json();
        setBanners(Array.isArray(data) ? data.sort((a,b) => a.sortOrder - b.sortOrder) : []);
        setLoading(false);
    } catch (err) {
        console.error("Lỗi tải banners:", err);
        setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const getValidImage = (url) => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      const cleanPath = url.startsWith('/') ? url.substring(1) : url;
      return `${API_URL}/api/catalog/${cleanPath.startsWith('uploads/') ? cleanPath : 'uploads/' + cleanPath}`;
  };

  const handleOpenDialog = (banner = null) => {
    if (banner) {
      setFormData({ ...banner, isActive: banner.isActive !== false, imageFile: null });
      setImagePreview(getValidImage(banner.imageUrl)); 
      setIsEditing(true);
    } else {
      setFormData({ id: "", title: "", targetUrl: "", sortOrder: 0, isActive: true, imageFile: null });
      setImagePreview(null);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setImagePreview(URL.createObjectURL(file));
          setFormData({ ...formData, imageFile: file });
      }
  };

  const handleSave = async () => {
    if (!isEditing && !formData.imageFile) return alert("Vui lòng chọn ảnh Banner!");
    
    const url = isEditing ? `${API_URL}/api/catalog/admin/banners/${formData.id}` : `${API_URL}/api/catalog/admin/banners`;
        
    try {
        const submitData = new FormData();
        if (formData.imageFile) submitData.append("image", formData.imageFile);
        submitData.append("banner", new Blob([JSON.stringify({
            title: formData.title, targetUrl: formData.targetUrl, 
            sortOrder: formData.sortOrder, isActive: formData.isActive
        })], { type: "application/json" }));

        const res = await fetch(url, { method: isEditing ? "PUT" : "POST", body: submitData });
        if (!res.ok) throw new Error("Lỗi lưu dữ liệu");
        
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setOpenDialog(false);
        fetchBanners();
    } catch (error) { alert("Lỗi khi lưu Banner!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa banner này?")) {
      const res = await fetch(`${API_URL}/api/catalog/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) setBanners(banners.filter((c) => c.id !== id));
    }
  };

  return (
    <MainCard title="Quản Lý Banner Quảng Cáo" secondary={<Button variant="contained" onClick={() => handleOpenDialog()} startIcon={<PlusOutlined/>}>Thêm Banner</Button>}>
      {loading ? <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box> : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell width="250">Hình ảnh</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Link (Dẫn tới)</TableCell>
                <TableCell align="center">Thứ tự</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                      <Box component="img" src={getValidImage(row.imageUrl)} sx={{ width: 200, height: 80, objectFit: 'cover', borderRadius: 1, border: '1px solid #ddd' }} />
                  </TableCell>
                  <TableCell fontWeight="bold">{row.title || 'Không có tiêu đề'}</TableCell>
                  <TableCell>{row.targetUrl || '#'}</TableCell>
                  <TableCell align="center">{row.sortOrder}</TableCell>
                  <TableCell align="center"><Switch checked={row.isActive !== false} color="success" size="small" /></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa"><IconButton color="primary" onClick={() => handleOpenDialog(row)}><EditOutlined /></IconButton></Tooltip>
                    <Tooltip title="Xóa"><IconButton color="error" onClick={() => handleDelete(row.id)}><DeleteOutlined /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {banners.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{py: 5}}>Chưa có banner nào.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* DIALOG THÊM SỬA */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>{isEditing ? "Cập Nhật Banner" : "Thêm Banner Mới"}</DialogTitle>
        <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
                {/* Khung tải ảnh */}
                <Box component="label" sx={{ width: '100%', height: 180, bgcolor: '#f5f5f5', border: '2px dashed #d9d9d9', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                    {imagePreview ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" /> 
                                  : <><PictureOutlined style={{fontSize: 30}}/><Typography mt={1}>Tải ảnh Banner lên (Tỉ lệ 21:9)</Typography></>}
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Box>
                
                <TextField label="Tiêu đề Banner (Để quản lý)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} fullWidth />
                <TextField label="Link đích (VD: /category/pizza)" value={formData.targetUrl} onChange={(e) => setFormData({...formData, targetUrl: e.target.value})} fullWidth placeholder="Khách bấm vào sẽ chuyển sang link này" />
                
                <Stack direction="row" spacing={3}>
                    <TextField label="Thứ tự xuất hiện" type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: e.target.value})} fullWidth />
                    <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} color="success" />} label="Hiển thị ngay" />
                </Stack>
            </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Lưu Banner</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
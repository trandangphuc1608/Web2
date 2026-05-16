import React, { useState, useEffect } from "react";
import {
  Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Tooltip
} from "@mui/material";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import MainCard from 'components/MainCard'; // Thêm component MainCard giống trang Product
import { API_URL } from 'config'; // Sử dụng cấu hình API_URL chuẩn

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);

  const primaryColor = '#ff4d4f';

  const fetchCategories = () => {
    // Thêm timestamp để tránh cache giống hệt trang product
    const timestamp = new Date().getTime();
    fetch(`${API_URL}/api/catalog/admin/categories?t=${timestamp}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setCategories([]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData(category);
      setIsEditing(true);
    } else {
      setFormData({ id: "", name: "", description: "" });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSave = () => {
    if (!formData.name.trim()) return alert("Tên danh mục không được để trống!");

    const url = isEditing 
        ? `${API_URL}/api/catalog/admin/categories/${formData.id}`
        : `${API_URL}/api/catalog/admin/categories`;
        
    fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => {
          if(res.ok) return res.json();
          throw new Error("Lỗi lưu dữ liệu");
      })
      .then(() => {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        fetchCategories();
        handleCloseDialog();
      })
      .catch(() => alert("Có lỗi xảy ra khi lưu!"));
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

  // Nút Thêm Danh Mục đặt ở góc trên bên phải của MainCard
  const addCategoryButton = (
    <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={() => handleOpenDialog()}>
        Thêm danh mục
    </Button>
  );

  return (
    <MainCard title="Quản Lý Danh Mục Hệ Thống" secondary={addCategoryButton}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: primaryColor }} /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
          <Table sx={{ minWidth: 650 }} aria-label="Bảng danh mục">
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell align="center" width="80">ID</TableCell>
                <TableCell width="250">Tên Danh Mục</TableCell>
                <TableCell>Mô Tả</TableCell>
                <TableCell align="center" width="150">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{row.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: primaryColor }}>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="center">
                    {/* Đổi thành nút Icon giống hệt trang Sản phẩm */}
                    <Tooltip title="Sửa">
                        <IconButton color="primary" onClick={() => handleOpenDialog(row)}>
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                            <DeleteOutlined />
                        </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center">Chưa có danh mục nào.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>{isEditing ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Tên danh mục" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <TextField label="Mô tả" fullWidth multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="secondary">Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Lưu Lại</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CategoryList;
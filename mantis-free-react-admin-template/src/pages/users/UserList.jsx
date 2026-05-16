import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, IconButton, Tooltip, Chip, Button, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = () => {
        const timestamp = new Date().getTime();
        // ĐÃ SỬA: Dùng nháy ngược (`) và đường dẫn /api/accounts/users
        fetch(`${API_URL}/api/accounts/users?t=${timestamp}`)
            .then(res => res.json())
            .then(data => {
                let actualData = [];
                if (Array.isArray(data)) actualData = data;
                else if (data && Array.isArray(data.data)) actualData = data.data;
                else if (data && data._embedded && Array.isArray(data._embedded.users)) actualData = data._embedded.users;
                else if (data && Array.isArray(data.content)) actualData = data.content;

                const sortedData = actualData.sort((a, b) => {
                    const idA = a.id || a.userId || 0;
                    const idB = b.id || b.userId || 0;
                    return idB - idA;
                });

                setUsers(sortedData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi tải dữ liệu người dùng:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenAdd = () => {
        setFormData({ userName: '', email: '' });
        setNewPassword('');
        setEditMode(false);
        setOpenDialog(true);
    };

    const handleOpenEdit = (user) => {
        setFormData({ ...user }); 
        setNewPassword(''); 
        setEditMode(true);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        const userNameField = formData.userName || formData.username;
        if (!userNameField) return alert('Vui lòng nhập tên người dùng!');
        
        if (!formData.email) return alert('Vui lòng nhập Email!'); 

        setIsSubmitting(true);
        
        try {
            // ĐÃ SỬA: Dùng nháy ngược (`) và đường dẫn chuẩn
            const url = editMode 
                ? `${API_URL}/api/accounts/users/${formData.id}` 
                : `${API_URL}/api/accounts/users`;              
                
            const method = editMode ? 'PUT' : 'POST';

            const payload = { ...formData };
            payload.userName = userNameField;
            payload.username = userNameField;

            if (newPassword) {
                payload.password = newPassword;
            }

            if (!editMode) {
                delete payload.id;
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(editMode ? 'Cập nhật thành công!' : 'Thêm người dùng thành công!');
                setOpenDialog(false);
                fetchUsers(); 
            } else {
                const errText = await res.text();
                alert(`Lỗi Server: ${errText}`);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Lỗi kết nối Server!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
        try {
            // ĐÃ SỬA: Dùng nháy ngược (`) và đường dẫn chuẩn
            const res = await fetch(`${API_URL}/api/accounts/users/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setUsers(users.filter(item => item.id !== id));
                alert('Xóa thành công!');
            } else {
                alert('Lỗi: Không thể xóa người dùng này!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối Server!');
        }
    };

    if (loading) return <Typography sx={{ p: 3 }}>Đang tải dữ liệu...</Typography>;

    const addUserButton = (
        <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleOpenAdd}>
            Thêm người dùng
        </Button>
    );

    return (
        <>
            <MainCard title="Quản lý Người dùng" secondary={addUserButton}>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="Bảng người dùng">
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell align="center" width="80">ID</TableCell>
                                <TableCell>Tên đăng nhập (Username)</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không có dữ liệu người dùng.</TableCell>
                                </TableRow>
                            ) : (
                                users.map((row) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{row.id}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <UserOutlined style={{ color: '#1890ff' }} />
                                                <Typography variant="subtitle1" color="primary">
                                                    {row.userName || row.username}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{row.email || 'Chưa cập nhật'}</TableCell>
                                        <TableCell align="center">
                                            <Chip label="Hoạt động" color="success" size="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Sửa">
                                                <IconButton color="primary" onClick={() => handleOpenEdit(row)}>
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Cập nhật Người Dùng' : 'Thêm Người Dùng Mới'}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Tên đăng nhập (Username)"
                            name="userName"
                            value={formData.userName || formData.username || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={editMode} 
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            fullWidth
                            required 
                        />
                        <TextField
                            label={editMode ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            required={!editMode}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="secondary">Hủy bỏ</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
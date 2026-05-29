import { useEffect, useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, IconButton, Tooltip, Chip, Button, Stack,
    TextField, Box, Avatar, Switch, Drawer, Divider, Select, MenuItem,
    FormControl, InputLabel, InputAdornment, TablePagination, Dialog, 
    DialogTitle, DialogContent, Grid, List, ListItem, ListItemText, ListItemAvatar
} from '@mui/material';
import { 
    EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, 
    HistoryOutlined, HeartFilled, CheckCircleFilled, CloseCircleFilled
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

export default function UserList() {
    // --- 1. STATES DỮ LIỆU ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 2. STATES BỘ LỌC & PHÂN TRANG ---
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // --- 3. STATES DRAWER (THÊM/SỬA NGƯỜI DÚNG) ---
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userName: '', email: '', phone: '', role: 'Khách hàng', address: '', isActive: true
    });
    const [newPassword, setNewPassword] = useState('');

    // --- 4. STATES PROFILE KHÁCH HÀNG (LỊCH SỬ) ---
    const [profileOpen, setProfileOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const primaryColor = '#ff4d4f';

    // --- FETCH DATA ---
    const fetchUsers = () => {
        const timestamp = new Date().getTime();
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

    useEffect(() => { fetchUsers(); }, []);

    // --- LỌC NGƯỜI DÙNG ---
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchStr = `${user.userName || user.username} ${user.email} ${user.phone || ''}`.toLowerCase();
            const matchSearch = searchStr.includes(searchTerm.toLowerCase());
            
            // Giả định nếu user không có role thì mặc định là Khách hàng
            const uRole = user.role || 'Khách hàng'; 
            const matchRole = roleFilter === 'All' || uRole === roleFilter;
            
            const isAct = user.isActive !== false; // Mặc định là true nếu undefined
            const matchStatus = statusFilter === 'All' || 
                               (statusFilter === 'Active' && isAct) || 
                               (statusFilter === 'Banned' && !isAct);

            return matchSearch && matchRole && matchStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    // --- XỬ LÝ GIAO DIỆN BADGE VAI TRÒ ---
    const getRoleBadge = (role) => {
        switch (role) {
            case 'Quản trị viên': return <Chip label="Admin" size="small" sx={{ bgcolor: '#fff1f0', color: '#f5222d', border: '1px solid #ffa39e', fontWeight: 'bold' }} />;
            case 'Nhân viên bếp': return <Chip label="Bếp" size="small" sx={{ bgcolor: '#fffbe6', color: '#faad14', border: '1px solid #ffe58f', fontWeight: 'bold' }} />;
            case 'Tài xế giao hàng': return <Chip label="Shipper" size="small" sx={{ bgcolor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff', fontWeight: 'bold' }} />;
            default: return <Chip label="Khách hàng" size="small" sx={{ bgcolor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f', fontWeight: 'bold' }} />;
        }
    };

    // --- XỬ LÝ NHẬP LIỆU FORM (Hàm đã được thêm vào) ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- XỬ LÝ MỞ DRAWER THÊM/SỬA ---
    const handleOpenAdd = () => {
        setFormData({ userName: '', email: '', phone: '', role: 'Khách hàng', address: '', isActive: true });
        setNewPassword('');
        setEditMode(false);
        setDrawerOpen(true);
    };

    const handleOpenEdit = (user) => {
        setFormData({
            ...user,
            userName: user.userName || user.username || '',
            role: user.role || 'Khách hàng',
            isActive: user.isActive !== false
        }); 
        setNewPassword(''); 
        setEditMode(true);
        setDrawerOpen(true);
    };

    // --- XỬ LÝ LƯU (SUBMIT) ---
    const handleSubmit = async () => {
        const userNameField = formData.userName;
        if (!userNameField) return alert('Vui lòng nhập họ tên!');
        if (!formData.email) return alert('Vui lòng nhập Email!'); 

        setIsSubmitting(true);
        try {
            const url = editMode ? `${API_URL}/api/accounts/users/${formData.id}` : `${API_URL}/api/accounts/users`;              
            const payload = { ...formData, username: userNameField };
            if (newPassword) payload.password = newPassword;
            if (!editMode) delete payload.id;

            const res = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(editMode ? 'Cập nhật thành công!' : 'Thêm tài khoản thành công!');
                setDrawerOpen(false);
                fetchUsers(); 
            } else {
                const errText = await res.text();
                alert(`Lỗi Server: ${errText}`);
            }
        } catch (error) {
            alert('Lỗi kết nối Server!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- XỬ LÝ XÓA & KHÓA ---
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này? Hành động không thể hoàn tác!')) return;
        try {
            const res = await fetch(`${API_URL}/api/accounts/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(item => item.id !== id));
                alert('Xóa thành công!');
            } else alert('Lỗi: Không thể xóa người dùng này!');
        } catch (error) { alert('Lỗi kết nối Server!'); }
    };

    const handleToggleStatus = (id, currentStatus) => {
        setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
    };

    // --- XỬ LÝ MỞ PROFILE ---
    const handleOpenProfile = (user) => {
        setSelectedUser(user);
        setProfileOpen(true);
    };

    if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><Typography>Đang tải dữ liệu...</Typography></Box>;

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <MainCard title="Quản lý Người dùng hệ thống" contentSX={{ p: 0 }}>
            
            {/* --- 1. THANH CÔNG CỤ (TOP BAR & FILTERS) --- */}
            <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
                    <TextField 
                        size="small" placeholder="Tìm tên, SĐT, Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
                        sx={{ width: { xs: '100%', sm: 280 } }}
                    />
                    
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} displayEmpty>
                            <MenuItem value="All">Tất cả vai trò</MenuItem>
                            <MenuItem value="Khách hàng">Khách hàng</MenuItem>
                            <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                            <MenuItem value="Nhân viên bếp">Nhân viên bếp</MenuItem>
                            <MenuItem value="Tài xế giao hàng">Tài xế giao hàng</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <MenuItem value="All">Mọi trạng thái</MenuItem>
                            <MenuItem value="Active">Đang hoạt động</MenuItem>
                            <MenuItem value="Banned">Bị khóa (Banned)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button variant="contained" sx={{ bgcolor: primaryColor, fontWeight: 'bold', '&:hover': { bgcolor: '#d9363e' } }} startIcon={<PlusOutlined />} onClick={handleOpenAdd}>
                    Thêm thành viên
                </Button>
            </Box>

            {/* --- 2. BẢNG DANH SÁCH (MAIN TABLE) --- */}
            <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 900 }}>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell>Thành viên</TableCell>
                            <TableCell>Thông tin liên hệ</TableCell>
                            <TableCell align="center">Vai trò</TableCell>
                            <TableCell align="right">Tổng đơn hàng</TableCell>
                            <TableCell align="center">Tham gia</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.length === 0 ? (
                            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}>Không tìm thấy người dùng phù hợp.</TableCell></TableRow>
                        ) : (
                            paginatedUsers.map((row) => {
                                const uName = row.userName || row.username || 'Khách vô danh';
                                const uRole = row.role || 'Khách hàng';
                                const isAct = row.isActive !== false;
                                const mockOrders = Math.floor(Math.random() * 20) + 1;
                                const mockTotal = mockOrders * 150000;

                                return (
                                    <TableRow hover key={row.id}>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar sx={{ bgcolor: '#e6f7ff', color: '#1890ff', fontWeight: 'bold' }}>{uName.charAt(0).toUpperCase()}</Avatar>
                                                <Typography 
                                                    variant="subtitle2" fontWeight={700} 
                                                    sx={{ cursor: 'pointer', color: '#262626', '&:hover': { color: primaryColor, textDecoration: 'underline' } }}
                                                    onClick={() => handleOpenProfile(row)}
                                                >
                                                    {uName}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={700} color="textPrimary">{row.phone || '09xx.xxx.xxx'}</Typography>
                                            <Typography variant="caption" color="textSecondary">{row.email || 'Chưa có email'}</Typography>
                                        </TableCell>
                                        <TableCell align="center">{getRoleBadge(uRole)}</TableCell>
                                        <TableCell align="right">
                                            {uRole === 'Khách hàng' ? (
                                                <>
                                                    <Typography variant="subtitle2" color="primary" fontWeight={700}>{mockOrders} đơn</Typography>
                                                    <Typography variant="caption" color="textSecondary">{mockTotal.toLocaleString('vi-VN')} ₫</Typography>
                                                </>
                                            ) : (
                                                <Typography variant="caption" color="textSecondary">- N/A -</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center"><Typography variant="body2">25/10/2023</Typography></TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={isAct ? "Khóa tài khoản (Ban)" : "Mở khóa tài khoản"}>
                                                <Switch checked={isAct} onChange={() => handleToggleStatus(row.id, isAct)} color="success" size="small" />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Sửa / Phân quyền"><IconButton color="primary" onClick={() => handleOpenEdit(row)}><EditOutlined /></IconButton></Tooltip>
                                            <Tooltip title="Xóa"><IconButton color="error" onClick={() => handleDelete(row.id)}><DeleteOutlined /></IconButton></Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- 3. THANH PHÂN TRANG --- */}
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                labelRowsPerPage="Hiển thị:"
                labelDisplayedRows={({ from, to, count }) => `Hiển thị ${from}-${to} trong tổng số ${count} người dùng`}
                sx={{ borderTop: '1px solid #f0f0f0' }}
            />

            {/* --- 4. DRAWER (POPUP TRƯỢT TỪ PHẢI): THÊM/SỬA NGƯỜI DÚNG --- */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: { xs: '100vw', sm: 450 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header Drawer */}
                    <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                        <Typography variant="h5" fontWeight={700}>{editMode ? 'Cập nhật Thành viên' : 'Tạo Tài khoản mới'}</Typography>
                        <Typography variant="body2" color="textSecondary">Điền thông tin và phân quyền cho người dùng</Typography>
                    </Box>

                    {/* Nội dung Form */}
                    <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                        <Stack spacing={3}>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Họ và Tên <span style={{color:'red'}}>*</span></InputLabel>
                                <TextField name="userName" value={formData.userName} onChange={handleChange} fullWidth size="small" placeholder="Nguyễn Văn A" />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Số điện thoại</InputLabel>
                                <TextField name="phone" value={formData.phone || ''} onChange={handleChange} fullWidth size="small" placeholder="0901234567" />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Email <span style={{color:'red'}}>*</span></InputLabel>
                                <TextField name="email" type="email" value={formData.email} onChange={handleChange} fullWidth size="small" placeholder="nguyenvana@gmail.com" disabled={editMode} />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>{editMode ? "Mật khẩu mới (Tùy chọn)" : "Mật khẩu *"}</InputLabel>
                                <TextField type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth size="small" placeholder="••••••••" />
                            </Box>
                            
                            <Divider sx={{ my: 1 }} />

                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Phân quyền (Role)</InputLabel>
                                <Select name="role" value={formData.role} onChange={handleChange} fullWidth size="small">
                                    <MenuItem value="Khách hàng">Khách hàng</MenuItem>
                                    <MenuItem value="Quản trị viên">Quản trị viên (Admin)</MenuItem>
                                    <MenuItem value="Nhân viên bếp">Nhân viên bếp (Kitchen)</MenuItem>
                                    <MenuItem value="Tài xế giao hàng">Tài xế giao hàng (Shipper)</MenuItem>
                                </Select>
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Địa chỉ giao hàng</InputLabel>
                                <TextField name="address" value={formData.address || ''} onChange={handleChange} fullWidth multiline rows={3} placeholder="Số nhà, Tên đường, Quận/Huyện..." />
                            </Box>
                        </Stack>
                    </Box>

                    {/* Footer Drawer (Nút bấm bám đáy) */}
                    <Box sx={{ p: 3, borderTop: '1px solid #f0f0f0', bgcolor: '#fff', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button onClick={() => setDrawerOpen(false)} color="inherit" variant="outlined" sx={{ fontWeight: 600 }}>Hủy bỏ</Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting} sx={{ bgcolor: primaryColor, fontWeight: 'bold', '&:hover': { bgcolor: '#d9363e' } }}>
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            {/* --- 5. UX ĐẶC BIỆT: DIALOG HỒ SƠ LỊCH SỬ KHÁCH HÀNG --- */}
            <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="sm" fullWidth>
                {selectedUser && (
                    <>
                        <DialogTitle sx={{ pb: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ width: 56, height: 56, bgcolor: '#ff4d4f' }}>{selectedUser.userName?.charAt(0)}</Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{selectedUser.userName}</Typography>
                                    <Typography variant="body2" color="textSecondary">{selectedUser.phone || '09xx'} • {selectedUser.email}</Typography>
                                </Box>
                            </Stack>
                        </DialogTitle>
                        <DialogContent dividers sx={{ bgcolor: '#fafafb' }}>
                            <Grid container spacing={3}>
                                {/* Thống kê */}
                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ p: 2, display: 'flex', justifyContent: 'space-around', border: '1px solid #eaeaea', borderRadius: 2 }}>
                                        <Box textAlign="center">
                                            <Typography variant="h4" color="primary">15</Typography>
                                            <Typography variant="caption" fontWeight={600} color="textSecondary">ĐƠN HÀNG</Typography>
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography variant="h4" color="success.main">2.4M</Typography>
                                            <Typography variant="caption" fontWeight={600} color="textSecondary">TỔNG CHI TIÊU</Typography>
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography variant="h4" color="warning.main">2</Typography>
                                            <Typography variant="caption" fontWeight={600} color="textSecondary">ĐƠN HỦY</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Món khoái khẩu */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HeartFilled style={{ color: '#ff4d4f' }} /> Món ăn yêu thích nhất
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Chip label="Burger Gà Phi-lê (x8)" bgcolor="#fff0f6" color="error" variant="outlined" />
                                        <Chip label="Pizza Hải Sản (x5)" bgcolor="#fff0f6" color="error" variant="outlined" />
                                    </Box>
                                </Grid>

                                {/* Lịch sử đơn hàng gần đây */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HistoryOutlined /> 3 đơn hàng gần nhất
                                    </Typography>
                                    <Paper elevation={0} sx={{ border: '1px solid #eaeaea', borderRadius: 2 }}>
                                        <List disablePadding>
                                            <ListItem divider>
                                                <ListItemAvatar><Avatar sx={{ bgcolor: '#f6ffed', color: '#52c41a' }}><CheckCircleFilled /></Avatar></ListItemAvatar>
                                                <ListItemText primary="Đơn #RF-1042 • 150.000đ" secondary="Giao thành công • Hôm qua, 18:30" />
                                            </ListItem>
                                            <ListItem divider>
                                                <ListItemAvatar><Avatar sx={{ bgcolor: '#f6ffed', color: '#52c41a' }}><CheckCircleFilled /></Avatar></ListItemAvatar>
                                                <ListItemText primary="Đơn #RF-0988 • 320.000đ" secondary="Giao thành công • 12/10/2023" />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemAvatar><Avatar sx={{ bgcolor: '#fff1f0', color: '#f5222d' }}><CloseCircleFilled /></Avatar></ListItemAvatar>
                                                <ListItemText primary="Đơn #RF-0901 • 115.000đ" secondary="Khách hủy đơn • 05/10/2023" />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </MainCard>
    );
}
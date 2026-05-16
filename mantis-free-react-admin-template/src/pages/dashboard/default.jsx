import { useState, useEffect } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
import { API_URL } from 'config';

// assets
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
  const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);

  // STATE LƯU DỮ LIỆU THẬT
  const [stats, setStats] = useState({ products: 0, categories: 0, reviews: 0 });
  const [recentProducts, setRecentProducts] = useState([]);

  // FETCH DATA TỪ BACKEND
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const timestamp = new Date().getTime();
        const [prodRes, catRes, revRes] = await Promise.all([
          fetch(`${API_URL}/api/catalog/products?t=${timestamp}`),
          fetch(`${API_URL}/api/catalog/admin/categories?t=${timestamp}`),
          fetch(`${API_URL}/api/recommendation/reviews?t=${timestamp}`)
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const revData = await revRes.json();

        // Đảm bảo dữ liệu là mảng
        const products = Array.isArray(prodData) ? prodData : (prodData.data || prodData.content || []);
        const categories = Array.isArray(catData) ? catData : [];
        const reviews = Array.isArray(revData) ? revData : [];

        // Cập nhật số liệu tổng
        setStats({
          products: products.length,
          categories: categories.length,
          reviews: reviews.length
        });

        // Lấy 5 sản phẩm mới nhất
        const sortedProducts = [...products].sort((a, b) => (b.id || b.productId) - (a.id || a.productId)).slice(0, 5);
        setRecentProducts(sortedProducts);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleOrderMenuClick = (event) => {
    setOrderMenuAnchor(event.currentTarget);
  };
  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };

  const handleAnalyticsMenuClick = (event) => {
    setAnalyticsMenuAnchor(event.currentTarget);
  };
  const handleAnalyticsMenuClose = () => {
    setAnalyticsMenuAnchor(null);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Tổng Quan Hệ Thống</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Tổng Sản Phẩm" count={stats.products.toString()} percentage={12.5} extra="Đang mở bán" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Danh Mục Món Ăn" count={stats.categories.toString()} percentage={5.2} extra="Hoạt động" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Lượt Đánh Giá" count={stats.reviews.toString()} percentage={27.4} color="warning" extra="Khách hàng" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Tổng Doanh Thu (Giả lập)" count="35,078,000 ₫" percentage={8.4} color="success" extra="Tuần này" />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Biểu Đồ Thu Nhập</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Thống kê tuần này
              </Typography>
              <Typography variant="h3">7,650,000 ₫</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Sản Phẩm Mới Thêm</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleOrderMenuClick}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu
              id="fade-menu"
              slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
              anchorEl={orderMenuAnchor}
              onClose={handleOrderMenuClose}
              open={Boolean(orderMenuAnchor)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleOrderMenuClose}>Xuất file CSV</MenuItem>
              <MenuItem onClick={handleOrderMenuClose}>Xuất file Excel</MenuItem>
              <MenuItem onClick={handleOrderMenuClose}>In Bảng</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {/* THAY THẾ OrdersTable BẰNG BẢNG DATA SẢN PHẨM THẬT */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên Sản Phẩm</TableCell>
                  <TableCell>Danh Mục</TableCell>
                  <TableCell align="right">Giá Bán</TableCell>
                  <TableCell align="center">Trạng Thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentProducts.length > 0 ? recentProducts.map((row) => {
                  const id = row.id || row.productId;
                  const price = row.price || 0;
                  return (
                    <TableRow hover key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{row.productName || row.name}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell align="right">{price.toLocaleString('vi-VN')} ₫</TableCell>
                      <TableCell align="center">
                        <Chip 
                            label={(row.availability > 0 || row.availability === undefined) ? 'Còn Hàng' : 'Hết Hàng'} 
                            color={(row.availability > 0 || row.availability === undefined) ? 'success' : 'error'} 
                            size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  )
                }) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Đang tải dữ liệu hoặc chưa có sản phẩm...</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Báo Cáo Phân Tích</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleAnalyticsMenuClick}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu
              id="fade-menu"
              slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
              anchorEl={analyticsMenuAnchor}
              open={Boolean(analyticsMenuAnchor)}
              onClose={handleAnalyticsMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleAnalyticsMenuClose}>Tuần này</MenuItem>
              <MenuItem onClick={handleAnalyticsMenuClose}>Tháng này</MenuItem>
              <MenuItem onClick={handleAnalyticsMenuClose}>Năm nay</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Tăng trưởng doanh thu" />
              <Typography variant="h5" color="primary">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Tỉ lệ chi phí" />
              <Typography variant="h5">12.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Tỉ lệ hoàn hàng" />
              <Typography variant="h5" color="error">Thấp</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Giao Dịch Gần Đây</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                px: 2,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + 1,430,000 ₫
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    Thành công
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Đơn hàng #002434</Typography>} secondary="Hôm nay, 2:00 PM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + 302,000 ₫
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    Thành công
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Đơn hàng #984947</Typography>} secondary="5 Tháng 8, 1:45 PM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    - 682,000 ₫
                  </Typography>
                  <Typography variant="h6" color="error" noWrap>
                    Hoàn tiền
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Đơn hàng #988784</Typography>} secondary="7 giờ trước" />
            </ListItem>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack sx={{ gap: 3 }}>
            <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Grid>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Hỗ Trợ Khách Hàng
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Phản hồi trong vòng 5 phút
                  </Typography>
                </Stack>
              </Grid>
              <Grid>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Trung Tâm Hỗ Trợ
            </Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
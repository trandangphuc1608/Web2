import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Drawer from './Drawer';
import Header from './Header'; // KHÔI PHỤC LẠI HEADER
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading, menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened; // Lấy trạng thái mở/đóng
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  // Tự động thu gọn khi màn hình nhỏ
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      
      {/* HEADER CÓ CHỨA NÚT THU GỌN MÀN HÌNH */}
      <Header />
      <Drawer />

      <Box 
        component="main" 
        sx={{ 
          // CHIỀU RỘNG CO GIÃN ĐỘNG: 260px khi mở, 60px khi đóng
          width: drawerOpen ? 'calc(100% - 260px)' : 'calc(100% - 60px)', 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          transition: 'width 0.3s ease', // Thêm hiệu ứng trượt mượt mà
        }}
      >
        <Toolbar sx={{ mt: 'inherit' }} />
        <Box
          sx={{
            ...{ px: { xs: 0, sm: 2 } },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Breadcrumbs />
          
          {/* NỘI DUNG CHÍNH (CÁC TRANG CỦA BẠN) */}
          <Box sx={{ mt: 1 }}>
            <Outlet />
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
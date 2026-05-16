// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {/* Cục Box này giúp đẩy Profile sang sát lề phải */}
      <Box sx={{ width: '100%', ml: 1 }} />
      
      {/* CHỈ GIỮ LẠI AVATAR NGƯỜI DÙNG */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
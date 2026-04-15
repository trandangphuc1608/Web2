// ==============================|| THEME CONFIG  ||============================== //

const config = {
  basename: '/',
  defaultPath: '/dashboard/default',
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr'
};

export default config;

// Khai báo độ rộng của thanh Menu bên trái
export const drawerWidth = 260;      // Dành cho các file cũ
export const DRAWER_WIDTH = 260;     // Dành cho các file mới (Fix lỗi MiniDrawerStyled)

// Các biến màu sắc hệ thống
export const twitterColor = '#1DA1F2';
export const githubColor = '#24292e';

// Đường dẫn mặc định khi hệ thống load lên
export const APP_DEFAULT_PATH = '/dashboard/default';
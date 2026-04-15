import { createBrowserRouter } from 'react-router-dom';

// Import 2 luồng giao diện của bạn
import MainRoutes from './MainRoutes';
import StoreRoutes from './StoreRoutes';

// Tạo router chuẩn của React Router v6+
const router = createBrowserRouter([StoreRoutes, MainRoutes], {
    basename: '/' // Ép React Router chạy từ thư mục gốc
});

export default router;
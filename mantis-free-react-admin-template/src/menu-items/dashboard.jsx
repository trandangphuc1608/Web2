import { 
    DashboardOutlined, 
    AppstoreAddOutlined, 
    UserOutlined, 
    ShoppingCartOutlined, 
    DollarOutlined,
    CommentOutlined
} from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined,
    AppstoreAddOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    CommentOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/admin',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'products',
            title: 'Sản phẩm',
            type: 'item',
            url: '/admin/products',
            icon: icons.AppstoreAddOutlined,
            breadcrumbs: false
        },
        {
            id: 'users',
            title: 'Người dùng',
            type: 'item',
            url: '/admin/users',
            icon: icons.UserOutlined,
            breadcrumbs: false
        },
        {
            id: 'orders',
            title: 'Đơn hàng',
            type: 'item',
            url: '/admin/orders',
            icon: icons.ShoppingCartOutlined,
            breadcrumbs: false
        },
        {
            id: 'payments',
            title: 'Thanh toán',
            type: 'item',
            url: '/admin/payments',
            icon: icons.DollarOutlined, 
            breadcrumbs: false
        },
        {
            id: 'reviews',
            title: 'Đánh giá',
            type: 'item',
            url: '/admin/reviews',
            icon: icons.CommentOutlined,
            breadcrumbs: false
        },
    ]
};

export default dashboard;
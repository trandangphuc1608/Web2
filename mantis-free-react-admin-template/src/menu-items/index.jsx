import { 
    DashboardOutlined, 
    AppstoreAddOutlined, 
    UserOutlined, 
    ShoppingCartOutlined, 
    DollarOutlined 
} from '@ant-design/icons';

const management = {
    id: 'group-management',
    title: 'Quản lý cửa hàng',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/',
            icon: DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'products',
            title: 'Sản phẩm',
            type: 'item',
            url: '/admin/products',
            icon: AppstoreAddOutlined,
            breadcrumbs: false
        },
        {
            id: 'users',
            title: 'Người dùng',
            type: 'item',
            url: '/admin/users',
            icon: UserOutlined,
            breadcrumbs: false
        },
        {
            id: 'orders',
            title: 'Đơn hàng',
            type: 'item',
            url: '/admin/orders',
            icon: ShoppingCartOutlined,
            breadcrumbs: false
        },
        {
            id: 'payments',
            title: 'Thanh toán',
            type: 'item',
            url: '/admin/payments',
            icon: DollarOutlined,
            breadcrumbs: false
        }
    ]
};

const menuItems = {
    items: [management] // Bỏ hẳn nhóm dashboard cũ
};

export default menuItems;
import { 
    DashboardOutlined, 
    AppstoreAddOutlined, 
    UserOutlined, 
    ShoppingCartOutlined, 
    DollarOutlined,
    CommentOutlined,
    PictureOutlined
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
            url: '/admin',
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
            id: 'categories',
            title: 'Danh mục',
            type: 'item',
            url: '/admin/categories',
            icon: AppstoreAddOutlined },
        {
            id: 'banners',
            title: 'Banner',
            type: 'item',
            url: '/admin/banners',
            icon: PictureOutlined,
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
        },
        {
            id: 'reviews',
            title: 'Đánh giá',
            type: 'item',
            url: '/admin/reviews',
            icon: CommentOutlined,
            breadcrumbs: false
        }
    ]
};

const menuItems = {
    items: [management]
};

export default menuItems;
    import { lazy } from 'react';
    import Loadable from 'components/Loadable';
    import StoreLayout from 'layout/StoreLayout';

    const StoreProductList = Loadable(lazy(() => import('pages/store/ProductList')));
    const Cart = Loadable(lazy(() => import('pages/store/Cart'))); 
    const OrderHistory = Loadable(lazy(() => import('pages/store/OrderHistory')));
    const ProductDetail = Loadable(lazy(() => import('pages/store/ProductDetail')));
    const AboutPage = Loadable(lazy(() => import('pages/store/AboutPage')));
    const ContactPage = Loadable(lazy(() => import('pages/store/ContactPage')));

    // --- CÁC TRANG CHÍNH SÁCH VÀ FOOTER ---
    const PrivacyPolicy = Loadable(lazy(() => import('pages/policies/PrivacyPolicy')));
    const Terms = Loadable(lazy(() => import('pages/policies/Terms')));
    const HelpCenter = Loadable(lazy(() => import('pages/policies/HelpCenter')));
    const ShoppingGuide = Loadable(lazy(() => import('pages/policies/ShoppingGuide')));
    const ReturnPolicy = Loadable(lazy(() => import('pages/policies/ReturnPolicy')));
    const CustomerSupport = Loadable(lazy(() => import('pages/policies/CustomerSupport')));
    const WarrantyPolicy = Loadable(lazy(() => import('pages/policies/WarrantyPolicy')));
    const Careers = Loadable(lazy(() => import('pages/policies/Careers')));
    const AuthenticGuarantee = Loadable(lazy(() => import('pages/policies/AuthenticGuarantee')));

    const StoreRoutes = {
        path: '/',
        element: <StoreLayout />,
        children: [
            { 
                path: '', 
                element: <StoreProductList /> 
            },
            { 
                path: 'cart', 
                element: <Cart /> 
            },
            { 
                path: 'history', 
                element: <OrderHistory /> 
            },
            {
                path: 'product/:id',
                element: <ProductDetail />
            },
            {
                path: 'gioi-thieu',
                element: <AboutPage />
            },
            {
                path: 'contact',
                element: <ContactPage />
            },
            
            // --- CÁC ĐƯỜNG DẪN TỪ FOOTER ---
            {
                path: 'chinh-sach-bao-mat',
                element: <PrivacyPolicy />
            },
            {
                path: 'dieu-khoan',
                element: <Terms />
            },
            {
                path: 'trung-tam-tro-giup',
                element: <HelpCenter />
            },
            {
                path: 'huong-dan-mua-hang',
                element: <ShoppingGuide />
            },
            {
                path: 'tra-hang-hoan-tien',
                element: <ReturnPolicy />
            },
            {
                path: 'cham-soc-khach-hang',
                element: <CustomerSupport />
            },
            {
                path: 'chinh-sach-bao-hanh',
                element: <WarrantyPolicy />
            },
            {
                path: 'tuyen-dung',
                element: <Careers />
            },
            {
                path: 'chinh-hang',
                element: <AuthenticGuarantee />
            }
        ]
    };

    export default StoreRoutes;
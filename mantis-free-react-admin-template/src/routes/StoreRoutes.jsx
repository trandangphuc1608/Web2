import { lazy } from 'react';
import Loadable from 'components/Loadable';
import StoreLayout from 'layout/StoreLayout';

const StoreProductList = Loadable(lazy(() => import('pages/store/ProductList')));
const Cart = Loadable(lazy(() => import('pages/store/Cart'))); 
const OrderHistory = Loadable(lazy(() => import('pages/store/OrderHistory')));
const ProductDetail = Loadable(lazy(() => import('pages/store/ProductDetail')));

const StoreRoutes = {
    path: '/', // Gốc của khách hàng
    element: <StoreLayout />,
    children: [
        { 
            path: '', // Trống -> localhost:3000/
            element: <StoreProductList /> 
        },
        { 
            path: 'cart', // -> localhost:3000/cart
            element: <Cart /> 
        },
        { 
            path: 'history', // -> localhost:3000/history
            element: <OrderHistory /> 
        },
        { path: 'product/:id', element: <ProductDetail /> }
    ]
};

export default StoreRoutes;
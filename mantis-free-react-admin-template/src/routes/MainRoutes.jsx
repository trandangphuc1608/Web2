import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

import ProductList from 'pages/products/ProductList';
import CategoryList from 'pages/categories/CategoryList';
import AddProduct from 'pages/products/AddProduct';
import EditProduct from 'pages/products/EditProduct';
import UserList from 'pages/users/UserList';
import OrderList from 'pages/orders/OrderList';
import PaymentList from 'pages/payments/PaymentList';
import ReviewList from 'pages/reviews/ReviewList';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/admin',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },

    { path: 'products', element: <ProductList /> },
    { path: 'categories', element: <CategoryList /> },
    { path: 'products/add', element: <AddProduct /> },
    { path: 'products/edit/:id', element: <EditProduct /> },
    { path: 'users', element: <UserList /> },
    { path: 'orders', element: <OrderList /> },
    { path: 'payments', element: <PaymentList /> },
    { path: 'reviews', element: <ReviewList /> }
  ]
};

export default MainRoutes;
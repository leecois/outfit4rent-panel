import 'dayjs/locale/de';
import '@refinedev/antd/dist/reset.css';

import {
  DashboardOutlined,
  ProductOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  ErrorComponent,
  ThemedLayoutV2,
  useNotificationProvider,
} from '@refinedev/antd';
import type { IResourceItem } from '@refinedev/core';
import { Authenticated, Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbarProvider } from '@refinedev/kbar';
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { authProvider } from './authProvider';
import { Header, Title } from './components';
import { BikeWhiteIcon } from './components/icons';
import { ConfigProvider } from './context';
import { useAutoLoginForDemo } from './hooks';
import { AuthPage } from './pages/auth';
import { CategoryList } from './pages/categories';
import { CourierCreate, CourierEdit, CourierList } from './pages/couriers';
import { CustomerList, CustomerShow } from './pages/customers';
import { DashboardPage } from './pages/dashboard';
import { OrderList, OrderShow } from './pages/orders';
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from './pages/products';
import { StoreCreate, StoreEdit, StoreList } from './pages/stores';
import { dataProvider } from './rest-data-provider';

interface TitleHandlerOptions {
  resource?: IResourceItem;
}

const customTitleHandler = ({ resource }: TitleHandlerOptions): string => {
  const baseTitle = 'Outfit4Rent';
  const titleSegment = resource?.name;
  const title = titleSegment ? `${titleSegment} | ${baseTitle}` : baseTitle;
  return title;
};
const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  const API_URL = 'https://api.outfit4rent.online';
  const data = dataProvider(API_URL);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, parameters: object) => t(key, parameters),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <ConfigProvider>
        <RefineKbarProvider>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={data}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: 'vJyqp2-XpgDqf-5v0KTA',
              }}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: {
                    label: 'Dashboard',
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: 'orders',
                  list: '/orders',
                  show: '/orders/:id',
                  meta: {
                    icon: <ShoppingOutlined />,
                  },
                },
                {
                  name: 'customers',
                  list: '/customers',
                  show: '/customers/:id',
                  meta: {
                    icon: <UserOutlined />,
                  },
                },
                {
                  name: 'products',
                  list: '/products',
                  create: '/products/new',
                  edit: '/products/:id/edit',
                  show: '/products/:id',
                  meta: {
                    icon: <ProductOutlined />,
                  },
                },
                {
                  name: 'categories',
                  list: '/categories',
                  meta: {
                    icon: <TagsOutlined />,
                  },
                },
                {
                  name: 'stores',
                  list: '/stores',
                  create: '/stores/new',
                  edit: '/stores/:id/edit',
                  meta: {
                    icon: <ShopOutlined />,
                  },
                },
                {
                  name: 'couriers',
                  list: '/couriers',
                  create: '/couriers/new',
                  edit: '/couriers/:id/edit',
                  show: '/couriers/:id',
                  meta: {
                    icon: <BikeWhiteIcon />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <div
                          style={{
                            maxWidth: '1200px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        >
                          <Outlet />
                        </div>
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardPage />} />

                  <Route path="/orders">
                    <Route index element={<OrderList />} />
                    <Route path=":id" element={<OrderShow />} />
                  </Route>

                  <Route
                    path="/customers"
                    element={
                      <CustomerList>
                        <Outlet />
                      </CustomerList>
                    }
                  >
                    <Route path=":id" element={<CustomerShow />} />
                  </Route>

                  <Route
                    path="/products"
                    element={
                      <ProductList>
                        <Outlet />
                      </ProductList>
                    }
                  >
                    <Route path="new" element={<ProductCreate />} />
                    <Route path=":id" element={<ProductShow />} />
                    <Route path=":id/edit" element={<ProductEdit />} />
                  </Route>

                  <Route path="/stores">
                    <Route index element={<StoreList />} />
                    <Route path="new" element={<StoreCreate />} />
                    <Route path=":id/edit" element={<StoreEdit />} />
                  </Route>

                  <Route path="/categories" element={<CategoryList />} />

                  <Route path="/couriers">
                    <Route
                      path=""
                      element={
                        <CourierList>
                          <Outlet />
                        </CourierList>
                      }
                    >
                      <Route path="new" element={<CourierCreate />} />
                    </Route>

                    <Route path=":id/edit" element={<CourierEdit />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          initialValues: {
                            email: 'demo@outfit4rent.dev',
                            password: 'demodemo',
                          },
                        }}
                      />
                    }
                  />
                </Route>

                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={customTitleHandler} />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;

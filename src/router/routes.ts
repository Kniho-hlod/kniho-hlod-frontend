export const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/home',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('@/layouts/AppLayout.vue'),
        children: [
          { path: '', redirect: '/home/overview' },
          {
            path: 'overview',
            name: 'overview',
            component: () => import('@/features/overview/components/OverviewTab.vue'),
          },
          {
            path: 'loans',
            name: 'loans',
            component: () => import('@/features/loans/components/LoansTab.vue'),
          },
          {
            path: 'books',
            name: 'books',
            component: () => import('@/features/books/components/BooksTab.vue'),
          },
          {
            path: 'account',
            name: 'account',
            component: () => import('@/features/account/components/AccountAccordion.vue'),
          },
          {
            path: 'admin',
            name: 'admin',
            component: () => import('@/features/users/components/AdministratorTab.vue'),
            meta: { requiresRole: 'admin' },
          },
          {
            path: 'notifications',
            name: 'notifications',
            component: () => import('@/pages/NotificationsPage.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/pages/ResetPasswordPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

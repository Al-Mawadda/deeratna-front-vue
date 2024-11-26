import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
        HeaderTitle: 'الرئيسية',
      },
    },
    //ADS
    {
      path: '/ads/video',
      component: () => import('../views/ads/video.vue'),
      name: 'Ads-Video',
      meta: { requiresAuth: true },
    },
    {
      path: '/ads/main',
      component: () => import('../views/ads/main.vue'),
      name: 'Ads-Main',
      meta: { requiresAuth: true },
    },
    {
      path: '/ads/services',
      component: () => import('../views/ads/services.vue'),
      name: 'Ads-Services',
      meta: { requiresAuth: true },
    },
    {
      path: '/ads/energy',
      component: () => import('../views/ads/energy.vue'),
      name: 'Ads-Energy',
      meta: { requiresAuth: true },
    },

    //Requests
    {
      path: '/information-requests',
      component: () => import('../views/requests/information.vue'),
      name: 'InformationRequests',
      meta: { requiresAuth: true },
    },
    {
      path: '/nfc-cards-requests',
      component: () => import('../views/requests/nfcCard.vue'),
      name: 'NfcCardsRequests',
      meta: { requiresAuth: true },
    },
    {
      path: '/cars-label-requests',
      component: () => import('../views/requests/carLabel.vue'),
      name: 'CarsLabelRequests',
      meta: { requiresAuth: true },
    },

    // PAYMENTS
    {
      path: '/installment-payment',
      component: () => import('../views/payment/installment.vue'),
      name: 'Installment-Payment',
      meta: { requiresAuth: true },
    },
    {
      path: '/services-payment',
      component: () => import('../views/payment/services.vue'),
      name: 'Services-Payment',
      meta: { requiresAuth: true },
    },
    {
      path: '/energy-payment',
      component: () => import('../views/payment/energy.vue'),
      name: 'Energy-Payment',
      meta: { requiresAuth: true },
    },
    {
      path: '/nfccardadd-payment',
      component: () => import('../views/payment/nfcCardAdd.vue'),
      name: 'NfcAdd-Payment',
      meta: { requiresAuth: true },
    },
    {
      path: '/nfccardrenew-payment',
      component: () => import('../views/payment/nfcCardrenew.vue'),
      name: 'NfcRenew-Payment',
      meta: { requiresAuth: true },
    },
    {
      path: '/carlabeladd-payment',
      component: () => import('../views/payment/carLabelAdd.vue'),
      name: 'CarAdd-Payment',
      meta: { requiresAuth: true },
    },
    {
      path: '/carlabelrenew-payment',
      component: () => import('../views/payment/carLabelRenew.vue'),
      name: 'CarRenew-Payment',
      meta: { requiresAuth: true },
    },


    // USERS
    {
      path: '/users',
      component: () => import('../views/users/index.vue'),
      name: 'users',
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login.vue'),
      meta: {
        RequiresAuth: true,
        HeaderTitle: 'تعديل الطلب',
        Operation: 'EDIT',
      }
    },

  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router

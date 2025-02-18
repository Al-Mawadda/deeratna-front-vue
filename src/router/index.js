import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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

    // Contracts
    {
      path: '/contracts/add',
      component: () => import('../views/contracts/ContractDetails.vue'),
      name: 'ContractDetails',
      meta: { requiresAuth: true, HeaderTitle: 'ادخال عقد جديد' },
    },
    // Information
    {
      path: '/information/add',
      component: () => import('../views/information/PersonsInformation.vue'),
      name: 'PersonsInformation',
      meta: { requiresAuth: true, HeaderTitle: 'بيانات الاشخاص' },
    },
    // Internet
    {
      path: '/internet/subscribers',
      component: () => import('../views/internet/InternetSubscribers.vue'),
      name: 'SubscribersInformation',
      meta: { requiresAuth: true, HeaderTitle: 'بيانات المشتركين' },
    },
    {
      path: '/internet/profile',
      component: () => import('../views/internet/InternetProfiles.vue'),
      name: 'InternetProfiles',
      meta: { requiresAuth: true, HeaderTitle: 'الاشتراكات' },
    },
    //ADS
    {
      path: '/ads/video',
      component: () => import('../views/ads/video.vue'),
      name: 'Ads-Video',
      meta: { requiresAuth: true, HeaderTitle: 'فديوات المدينة' },
    },
    {
      path: '/ads/main',
      component: () => import('../views/ads/main.vue'),
      name: 'Ads-Main',
      meta: { requiresAuth: true, HeaderTitle: 'اعلانات الواجهة الرئيسية' },
    },
    {
      path: '/ads/services',
      component: () => import('../views/ads/services.vue'),
      name: 'Ads-Services',
      meta: { requiresAuth: true, HeaderTitle: 'اعلانات الخدمات' },
    },
    {
      path: '/ads/energy',
      component: () => import('../views/ads/energy.vue'),
      name: 'Ads-Energy',
      meta: { requiresAuth: true, HeaderTitle: 'اعلانات المولد' },
    },
    {
      path: '/ads/Home-secondVideo',
      component: () => import('../views/ads/homeSecondVideo.vue'),
      name: 'Ads-secondVideo',
      meta: { requiresAuth: true },
    },

    //Requests

    {
      path: '/information-requests',
      component: () => import('../views/requests/informationRequest.vue'),
      name: 'InformationRequest',
      meta: { requiresAuth: true, HeaderTitle: 'ادارة المعلومات' },
    },
    {
      path: '/nfc-cards-requests',
      component: () => import('../views/requests/nfcCardRequest.vue'),
      name: 'nfcCardRequest',
      meta: { requiresAuth: true, HeaderTitle: 'بطاقات الدخول' },
    },
    {
      path: '/cars-label-requests',
      component: () => import('../views/requests/carLabelRequest.vue'),
      name: 'CarsLabelRequests',
      meta: { requiresAuth: true, HeaderTitle: 'ملصق السيارات' },
    },
    {
      path: '/internet-requests',
      component: () => import('../views/requests/internetRequest.vue'),
      name: 'internetRequest',
      meta: { requiresAuth: true, HeaderTitle: 'طلبات الانترنت' },
    },

    // PAYMENTS
    {
      path: '/installment-payment',
      component: () => import('../views/payment/installmentView.vue'),
      name: 'Installment-Payment',
      meta: { requiresAuth: true, HeaderTitle: 'دفع الاقساط' },
    },
    {
      path: '/services-payment',
      component: () => import('../views/payment/servicesView.vue'),
      name: 'Services-Payment',
      meta: { requiresAuth: true, HeaderTitle: 'دفع الخدمات' },
    },
    {
      path: '/electricity-payment',
      component: () => import('../views/payment/electricityView.vue'),
      name: 'Electricity-Payment',
      meta: { requiresAuth: true, HeaderTitle: 'دفع المولد' },
    },
    {
      path: '/nfccard-payment',
      component: () => import('../views/payment/nfcCardView.vue'),
      name: 'Nfccard-Payment',
      meta: { requiresAuth: true, HeaderTitle: 'دفع البطاقات' },
    },
    {
      path: '/carlabele-payment',
      component: () => import('../views/payment/carLabelView.vue'),
      name: 'Carlabele-Payment',
      meta: { requiresAuth: true, HeaderTitle: 'دفع ملصق السيارات' },
    },
    {
      path: '/internet-payment',
      component: () => import('../views/payment/InternetView.vue'),
      name: 'Internet-Payment',
      meta: { requiresAuth: true, HeaderTitle: 'دفع الانترنيت' },
    },

    // USERS
    {
      path: '/users',
      component: () => import('../views/users/index.vue'),
      name: 'users',
      meta: { requiresAuth: true, HeaderTitle: 'ادارة المستخدمين' },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login.vue'),
      meta: {
        HeaderTitle: 'تعديل الطلب',
        Operation: 'EDIT',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router

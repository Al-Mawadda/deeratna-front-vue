import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //#region Login
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login.vue'),
      meta: {
        HeaderTitle: 'تسجيل دخول',
        Operation: 'EDIT',
      },
    },
    //#endregion

    //#region Home
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
        HeaderTitle: 'الرئيسية',
      },
    },
    //#endregion

    //#region Contracts
    {
      path: '/contracts/add',
      component: () => import('../views/contracts/ContractDetails.vue'),
      name: 'ContractDetails',
      meta: { requiresAuth: true, HeaderTitle: 'ادخال عقد جديد' },
    },
    //#endregion

    //#region Real Estates
    {
      path: '/real_estates',
      component: () => import('../views/contracts/RealEstatesView.vue'),
      name: 'RealEstates',
      meta: { requiresAuth: true, HeaderTitle: 'العقارات' },
    },
    {
      path: '/real_estates/add',
      component: () => import('../views/contracts/RealEstateDetailsView.vue'),
      name: 'AddRealEstate',
      meta: { requiresAuth: true, Operation: 'ADD', HeaderTitle: 'اضافة عقار' },
    },
    {
      path: '/real_estates/edit',
      component: () => import('../views/contracts/RealEstateDetailsView.vue'),
      name: 'EditRealEstate',
      meta: {
        requiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل العقار',
      },
    },
    //#endregion

    //#region Information
    {
      path: '/persons',
      component: () => import('../views/information/PersonsView.vue'),
      name: 'Persons',
      meta: { requiresAuth: true, HeaderTitle: 'معلومات الاشخاص' },
    },
    {
      path: '/persons/add',
      component: () => import('../views/information/PersonsDetailsView.vue'),
      name: 'AddPerson',
      meta: { requiresAuth: true, Operation: 'ADD', HeaderTitle: 'اضافة شخص' },
    },
    {
      path: '/persons/edit',
      component: () => import('../views/information/PersonsDetailsView.vue'),
      name: 'EditPerson',
      meta: {
        requiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل الشخص',
      },
    },
    {
      path: '/sales/tenants',
      component: () => import('../views/information/SalesTenantsView.vue'),
      name: 'SalesTenants',
      meta: { requiresAuth: true, HeaderTitle: 'المستاجرين' },
    },
    //#endregion

    //#region NFC Cards
    {
      path: '/nfc_cards',
      component: () => import('../views/information/NFCCardsView.vue'),
      name: 'NFCCards',
      meta: { requiresAuth: true, HeaderTitle: 'بطاقات الدخول' },
    },
    //#endregion

    //#region Internet
    {
      path: '/internet/subscribers',
      component: () => import('../views/internet/InternetSubscribers.vue'),
      name: 'SubscribersInformation',
      meta: { requiresAuth: true, HeaderTitle: 'الانترنيت - بيانات المشتركين' },
    },
    {
      path: '/internet/profile',
      component: () => import('../views/internet/InternetProfiles.vue'),
      name: 'InternetProfiles',
      meta: { requiresAuth: true, HeaderTitle: 'الاشتراكات' },
    },
    //#endregion

    //#region ADS
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
    {
      path: '/ads/send-deeratna-notification',
      component: () => import('../views/ads/deeratnaNotificationSend.vue'),
      name: 'send-deeratna-notification',
      meta: { requiresAuth: true, HeaderTitle: 'ارسال اشعار ديرتنا ' },
    },
    //#endregion

    //#region Requests
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
    {
      path: '/maintenance-requests',
      component: () => import('../views/requests/maintenanceRequest.vue'),
      name: 'maintenanceRequest',
      meta: { requiresAuth: true, HeaderTitle: 'طلبات الصيانة' },
    },
    //#endregion

    //#region Payments
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
    {
      path: '/maintenance-payment',
      component: () => import('../views/payment/maintenance.vue'),
      name: 'maintenance-payment',
      meta: { requiresAuth: true, HeaderTitle: 'الصيانة' },
    },
    //#endregion

    //#region Camps
    // Camps
    {
      path: '/camps',
      component: () => import('../views/camps/CampsView.vue'),
      name: 'Camps',
      meta: { requiresAuth: true, HeaderTitle: 'الكمبات' },
    },
    {
      path: '/camps/add',
      component: () => import('../views/camps/CampsDetailsView.vue'),
      name: 'AddCamp',
      meta: {
        requiresAuth: true,
        Operation: 'ADD',
        HeaderTitle: 'اضافة كمب',
      },
    },
    {
      path: '/camps/edit',
      component: () => import('../views/camps/CampsDetailsView.vue'),
      name: 'EditCamp',
      meta: {
        requiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل كمب',
      },
    },

    // Contractors
    {
      path: '/camps/contractors',
      component: () => import('../views/camps/ContractorsView.vue'),
      name: 'CampsConractors',
      meta: { requiresAuth: true, HeaderTitle: 'المتعهدين' },
    },
    {
      path: '/camps/contractors/add',
      component: () => import('../views/camps/ContractorDetailsView.vue'),
      name: 'AddCampsContractor',
      meta: {
        requiresAuth: true,
        Operation: 'ADD',
        HeaderTitle: 'اضافة متعهد',
      },
    },
    {
      path: '/camps/contractors/edit',
      component: () => import('../views/camps/ContractorDetailsView.vue'),
      name: 'EditCampsContractor',
      meta: {
        requiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل المتعهد',
      },
    },

    // Workers
    {
      path: '/camps/workers',
      component: () => import('../views/camps/WorkersView.vue'),
      name: 'CampsWorkers',
      meta: { requiresAuth: true, HeaderTitle: 'العمال' },
    },
    {
      path: '/camps/workers/add',
      component: () => import('../views/camps/WorkerDetailsView.vue'),
      name: 'AddCampsWorker',
      meta: { requiresAuth: true, Operation: 'ADD', HeaderTitle: 'اضافة عامل' },
    },
    {
      path: '/camps/workers/edit',
      component: () => import('../views/camps/WorkerDetailsView.vue'),
      name: 'EditCampsWorker',
      meta: {
        requiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل العامل',
      },
    },
    //#endregion

    //#region Users
    {
      path: '/users',
      component: () => import('../views/users/index.vue'),
      name: 'users',
      meta: { requiresAuth: true, HeaderTitle: 'ادارة المستخدمين' },
    },
    {
      path: '/deeratna_app_users',
      component: () => import('../views/users/deeratnaAppUsers.vue'),
      name: 'deeratna_app_users',
      meta: { requiresAuth: true, HeaderTitle: 'ادارة مستخدمي ديرتنا' },
    },
    //#endregion

    //#region QR
    {
      path: '/qr-data',
      component: () => import('../views/qr/qrLog.vue'),
      name: 'qr-data',
      meta: { requiresAuth: true, HeaderTitle: 'بيانات الـ QR' },
    },
    {
      path: '/qr-notification',
      component: () => import('../views/qr/qrNotification.vue'),
      name: 'qr-security',
      meta: { requiresAuth: true, HeaderTitle: 'الاشعارات' },
    },
    {
      path: '/qr-customers',
      component: () => import('../views/qr/qrCustomers.vue'),
      name: 'qr-management',
      meta: { requiresAuth: true, HeaderTitle: 'بيانات المشتركين' },
    },
    {
      path: '/send-qr-notification',
      component: () => import('../views/qr/qrNotificationSend.vue'),
      name: 'send-qr-notification',
      meta: { requiresAuth: true, HeaderTitle: 'ارسال اشعار كيو ار' },
    },
    {
      path: '/send-qr-notification',
      component: () => import('../views/qr/qrNotificationSend.vue'),
      name: 'send-qr-notification',
      meta: { requiresAuth: true, HeaderTitle: 'ارسال اشعار كيو ار' },
    },
    //#endregion

    //#region Logs
    {
      path: '/logs/auto_updates',
      component: () => import('../views/logs/AutoUpdatesView.vue'),
      name: 'AutoUpdatesLog',
      meta: { requiresAuth: true, HeaderTitle: 'سجل التحديث التلقائي' },
    },
    //#endregion

    //#region local_management
    {
      path: '/localmanagement/maintenance_list',
      component: () => import('../views/LocalManagement/maintenanceList.vue'),
      name: 'maintenanceList',
      meta: { requiresAuth: true, HeaderTitle: 'قائمة الصيانات' },
    },
    //#endregion
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

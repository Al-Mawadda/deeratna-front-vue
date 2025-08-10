import { createRouter, createWebHistory } from 'vue-router'
import { useGlobalsStore } from '../stores/Globals.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //#region Login
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        HeaderTitle: 'تسجيل دخول',
      },
    },
    //#endregion

    //#region Home
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        RequiresAuth: true,
        HeaderTitle: 'الرئيسية',
      },
    },
    //#endregion

    //#region Contracts
    {
      path: '/contracts/add',
      component: () => import('../views/contracts/ContractDetails.vue'),
      name: 'ContractDetails',
      meta: { RequiresAuth: true, HeaderTitle: 'ادخال عقد جديد' },
    },
    //#endregion

    //#region Real Estates
    {
      path: '/real_estates',
      component: () => import('../views/contracts/RealEstatesView.vue'),
      name: 'RealEstates',
      meta: { RequiresAuth: true, HeaderTitle: 'العقارات' },
    },
    {
      path: '/real_estates/add',
      component: () => import('../views/contracts/RealEstateDetailsView.vue'),
      name: 'AddRealEstate',
      meta: { RequiresAuth: true, Operation: 'ADD', HeaderTitle: 'اضافة عقار' },
    },
    {
      path: '/real_estates/edit',
      component: () => import('../views/contracts/RealEstateDetailsView.vue'),
      name: 'EditRealEstate',
      meta: {
        RequiresAuth: true,
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
      meta: { RequiresAuth: true, HeaderTitle: 'معلومات الاشخاص' },
    },
    {
      path: '/persons/add',
      component: () => import('../views/information/PersonsDetailsView.vue'),
      name: 'AddPerson',
      meta: { RequiresAuth: true, Operation: 'ADD', HeaderTitle: 'اضافة شخص' },
    },
    {
      path: '/persons/edit',
      component: () => import('../views/information/PersonsDetailsView.vue'),
      name: 'EditPerson',
      meta: {
        RequiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل الشخص',
      },
    },
    {
      path: '/sales/owners',
      component: () => import('../views/information/SalesOwnersView.vue'),
      name: 'SalesOwners',
      meta: { RequiresAuth: true, HeaderTitle: 'المالكين' },
    },
    {
      path: '/sales/tenants',
      component: () => import('../views/information/SalesTenantsView.vue'),
      name: 'SalesTenants',
      meta: { RequiresAuth: true, HeaderTitle: 'المستاجرين' },
    },
    {
      path: '/car_labels',
      component: () => import('../views/information/CarLabelsView.vue'),
      name: 'CarLabels',
      meta: { RequiresAuth: true, HeaderTitle: 'ملصقات السيارات' },
    },
    //#endregion

    //#region NFC Cards
    {
      path: '/nfc_cards',
      component: () => import('../views/information/NFCCardsView.vue'),
      name: 'NFCCards',
      meta: { RequiresAuth: true, HeaderTitle: 'بطاقات الدخول' },
    },
    //#endregion

    //#region Internet
    {
      path: '/internet/subscribers',
      component: () => import('../views/internet/InternetSubscribers.vue'),
      name: 'SubscribersInformation',
      meta: { RequiresAuth: true, HeaderTitle: 'الانترنيت - بيانات المشتركين' },
    },
    {
      path: '/internet/profile',
      component: () => import('../views/internet/InternetProfiles.vue'),
      name: 'InternetProfiles',
      meta: { RequiresAuth: true, HeaderTitle: 'الاشتراكات' },
    },
    {
      path: '/internet/maintenance_list',
      component: () => import('../views/internet/InternetMaintenanceList.vue'),
      name: 'InternetMaintenanceList',
      meta: { RequiresAuth: true, HeaderTitle: 'قائمة صيانات الانرنت' },
    },
    //#endregion

    //#region ADS
    {
      path: '/ads/video',
      component: () => import('../views/ads/video.vue'),
      name: 'Ads-Video',
      meta: { RequiresAuth: true, HeaderTitle: 'فديوات المدينة' },
    },
    {
      path: '/ads/main',
      component: () => import('../views/ads/main.vue'),
      name: 'Ads-Main',
      meta: { RequiresAuth: true, HeaderTitle: 'اعلانات الواجهة الرئيسية' },
    },
    {
      path: '/ads/services',
      component: () => import('../views/ads/services.vue'),
      name: 'Ads-Services',
      meta: { RequiresAuth: true, HeaderTitle: 'اعلانات الخدمات' },
    },
    {
      path: '/ads/energy',
      component: () => import('../views/ads/energy.vue'),
      name: 'Ads-Energy',
      meta: { RequiresAuth: true, HeaderTitle: 'اعلانات المولد' },
    },
    {
      path: '/ads/Home-secondVideo',
      component: () => import('../views/ads/homeSecondVideo.vue'),
      name: 'Ads-secondVideo',
      meta: { RequiresAuth: true },
    },
    {
      path: '/ads/send-deeratna-notification',
      component: () => import('../views/ads/deeratnaNotificationSend.vue'),
      name: 'send-deeratna-notification',
      meta: { RequiresAuth: true, HeaderTitle: 'ارسال اشعار ديرتنا ' },
    },
    //#endregion

    //#region Requests
    {
      path: '/information-requests',
      component: () => import('../views/requests/informationRequest.vue'),
      name: 'InformationRequest',
      meta: { RequiresAuth: true, HeaderTitle: 'ادارة المعلومات' },
    },
    {
      path: '/nfc-cards-requests',
      component: () => import('../views/requests/nfcCardRequest.vue'),
      name: 'nfcCardRequest',
      meta: { RequiresAuth: true, HeaderTitle: 'بطاقات الدخول' },
    },
    {
      path: '/cars-label-requests',
      component: () => import('../views/requests/carLabelRequest.vue'),
      name: 'CarsLabelRequests',
      meta: { RequiresAuth: true, HeaderTitle: 'ملصق السيارات' },
    },
    {
      path: '/internet-requests',
      component: () => import('../views/requests/internetRequest.vue'),
      name: 'internetRequest',
      meta: { RequiresAuth: true, HeaderTitle: 'طلبات الانترنت' },
    },
    {
      path: '/maintenance-requests',
      component: () => import('../views/requests/maintenanceRequest.vue'),
      name: 'maintenanceRequest',
      meta: { RequiresAuth: true, HeaderTitle: 'صيانة المنازل' },
    },
    {
      path: '/internet-maintenance-requests',
      component: () =>
        import('../views/requests/internetMaintenanceRequest.vue'),
      name: 'internetmaintenanceRequest',
      meta: { RequiresAuth: true, HeaderTitle: 'صيانة الانترنيت' },
    },
    //#endregion

    //#region Payments
    {
      path: '/installment-payment',
      component: () => import('../views/payment/installmentView.vue'),
      name: 'Installment-Payment',
      meta: { RequiresAuth: true, HeaderTitle: 'دفع الاقساط' },
    },
    {
      path: '/services-payment',
      component: () => import('../views/payment/servicesView.vue'),
      name: 'Services-Payment',
      meta: { RequiresAuth: true, HeaderTitle: 'دفع الخدمات' },
    },
    {
      path: '/electricity-payment',
      component: () => import('../views/payment/electricityView.vue'),
      name: 'Electricity-Payment',
      meta: { RequiresAuth: true, HeaderTitle: 'دفع المولد' },
    },
    {
      path: '/nfccard-payment',
      component: () => import('../views/payment/nfcCardView.vue'),
      name: 'Nfccard-Payment',
      meta: { RequiresAuth: true, HeaderTitle: 'دفع البطاقات' },
    },
    {
      path: '/carlabele-payment',
      component: () => import('../views/payment/carLabelView.vue'),
      name: 'Carlabele-Payment',
      meta: { RequiresAuth: true, HeaderTitle: 'دفع ملصق السيارات' },
    },
    {
      path: '/internet-payment',
      component: () => import('../views/payment/InternetView.vue'),
      name: 'Internet-Payment',
      meta: { RequiresAuth: true, HeaderTitle: 'دفع الانترنيت' },
    },
    {
      path: '/maintenance-payment',
      component: () => import('../views/payment/maintenance.vue'),
      name: 'maintenance-payment',
      meta: { RequiresAuth: true, HeaderTitle: 'الصيانة' },
    },
    //#endregion

    //#region Camps
    // Camps
    {
      path: '/camps',
      component: () => import('../views/camps/CampsView.vue'),
      name: 'Camps',
      meta: { RequiresAuth: true, HeaderTitle: 'الكمبات' },
    },
    {
      path: '/camps/add',
      component: () => import('../views/camps/CampsDetailsView.vue'),
      name: 'AddCamp',
      meta: {
        RequiresAuth: true,
        Operation: 'ADD',
        HeaderTitle: 'اضافة كمب',
      },
    },
    {
      path: '/camps/edit',
      component: () => import('../views/camps/CampsDetailsView.vue'),
      name: 'EditCamp',
      meta: {
        RequiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل كمب',
      },
    },

    // Contractors
    {
      path: '/camps/contractors',
      component: () => import('../views/camps/ContractorsView.vue'),
      name: 'CampsConractors',
      meta: { RequiresAuth: true, HeaderTitle: 'المتعهدين' },
    },
    {
      path: '/camps/contractors/add',
      component: () => import('../views/camps/ContractorDetailsView.vue'),
      name: 'AddCampsContractor',
      meta: {
        RequiresAuth: true,
        Operation: 'ADD',
        HeaderTitle: 'اضافة متعهد',
      },
    },
    {
      path: '/camps/contractors/edit',
      component: () => import('../views/camps/ContractorDetailsView.vue'),
      name: 'EditCampsContractor',
      meta: {
        RequiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل المتعهد',
      },
    },

    // Workers
    {
      path: '/camps/workers',
      component: () => import('../views/camps/WorkersView.vue'),
      name: 'CampsWorkers',
      meta: { RequiresAuth: true, HeaderTitle: 'العمال' },
    },
    {
      path: '/camps/workers/add',
      component: () => import('../views/camps/WorkerDetailsView.vue'),
      name: 'AddCampsWorker',
      meta: { RequiresAuth: true, Operation: 'ADD', HeaderTitle: 'اضافة عامل' },
    },
    {
      path: '/camps/workers/edit',
      component: () => import('../views/camps/WorkerDetailsView.vue'),
      name: 'EditCampsWorker',
      meta: {
        RequiresAuth: true,
        Operation: 'EDIT',
        HeaderTitle: 'تعديل العامل',
      },
    },
    //#endregion

    //#region Users
    {
      path: '/users',
      component: () => import('../views/users/UsersView.vue'),
      name: 'Users',
      meta: {
        RequiresAuth: true,
        HeaderTitle: 'ادارة المستخدمين'
      },
    },
    {
      path: '/users/add',
      component: () => import('../views/users/UsersDetailsView.vue'),
      name: 'AddUser',
      meta: {
        RequiresAuth: true,
        HeaderTitle: 'اضافة مستخدم',
        Operation: 'ADD',
      },
    },
    {
      path: '/users/edit',
      component: () => import('../views/users/UsersDetailsView.vue'),
      name: 'EditUser',
      meta: {
        RequiresAuth: true,
        HeaderTitle: 'تعديل المستخدم',
        Operation: 'EDIT',
      },
    },
    {
      path: '/deeratna_app_users',
      component: () => import('../views/users/deeratnaAppUsers.vue'),
      name: 'deeratna_app_users',
      meta: { RequiresAuth: true, HeaderTitle: 'ادارة مستخدمي ديرتنا' },
    },
    //#endregion

    //#region QR
    {
      path: '/qr-data',
      component: () => import('../views/qr/qrLog.vue'),
      name: 'qr-data',
      meta: { RequiresAuth: true, HeaderTitle: 'بيانات الـ QR' },
    },
    {
      path: '/qr-notification',
      component: () => import('../views/qr/qrNotification.vue'),
      name: 'qr-security',
      meta: { RequiresAuth: true, HeaderTitle: 'الاشعارات' },
    },
    {
      path: '/qr-customers',
      component: () => import('../views/qr/qrCustomers.vue'),
      name: 'qr-management',
      meta: { RequiresAuth: true, HeaderTitle: 'بيانات المشتركين' },
    },
    {
      path: '/send-qr-notification',
      component: () => import('../views/qr/qrNotificationSend.vue'),
      name: 'send-qr-notification',
      meta: { RequiresAuth: true, HeaderTitle: 'ارسال اشعار كيو ار' },
    },
    {
      path: '/send-qr-notification',
      component: () => import('../views/qr/qrNotificationSend.vue'),
      name: 'send-qr-notification',
      meta: { RequiresAuth: true, HeaderTitle: 'ارسال اشعار كيو ار' },
    },
    //#endregion

    //#region Logs
    {
      path: '/logs/auto_updates',
      component: () => import('../views/logs/AutoUpdatesView.vue'),
      name: 'AutoUpdatesLog',
      meta: { RequiresAuth: true, HeaderTitle: 'سجل التحديث التلقائي' },
    },
    {
      path: '/logs/persons',
      component: () => import('../views/logs/PersonsView.vue'),
      name: 'PersonsLog',
      meta: { RequiresAuth: true, HeaderTitle: 'سجل معلومات الاشخاص' },
    },
    //#endregion

    //#region local_management
    {
      path: '/localmanagement/maintenance_list',
      component: () => import('../views/LocalManagement/maintenanceList.vue'),
      name: 'maintenanceList',
      meta: { RequiresAuth: true, HeaderTitle: 'قائمة الصيانات' },
    },
    //#endregion
  ],
})

router.beforeEach((to, from, next) => {
  const GlobalsStore = useGlobalsStore();

  if (to.meta.RequiresAuth && !GlobalsStore.IsAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router

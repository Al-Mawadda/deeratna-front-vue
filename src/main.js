import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { HideModal } from '@/MJS.js';

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth';
const app = createApp(App)

app.use(createPinia())

app.use(router)

app.directive('ModalCloseBTN', {
    mounted(Element) {
        Element.addEventListener('click', function () {
            HideModal(Element.closest('.ModalContainer'));
        });
    },
});

const authStore = useAuthStore();
if (authStore.token) {
  authStore.getUser().catch(() => {
    authStore.logout();
  });
}

app.mount('#app')

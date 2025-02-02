import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { HideModal } from '@/MJS.js'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useGlobalsStore } from './stores/Globals.js'
import { api } from './axios'

// Importing The Tools
import MTable from './components/MTable.vue'
import MPrompts from './components/MPrompts.vue'
import MDate from './components/MDate.vue'
import MModal from './components/MModal.vue'
import MComboBox from './components/MComboBox.vue'
import MRadioButton from './components/MRadioButton.vue'
import MCheckBox from './components/MCheckBox.vue'

const app = createApp(App)

// Adding The Tools
app.component('MDate', MDate)
app.component('MComboBox', MComboBox)
app.component('MCheckBox', MCheckBox)
app.component('MRadioButton', MRadioButton)
app.component('MModal', MModal)
app.component('MTable', MTable)
app.component('MPrompts', MPrompts)

app.use(createPinia())

app.use(router)

app.directive('ModalCloseBTN', {
  mounted(Element) {
    Element.addEventListener('click', function () {
      HideModal(Element.closest('.ModalContainer'))
    })
  },
})

app.directive('OnlyNumbers', {
  mounted(Element) {
    Element.querySelectorAll('input').forEach(function (e) {
      e.addEventListener('keypress', function (event) {
        if (!/[0-9\.]/.test(event.key)) {
          event.preventDefault()
        } else {
          if (event.key === '.' && event.target.value.length === 0) {
            event.preventDefault()
          }
          if (event.key === '.' && event.target.value.includes('.')) {
            event.preventDefault()
          }
        }
      })
      e.addEventListener('paste', function (event) {
        event.preventDefault()
      })
      e.addEventListener('drop', function (event) {
        event.preventDefault()
      })
    })
  },
})

const authStore = useAuthStore()
if (authStore.token) {
  authStore.getUser().catch(() => {
    authStore.logout()
  })
}

const GlobalsStore = useGlobalsStore()

async function initializeApp() {
  try {
    const response = await api.get('/GetComboBoxes')
    GlobalsStore.SetComboBoxes(response.data)
  } catch (error) {
    console.error(error)
  } finally {
    app.mount('#app')
  }
}

initializeApp()

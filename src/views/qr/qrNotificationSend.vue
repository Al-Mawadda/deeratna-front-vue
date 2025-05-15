<template>
  <div class="ComponentWrapper">
    <div class="MField" id="Msg">
      <input type="text" required />
      <label>ادحل الرسالة</label>
      <div class="MFieldBG"></div>
    </div>
    <div class="ModalButtons">
      <div class="MButton" id="SendNotificationBTN" @click="SendNotification">
        حفــظ وارسال
      </div>
    </div>
  </div>
</template>

<!-- ======================================== -->
<script>
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)

    return {
      hasPermission,
    }
  },
  mounted() {},
  methods: {
    SendNotification() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append(
        'msg',
        document.getElementById('Msg').querySelector('input').value
      )
      api
        .post('qr-notification-all', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data.success) {
            ShowMessage('تمت عملية الارسال بنجاح')
          } else {
            HideLoading()
            ShowMessage(response.data.message)
          }
        })
        .catch(error => {
          HideLoading()
          if (error.response && error.response.status === 422) {
            const firstError = Object.values(error.response.data.errors)[0][0]
            ShowMessage(firstError)
          } else ShowMessage('حدث خطأ غير متوقع')
        })
    },
  },
}
</script>

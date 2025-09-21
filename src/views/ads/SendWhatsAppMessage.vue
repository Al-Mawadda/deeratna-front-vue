<template>
  <div class="ComponentWrapper">
    <MComboBox ref="Compounds" :MultipleSelections="true" :Name="'Compounds'" :Label="'المدينة'" :Items="CompoundsItems"></MComboBox>
    <div class="MField" id="Msg">
      <input type="text" required />
      <label>ادحل الرسالة</label>
      <div class="MFieldBG"></div>
    </div>
    <div class="ModalButtons">
      <div class="MButton" id="SendNotificationBTN" @click="SendNotification">حفــظ وارسال</div>
    </div>
  </div>
</template>

<!-- ======================================== -->
<script>
import { api } from '../../axios'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'
import { ref} from 'vue'
import { useGlobalsStore } from '../../stores/Globals.js'

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())

    return {
      GlobalsStore,
      Compounds: ref(null),
      CompoundsItems: ref([]),
    }
  },
  mounted() {
    this.CompoundsItems = this.GlobalsStore.ComboBoxes['Compounds']
  },
  methods: {
    SendNotification() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('msg', document.getElementById('Msg').querySelector('input').value)
      Parameters.append('compounds', JSON.stringify(this.Compounds.Get('MCBIName')))

      api
        .post('sendWhatsAppMessageForCompounds', Parameters, {
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

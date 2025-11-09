<template>
  <div class="ComponentWrapper">
    <MModal ref="MaintenanceRequestModal" :Name="'MaintenanceRequestModal'" :Title="'اضافة'">
      <MComboBox ref="SendingType" :Name="'SendingType'" :Label="'نوع الارسال *'" :Items="SendingTypeItems"></MComboBox>
      <MComboBox ref="CompoundsModel" :Name="'CompoundsModel'" :Label="' اسم المدينة *'" :Items="CompoundsModelItems"></MComboBox>
      <div class="MField" id="template_id">
        <input ref="template_id" type="text" required />
        <label>معرف الرسالة *</label>
        <div class="MFieldBG"></div>
      </div>

      <div class="ModalButtons">
        <div class="MButton" id="SendNotificationTwilioBTN" @click="SendNotificationTwilio">حفـــظ</div>
      </div>
    </MModal>

    <MComboBox ref="Compounds" :MultipleSelections="true" :Name="'Compounds'" :Label="'المدينة'" :Items="CompoundsItems"></MComboBox>
    <div class="MField" id="Msg">
      <input type="text" required />
      <label>ادحل الرسالة</label>
      <div class="MFieldBG"></div>
    </div>
    <div class="ModalButtons">
      <div class="MButton" id="SendNotificationBTN" @click="SendNotification">حفــظ وارسال</div>
    </div>

    <MTable ref="MaintenanceRequestsTB" :Name="'MaintenanceRequestsTB'" :DataArray="MaintenanceRequestsTBData" :Columns="MaintenanceRequestsTBColumns" :Sums="MaintenanceRequestsTBSums" :GetDataFunction="GetMaintenanceRequestsData" :RowsCount="MaintenanceRequestsTBRowsCount" :RowsPerPage="10">
      <template v-slot:options>
        <!-- View Videosdffhroif Option -->
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path
                d="M500.2,249.6c124.1,1.1,233.2,42.7,328.2,122.1c39.6,33,72.3,72.7,106.8,110.6c9,9.9,8.7,25.5-0.8,36.4
  c-53.9,62.1-109.3,122.5-182.1,163.7c-66,37.4-136.2,60.8-212,66.4C399.6,759.2,276.4,716.6,169,626.3
  C130.9,594.3,99.2,556,66,519.3c-10-11-10.5-26-0.9-37.1c53.3-61.5,107.9-121.4,179.6-162.7c66.8-38.5,138-62.1,215.1-68.3
  C473.2,250.2,486.7,250.1,500.2,249.6z M504.7,308.1c-19.4,0.8-34.9,0.7-50.4,2.2c-61.5,6.1-119,24.8-173,54.6
  c-59.2,32.7-106.2,79.4-150.3,129.6c-4.1,4.7-3.1,8.1,0.7,12.1c21.3,22.2,40.9,45.9,63.9,66.5c86.2,77.3,186.4,118.2,302.7,118.9
  c68.3,0.4,133-14.2,194.7-43.2c70.8-33.3,126.2-85.4,176.6-143.7c4-4.6,2-7.9-1.3-11.3c-21.3-22.2-40.9-45.9-63.8-66.6
  C718.1,349.4,617.3,308.9,504.7,308.1z"
              />
              <path
                d="M392.3,499.7c0.2-59,49.3-108.3,108.1-107.4c60.6,0.9,107.4,47.4,107.2,108c-0.2,60.9-47.5,106.9-107.8,107.4
  C440.8,608.1,392.1,558.6,392.3,499.7z M500.2,556.5c30.5,0,56.4-25.9,56.4-56.4c0-30.6-25.7-56.5-56.2-56.6
  c-31-0.1-56.9,25.8-56.8,56.8C443.8,530.8,469.7,556.6,500.2,556.5z"
              />
            </svg>
          </div>
          <div class="MTableOptionName">عرض</div>
        </div>
      </template>
    </MTable>
  </div>
</template>


<!-- ======================================== -->
<script>
import { api } from '../../axios'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'
import { ref } from 'vue'
import { useGlobalsStore } from '../../stores/Globals.js'

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())

    return {
      GlobalsStore,
      Compounds: ref(null),
      CompoundsItems: ref([]),
      CompoundsModel: ref(null),
      CompoundsModelItems: ref([]),
      SendingType: ref(null),
      SendingTypeItems: ref([]),
      MaintenanceRequestsTB: ref(null),
      MaintenanceRequestsTBData: ref([]),
      MaintenanceRequestModal: ref(null),

      MaintenanceRequestsTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'template_id',
          label: 'الرقم',
        },
        {
          name: 'content',
          label: 'محتوى الرسالة',
        },
        {
          name: 'has_variable',
          label: 'المتغيرات',
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
      ],
      MaintenanceRequestsTBSums: ref([]),
      MaintenanceRequestsTBRowsCount: ref(0),
      MaintenanceRequestsFromDate: ref(null),

      selectedRowData: ref([]),
    }
  },
  mounted() {
    this.CompoundsItems = this.GlobalsStore.ComboBoxes['Compounds']
    this.CompoundsModelItems = this.GlobalsStore.ComboBoxes['Compounds']
    this.SendingTypeItems = this.GlobalsStore.ComboBoxes['SendingType']

    this.MaintenanceRequestsTB.LoadMTable()

    // View Requist
    document.getElementById('MaintenanceRequestsTB').addEventListener(
      'ViewItem',
      function (data) {
        this.selectedRowData = this.selectedRowData = data.detail.RowData
        document.getElementById('template_id').querySelector('input').value = this.selectedRowData.template_id

        // this.ChangeBox.Set(false)
        // this.isVisable = true
        // document.getElementById('note').querySelector('input').value = ''
        // document.getElementById('note').querySelector('input').value = this.selectedRowData.note
        // document.getElementById('Price').querySelector('input').value = this.selectedRowData.price
        // document.getElementById('PriceSpent').querySelector('input').value = this.selectedRowData.price_spent

        //this.MaintenanceType.Set(this.selectedRowData.type_description)
        //this.MaintenanceRequestTimeTBData = this.selectedRowData.maintenance_time

        this.MaintenanceRequestModal.Show()
      }.bind(this)
    )
  },
  methods: {
    GetMaintenanceRequestsData(MTable) {
      api
        .get('getTwilioWhatsApp', {
          params: {
            MTable: MTable,
            // InternetRequestFrom: this.InternetRequestsFromDate.Get()[0],
            // InternetRequestTo: this.InternetRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.MaintenanceRequestsTBRowsCount = response.data.total
          this.MaintenanceRequestsTBData = response.data.data
          this.MaintenanceRequestsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },

    SendNotification() {
      if (document.getElementById('Compounds').querySelector('input').value == '') {
        ShowMessage('اسم المدينة غير موجود')
        return
      }

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
    SendNotificationTwilio() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('SendingType', document.getElementById('SendingType').querySelector('input').value)
      Parameters.append('compounds', JSON.stringify(this.CompoundsModel.Get('MCBIName')))
      Parameters.append('template_id', document.getElementById('template_id').querySelector('input').value)

      api
        .post('twilio-whatsApp', Parameters, {
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

<template>
  <div class="ComponentWrapper">
    <!-- ========= MaintenanceRequest Model======== -->

    <MModal ref="QrRequestModal" :Name="'QrRequestModal'" :Title="' طلب ' + selectedRowData.request_type + ' ' + selectedRowData.name">
      <!-- ============= details Table =============== -->

      <table cellpadding="0" cellspacing="0" class="RequestsMTable">
        <thead>
          <tr>
            <th>الحقل</th>
            <th>القيمة</th>
          </tr>
        </thead>
        <tbody>
          <!-- Shared Columns (Always Visible) -->
          <tr>
            <td>الاسم</td>
            <td>{{ selectedRowData.name }}</td>
          </tr>
          <tr>
            <td>المدينة</td>
            <td>{{ selectedRowData.compound }}</td>
          </tr>

          <tr>
            <td>العنوان</td>
            <td>{{ selectedRowData.address }}</td>
          </tr>
          <tr>
            <td>الهاتف</td>
            <td>{{ selectedRowData.phone }}</td>
          </tr>
          <tr>
            <td>حالة الطلب</td>
            <td>{{ selectedRowData.request_status }}</td>
          </tr>

          <!-- Rejection Reason -->
          <tr v-if="selectedRowData.rejection_reason != ''">
            <td>سبب الرفض</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
          </tr>
        </tbody>
      </table>

      <MTable ref="QrRequestTimeTB" :Name="'QrRequestTimeTB'" :DataArray="QrRequestTimeTBData" :Columns="QrRequestTimeTBColumns" :Sums="QrRequestTimeTBSums" :GetDataFunction="GetMaintenanceRequestTimeData" :RowsCount="QrRequestTimeTBRowsCount" :RowsPerPage="101" :ShowFilterRow="false"></MTable>

      <MDate
        v-show="(selectedRowData.request_type == 'اضافة' && (selectedRowData.request_status == 'تم الدفع' || selectedRowData.request_status == 'تم')) || selectedRowData.request_type == 'تمديد'"
        :Disabled="!(((selectedRowData.request_status == 'تم الدفع' && selectedRowData.request_type == 'اضافة') || (selectedRowData.request_status == 'قيد المراجعة' && selectedRowData.request_type == 'تمديد')) && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
        ref="QrExpire"
        :Name="'QrExpire'"
        :Label="'تاريخ الانتهاء'"
      ></MDate>

      <div class="MGroup ModalMGroup" id="GatesMGroup" v-show="selectedRowData.request_type == 'اضافة' && (selectedRowData.department_id == 3 || UserData.department_id == 1)">
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'Amal1-1Box'" :Label="'الامل 1-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'Amal1-2Box'" :Label="'الامل 1-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'Amal2-1Box'" :Label="'الامل 2-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'Amal2-2Box'" :Label="'الامل 2-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'Amaal-1Box'" :Label="'الامال-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'Amaal-2Box'" :Label="'الامال-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'jawhara-1Box'" :Label="'جوهرة البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'jawhara-2Box'" :Label="'جوهرة البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'eye-1Box'" :Label="'عين البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'eye-2Box'" :Label="'عين البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'dura-1Box'" :Label="'درة البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'dura-2Box'" :Label="'درة البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'shruq-1Box'" :Label="'الشروق-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'shruq-2Box'" :Label="'الشروق-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'rafah-1Box'" :Label="'الرفاه-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'rafah-2Box'" :Label="'الرفاه-البوابة 2'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'nasim-1Box'" :Label="'النسيم-البوابة 1'"></MCheckBox>
        <MCheckBox :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))" :Name="'nasim-2Box'" :Label="'النسيم-البوابة 2'"></MCheckBox>
      </div>

      <!-- ========= Btn ===============-->
      <div class="ModalButtons">
        <div v-show="(selectedRowData.request_status == 'قيد المراجعة' || selectedRowData.request_status == 'تم الدفع') && (UserData.department_id == selectedRowData.department_id || UserData.department_id == 1)" class="MButton" id="AcceptBTN" @click="AcceptRequest">قبول</div>
        <div v-show="selectedRowData.request_status == 'قيد المراجعة'" class="MButton" id="RejectBTN" @click="RejectRequest">رفض</div>
      </div>
    </MModal>

    <!-- ========= Reject Model======== -->

    <MModal ref="QrRequestRejectModal" :Name="'QrRequestRejectModal'" :Title="'رفض الطلب'">
      <div class="MField" id="RejectionReason">
        <input type="text" required />
        <label>سبب الرفض</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SaveRejectRequest">حفظ</div>
      </div>
    </MModal>

    <div class="MButton" id="GetQrRequestsBTN">عرض كافة البيانات</div>

    <div class="MGroup">
      <MDate ref="QrRequestsFromDate" :Name="'QrRequestsFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true"></MDate>
    </div>

    <MTable ref="QrRequestsTB" :Name="'QrRequestsTB'" :DataArray="QrRequestsTBData" :Columns="QrRequestsTBColumns" :Sums="QrRequestsTBSums" :GetDataFunction="GetQrRequestsData" :RowsCount="QrRequestsTBRowsCount" :RowsPerPage="10">
      <template v-slot:options>
        <!-- View Option -->
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
import { ref } from 'vue'
import { api, GetServerPath } from '../../axios'
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())
    const UserData = ref(useGlobalsStore().User)

    return {
      GlobalsStore: ref(useGlobalsStore()),
      UserData,

      IDImage: ref(''),
      QrRequestModal: ref(null),
      QrRequestRejectModal: ref(null),
      QrRequestsTB: ref(null),
      QrRequestsTBData: ref([]),
      QrExpire: ref(null),

      QrRequestsTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'pid',
          label: 'الرقم',
        },
        {
          name: 'compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: UserData.value?.department_id == 1 ? GlobalsStore.value.ComboBoxes?.Compounds ?? [] : UserData.value?.compounds ?? [],
        },
        {
          name: 'name',
          label: 'الاسم',
        },
        {
          name: 'attributes',
          label: 'الصفة',
        },
        {
          name: 'address',
          label: 'العنوان',
        },
        {
          name: 'phone',
          label: 'رقم الهاتف',
        },
        {
          name: 'request_status',
          label: 'حالة الطلب',
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
      ],
      QrRequestsTBSums: ref([]),
      QrRequestsTBRowsCount: ref(0),
      QrRequestsFromDate: ref(null),

      QrRequestTimeTB: ref(null),
      QrRequestTimeTBData: ref([]),
      QrRequestTimeTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'qr_request_id',
          label: 'رقم الطلب',
        },
        {
          name: 'day',
          label: 'اليوم',
        },
        {
          name: 'time_from',
          label: 'الوقت من',
        },
        {
          name: 'time_to',
          label: 'الوقت الى',
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
      ],
      QrRequestTimeTBSums: ref([]),
      QrRequestTimeTBRowsCount: ref(0),

      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.QrRequestsTB.LoadMTable()

    // عرض كافة البيانات
    document.getElementById('GetQrRequestsBTN').addEventListener(
      'click',
      function () {
        ShowLoading()
        this.QrRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )

    // View Request
    document.getElementById('QrRequestsTB').addEventListener(
      'ViewItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.QrRequestTimeTBData = this.selectedRowData.qr_time
        this.QrExpire.Clear()

        const { request_type, request_status } = this.selectedRowData

        // منطق تاريخ الانتهاء
        if (request_type === 'اضافة' && request_status === 'قيد المراجعة') {
          // إضافة جديدة قيد المراجعة → سنة من اليوم
          const now = new Date()
          const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
          this.QrExpire.Set(nextYear.toISOString().split('T')[0])
        } else if (request_type === 'تمديد' && request_status === 'قيد المراجعة') {
          // تمديد قيد المراجعة → سنة بعد تاريخ الانتهاء القديم
          const baseDate = this.selectedRowData.old_card_expire || this.selectedRowData.card_expire
          const oldDate = new Date(baseDate)
          const nextYear = new Date(oldDate.getFullYear() + 1, oldDate.getMonth(), oldDate.getDate())
          this.QrExpire.Set(nextYear.toISOString().split('T')[0])
        } else {
          // باقي الحالات → استخدم card_expire كما هو
          this.QrExpire.Set(this.selectedRowData.card_expire)
        }

        // تصفير كل الـ CheckBoxes قبل التفعيل
        document.querySelectorAll('.MCheckBox input').forEach(input => {
          input.checked = false
        })

        // تفعيل البوابات الحالية من الحقول
        if (this.selectedRowData.gates) {
          this.selectedRowData.gates.split('|').forEach(function (e) {
            document.querySelectorAll('.MCheckBox').forEach(function (d) {
              const textEl = d.querySelector('.MCheckBoxText')
              if (textEl && e === textEl.innerHTML) {
                const inp = d.querySelector('input')
                if (inp) inp.checked = true
              }
            })
          })
        }

        this.QrRequestModal.Show()
      }.bind(this)
    )

    // RejectBTN (في حال احتجته يدويًا)
    document.getElementById('RejectBTN')?.addEventListener(
      'click',
      function () {
        this.QrRequestRejectModal.Show()
      }.bind(this)
    )
  },
  methods: {
    GetQrRequestsData(MTable) {
      api
        .get('GetQrRequestsData', {
          params: {
            MTable,
            MaintenanceRequestFrom: this.QrRequestsFromDate.Get()[0],
            MaintenanceRequestTo: this.QrRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.QrRequestsTBRowsCount = response.data.total
          this.QrRequestsTBData = response.data.data
          this.QrRequestsTBSums = response.data.sums
        })
        .catch(error => ShowMessage(error))
    },

    // ====================== قبول الطلب ======================
    AcceptRequest() {
      ShowLoading()
      const Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('QrExpire', this.QrExpire.Get())

      api
        .post('AcceptMaintenanceConstantRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            this.QrRequestsTB.LoadMTable()
            this.QrRequestModal.Hide()
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

    RejectRequest() {
      this.QrRequestRejectModal.Show()
    },

    // ====================== حفظ الرفض ======================
    SaveRejectRequest() {
      ShowLoading()

      const Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('Reason', document.getElementById('RejectionReason').querySelector('input').value)

      api
        .post('RejectMaintenanceRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.QrRequestModal.Hide()
            this.QrRequestRejectModal.Hide()
            this.QrRequestsTB.LoadMTable()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },
  },
}
</script>

<style scoped>
#QrRequestsFromDate {
  max-width: 400px;
}
#RejectBTN {
  background-color: red;
}
#RejectBTN:hover {
  color: red;
  background-color: var(--MButtonBG);
}
</style>

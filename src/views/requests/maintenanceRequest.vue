<template>
  <div class="ComponentWrapper">
    <!-- ========= MaintenanceRequest Model======== -->

    <MModal
      ref="MaintenanceRequestModal"
      :Name="'MaintenanceRequestModal'"
      :Title="
        ' طلب ' + selectedRowData.request_type + ' ' + selectedRowData.name
      "
    >
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
            <td>السعر</td>
            <td>{{ selectedRowData.price }}</td>
          </tr>
          <tr>
            <td>تفاصيل الطلب</td>
            <td>{{ selectedRowData.maintenance_detail }}</td>
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
      <MTable
        ref="MaintenanceRequestTimeTB"
        :Name="'MaintenanceRequestTimeTB'"
        :DataArray="MaintenanceRequestTimeTBData"
        :Columns="MaintenanceRequestTimeTBColumns"
        :Sums="MaintenanceRequestTimeTBSums"
        :GetDataFunction="GetMaintenanceRequestTimeData"
        :RowsCount="MaintenanceRequestTimeTBRowsCount"
        :RowsPerPage="101"
        :ShowFilterRow="false"
      >
      </MTable>
      <div class="MField" id="note">
        <input type="text" required />
        <label>تمت الموافقة على طلب الصيانة ليوم</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Price" v-OnlyNumbers>
        <input
          :disabled="
            selectedRowData.request_status == 'تم الدفع' ||
            selectedRowData.request_status == 'تم'
          "
          type="text"
        />
        <label>السعر</label>
        <div class="MFieldBG"></div>
      </div>

      <div class="ModalButtons">
        <div
          v-show="selectedRowData.request_status == 'قيد المراجعة'"
          class="MButton"
          id="AcceptBTN"
          @click="AcceptRequest()"
        >
          موافق
        </div>
        <div
          v-show="selectedRowData.request_status == 'قيد المراجعة'"
          class="MButton"
          id="RejectBTN"
          @click="RejectRequest"
        >
          رفض
        </div>
        <div
          v-show="
            selectedRowData.request_status != 'مرفوض' ||
            selectedRowData.request_status != 'تم'
          "
          class="MButton"
          id="CloseRequestBTN"
          @click="CloseRequest()"
        >
          تحديث وغلق الطلب
        </div>
      </div>
    </MModal>

    <!-- ========= Reject Model======== -->

    <MModal
      ref="MaintenanceRequestRejectModal"
      :Name="'MaintenanceRequestRejectModal'"
      :Title="'رفض الطلب'"
    >
      <div class="MField" id="RejectionReason">
        <input type="text" required />
        <label>سبب الرفض</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SaveRejectRequest">حفظ</div>
      </div>
    </MModal>

    <div class="MButton" id="GetMaintenanceRequestsBTN">عرض البيانات</div>
    <div class="MGroup">
      <MDate
        ref="MaintenanceRequestsFromDate"
        :Name="'MaintenanceRequestsFromDate'"
        :Label="'التاريخ'"
        :Range="true"
        :Clearable="true"
      ></MDate>
    </div>
    <MTable
      ref="MaintenanceRequestsTB"
      :Name="'MaintenanceRequestsTB'"
      :DataArray="MaintenanceRequestsTBData"
      :Columns="MaintenanceRequestsTBColumns"
      :Sums="MaintenanceRequestsTBSums"
      :GetDataFunction="GetMaintenanceRequestsData"
      :RowsCount="MaintenanceRequestsTBRowsCount"
      :RowsPerPage="10"
    >
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
import { ref } from 'vue'
import { api, GetServerPath } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)
    const GlobalsStore = ref(useGlobalsStore())

    return {
      hasPermission,
      IDImage: ref(''),
      MaintenanceRequestModal: ref(null),
      MaintenanceRequestRejectModal: ref(null),
      MaintenanceRequestsTB: ref(null),
      MaintenanceRequestsTBData: ref([]),
      MaintenanceRequestsTBColumns: [
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
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
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
          name: 'maintenance_detail',
          label: 'تفاصيل الطلب',
        },
        {
          name: 'price',
          label: 'المبلغ',
          sum: true,
          type: 'currency',
        },
        {
          name: 'request_status',
          label: 'حالة الطلب',
        },
        {
          name: 'note',
          label: 'الملاحظات',
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

      MaintenanceRequestTimeTB: ref(null),
      MaintenanceRequestTimeTBData: ref([]),
      MaintenanceRequestTimeTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'maintenance_request_id',
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
      MaintenanceRequestTimeTBSums: ref([]),
      MaintenanceRequestTimeTBRowsCount: ref(0),
      MaintenanceRequestTimeFromDate: ref(null),

      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.MaintenanceRequestsTB.LoadMTable()
    // display Data between two date
    document.getElementById('GetMaintenanceRequestsBTN').addEventListener(
      'click',
      function () {
        ShowLoading()
        this.MaintenanceRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )
    // View Requist
    document.getElementById('MaintenanceRequestsTB').addEventListener(
      'ViewItem',
      function (data) {
        this.selectedRowData = this.selectedRowData = data.detail.RowData

        //if (this.selectedRowData.request_type != 'تجديد') {}

        document.getElementById('note').querySelector('input').value = ''
        document.getElementById('note').querySelector('input').value =
          this.selectedRowData.note
        document.getElementById('Price').querySelector('input').value =
          this.selectedRowData.price
        this.MaintenanceRequestTimeTBData =
          this.selectedRowData.maintenance_time

        this.MaintenanceRequestModal.Show()
      }.bind(this)
    )
    // RejectBTN
    document.getElementById('RejectBTN').addEventListener(
      'click',
      function () {
        this.MaintenanceRequestRejectModal.Show()
      }.bind(this)
    )
  },
  methods: {
    GetMaintenanceRequestsData(MTable) {
      api
        .get('MaintenanceRequests', {
          params: {
            MTable: MTable,
            MaintenanceRequestFrom: this.MaintenanceRequestsFromDate.Get()[0],
            MaintenanceRequestTo: this.MaintenanceRequestsFromDate.Get()[1],
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
    AcceptRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('name', this.selectedRowData.name)
      Parameters.append('request_type', this.selectedRowData.request_type)
      Parameters.append('request_status', 'دفع الكتروني')
      Parameters.append(
        'maintenance_detail',
        this.selectedRowData.maintenance_detail
      )
      Parameters.append(
        'note',
        document.getElementById('note').querySelector('input').value
      )
      Parameters.append(
        'price',
        document.getElementById('Price').querySelector('input').value
      )

      api
        .put(`MaintenanceRequests/` + this.selectedRowData.id, Parameters)
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            this.MaintenanceRequestsTB.LoadMTable()
            this.MaintenanceRequestModal.Hide()
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
    CloseRequest() {
      if (this.selectedRowData.request_status != 'تم الدفع') {
        ShowMessage('لا يمكن غلق الطلب الا بعد اجراء عملية الدفع')
        return
      }
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('name', this.selectedRowData.name)
      Parameters.append('request_status', 'تم')
      Parameters.append(
        'note',
        document.getElementById('note').querySelector('input').value
      )
      api
        .put(`CloseMaintenanceRequests/` + this.selectedRowData.id, Parameters)
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            this.MaintenanceRequestsTB.LoadMTable()
            this.MaintenanceRequestModal.Hide()
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
    SaveRejectRequest() {
      ShowLoading()

      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append(
        'Reason',
        document.getElementById('RejectionReason').querySelector('input').value
      )

      api
        .post('RejectMaintenanceRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.MaintenanceRequestModal.Hide()
            this.MaintenanceRequestRejectModal.Hide()
            this.MaintenanceRequestsTB.LoadMTable()
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
#MaintenanceRequestsFromDate {
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

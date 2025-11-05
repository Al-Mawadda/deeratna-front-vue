<template>
  <div class="ComponentWrapper">
    <!-- ========= MaintenanceRequest Model======== -->

    <MModal ref="MaintenanceRequestModal" :Name="'MaintenanceRequestModal'" :Title="' طلب ' + selectedRowData.request_type + ' ' + selectedRowData.name">
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
      <MTable ref="MaintenanceRequestTimeTB" :Name="'MaintenanceRequestTimeTB'" :DataArray="MaintenanceRequestTimeTBData" :Columns="MaintenanceRequestTimeTBColumns" :Sums="MaintenanceRequestTimeTBSums" :GetDataFunction="GetMaintenanceRequestTimeData" :RowsCount="MaintenanceRequestTimeTBRowsCount" :RowsPerPage="101" :ShowFilterRow="false"></MTable>

      <div style="width: 100%; display: flex; flex-wrap: wrap">
        <div class="MField" id="note">
          <input type="text" required />
          <label>تمت الموافقة على طلب الصيانة ليوم</label>
          <div class="MFieldBG"></div>
        </div>
        <div class="MField" id="Price" v-OnlyNumbers>
          <input :disabled="selectedRowData.request_status == 'تم الدفع' || selectedRowData.request_status == 'تم'" type="text" />
          <label>السعر</label>
          <div class="MFieldBG"></div>
        </div>
        <div v-show="selectedRowData.type_description == 'تغييرات' && selectedRowData.request_status == 'تم الدفع' && selectedRowData.completion_status != 'تم الانجاز'" class="MField" id="PriceSpent" v-OnlyNumbers>
          <input type="text" />
          <label>المبلغ المصروف</label>
          <div class="MFieldBG"></div>
        </div>
      </div>
      <div style="width: 100%; display: flex; justify-content: flex-start">
        <MCheckBox ref="ChangeBox" v-show="selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'قيد المراجعة'" @OnChange="IsChanges" :Name="'ChangeBox'" :Label="'تغييرات'"></MCheckBox>
      </div>

      <!-- ========= Btn ===============-->
      <div class="ModalButtons">
        <!-- ============= الثابته ==============-->
        <div v-show="selectedRowData.type_description == 'ثابتة' && selectedRowData.request_status == 'قيد المراجعة'" class="MButton" id="AcceptConstantBTN" @click="AcceptConstantRequest()">موافق (ثابته)</div>
        <div v-show="selectedRowData.type_description == 'ثابتة' && selectedRowData.request_status == 'تم الدفع' && selectedRowData.completion_status != 'تم الانجاز'" class="MButton" id="CloseConstantRequestBTN" @click="CloseConstantRequest()">تحديث وغلق الطلب (ثابتة)</div>

        <!-- ============== اخــرى ============= -->
        <!-- موافق تحويل الى كشف -->
        <div v-show="isVisable && selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'قيد المراجعة' && selectedRowData.type_description != 'ثابتة'" class="MButton" id="AcceptToDetectionBTN" @click="AcceptToDetectionRequest()">موافق (تحويل الى كشف)</div>

        <!-- موافق تحديد يوم العمل (تم دفع المبلغ كاش) -->
        <div v-show="isVisable && selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'تم الدفع' && selectedRowData.completion_status == 'غير منجز' && selectedRowData.type_description != 'ثابتة'" class="MButton" id="AcceptMaintenanceDateSpecifiedBTN" @click="AcceptMaintenanceDateSpecifiedRequest()">موافق (تحديد يوم العمل)</div>

        <!-- موافق تحويل الى دفع الكتروني -->
        <div v-show="isVisable && selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'قيد المراجعة' && selectedRowData.type_description != 'ثابتة'" class="MButton" id="AcceptToPayBTN" @click="AcceptToPayRequest()">موافق (تحويل الى دفع الكتروني)</div>

        <!-- >تحويل من كشف الى تم الانجاز ودفع الكتروني-->
        <!-- <div v-show="selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'قيد الكشف'" class="MButton" id="ConvertFromDetectionToAnjazAndPaymentRequestBTN" @click="ConvertFromDetectionToAnjazAndPaymentRequest()">تحويل من كشف الى تم الانجاز ودفع الكتروني</div> -->
        <!-- >تحويل من كشف الى دفع الكتروني-->
        <div v-show="selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'قيد الكشف'" class="MButton" id="ConvertFromDetectionToPaymentRequestBTN" @click="ConvertFromDetectionToPaymentRequest()">تحويل من كشف الى دفع الكتروني</div>

        <div v-show="selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'دفع الكتروني' && selectedRowData.completion_status == 'تم الانجاز'" class="MButton" id="CloseOtherRequestBTN" @click="CloseOtherRequest()">استلام المبلغ كاش وغلق الطلب</div>
        <!-- اعادة قيد المراجعة -->
        <div v-show="selectedRowData.type_description == 'اخرى' && (selectedRowData.request_status == 'قيد الكشف' || (selectedRowData.request_status == 'دفع الكتروني' && selectedRowData.completion_status == 'تم الانجاز'))" class="MButton" id="ReturnToUnderReviewBTN" @click="ReturnToUnderReview()">
          {{ selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'دفع الكتروني' && selectedRowData.completion_status == 'تم الانجاز' ? 'تحديث السعر' : 'اعادة الى قيد المراجعة' }}
        </div>
        <!-- غلق الطلب  -->
        <div v-show="selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'تم الدفع' && selectedRowData.completion_status != 'تم الانجاز' && (selectedRowData.pay_type == 'الكتروني' || selectedRowData.pay_type == 'كاش')" class="MButton" id="ConvertToAnjazAndCloseRequestBTN" @click="ConvertToAnjazAndCloseRequest()">تحويل الى انجاز وغلق الطلب</div>

        <!-- ================ التغييرات ==========-->
        <!-- موافق تحويل الى تغييرات واستلام كاش -->
        <div v-show="isVisable == false && selectedRowData.type_description == 'اخرى' && selectedRowData.request_status == 'قيد المراجعة' && selectedRowData.type_description != 'ثابتة'" class="MButton" id="AcceptAndConvertToChangesBTN" @click="AcceptAndConvertToChangesRequest()">موافق (تحويل الى تغييرات)</div>
        <div v-show="selectedRowData.type_description == 'تغييرات' && selectedRowData.request_status == 'قيد المراجعة' && selectedRowData.type_description != 'ثابتة'" class="MButton" id="ReceiveTheAmountRequestBTN" @click="ReceiveTheAmountRequest()">استلام المبلغ كاش</div>
        <div v-show="selectedRowData.type_description == 'تغييرات' && selectedRowData.request_status == 'تم الدفع' && selectedRowData.completion_status == 'غير منجز' && selectedRowData.type_description != 'ثابتة'" class="MButton" id="InputPayChangeAndCloseBTN" @click="InputPayChangeAndCloseRequest()">ادخال المصروف وغلق الطلب</div>
        <!-- <div v-show="selectedRowData.request_status != 'قيد المراجعة'" class="MButton" id="PrintReceiptBTN" @click="PrintReceipt()">طباعة وصل قبض</div> -->

        <!-- ================== -->

        <!--  رفـــض  -->
        <div v-show="isVisable && selectedRowData.request_status == 'قيد المراجعة'" class="MButton" id="RejectBTN" @click="RejectRequest">رفض</div>
        <!--  ارسال اشعار  -->
        <div v-show="selectedRowData.request_status != 'تم الدفع'" class="MButton" id="SendNotificationBTN" @click="SendNotificationRequest">ارسال اشعار الى الساكن</div>
      </div>
    </MModal>

    <!-- ========= Reject Model======== -->

    <MModal ref="MaintenanceRequestRejectModal" :Name="'MaintenanceRequestRejectModal'" :Title="'رفض الطلب'">
      <div class="MField" id="RejectionReason">
        <input type="text" required />
        <label>سبب الرفض</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SaveRejectRequest">حفظ</div>
      </div>
    </MModal>

    <!-- ========= send Notification Model======== -->

    <MModal ref="MaintenanceRequestSendNotificationModal" :Name="'MaintenanceRequestSendNotificationModal'" :Title="'ارسال اشعار الى الساكن'">
      <div class="MField" id="TheNotification">
        <input type="text" required />
        <label>الاشعار</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SendNotification">ارسال</div>
      </div>
    </MModal>

    <div class="MButton" id="GetMaintenanceRequestsBTN">عرض كافة البيانات</div>
    <div class="MButton" id="GetMaintenanceRequestsDontPayBTN">عرض المنجز غير المدفوع</div>
    <div class="MButton" id="GetMaintenanceRequestsNotcompletedPayBTN">عرض غير المنجز تم الدفع</div>
    <div class="MButton" id="GetMaintenanceRequestsDetectionAndDontCompletedBTN">عرض قيد الكشف غير منجز</div>
    <div class="MButton" id="GetMaintenanceChangesRequestsBTN">عرض التغييرات</div>

    <div class="MGroup">
      <MDate ref="MaintenanceRequestsFromDate" :Name="'MaintenanceRequestsFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true"></MDate>
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
import { ref } from 'vue'
import { api, GetServerPath } from '../../axios'
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'
var RequestStatusData = 0

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())

    return {
      GlobalsStore: ref(useGlobalsStore()),
      //MaintenanceType: ref(null),
      //MaintenanceItems: ref([]),
      IDImage: ref(''),
      MaintenanceRequestModal: ref(null),
      MaintenanceRequestRejectModal: ref(null),
      MaintenanceRequestSendNotificationModal: ref(null),
      MaintenanceRequestsTB: ref(null),
      MaintenanceRequestsTBData: ref([]),
      isVisable: ref(true),
      ChangeBox: ref(null),
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
          name: 'type_description',
          label: 'النوع',
        },
        {
          name: 'price',
          label: 'المبلغ',
          sum: true,
          type: 'currency',
        },
        {
          name: 'price_spent',
          label: 'المبلغ المصروف',
          sum: true,
          type: 'currency',
        },
        {
          name: 'net_amount',
          label: 'المبلغ الصافي',
          //sum: true,
          type: 'currency',
        },
        {
          name: 'request_status',
          label: 'حالة الطلب',
        },
        {
          name: 'completion_status',
          label: 'حاله الانجاز',
        },
        {
          name: 'pay_type',
          label: 'نوع الدفع',
        },
        {
          name: 'note',
          label: 'الملاحظات',
        },
        {
          name: 'warranty_expire',
          label: 'فترة الضمان',
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
    //this.MaintenanceItems = this.GlobalsStore.ComboBoxes['MaintenanceType']

    // display Data between two date
    document.getElementById('GetMaintenanceRequestsBTN').addEventListener(
      'click',
      function () {
        ShowLoading()
        RequestStatusData = 1
        this.MaintenanceRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )
    document.getElementById('GetMaintenanceRequestsDontPayBTN').addEventListener(
      'click',
      function () {
        RequestStatusData = 2
        ShowLoading()
        this.MaintenanceRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )
    document.getElementById('GetMaintenanceRequestsNotcompletedPayBTN').addEventListener(
      'click',
      function () {
        RequestStatusData = 3
        ShowLoading()
        this.MaintenanceRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )
    document.getElementById('GetMaintenanceRequestsDetectionAndDontCompletedBTN').addEventListener(
      'click',
      function () {
        RequestStatusData = 4
        ShowLoading()
        this.MaintenanceRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )
    document.getElementById('GetMaintenanceChangesRequestsBTN').addEventListener(
      'click',
      function () {
        RequestStatusData = 5
        ShowLoading()
        this.MaintenanceRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )
    // document.getElementById('RejectBTN').addEventListener(
    //   'click',
    //   function () {
    //     document.getElementById('RejectionReason').querySelector('input').value = ''
    //     this.NfcCardRequestRejectModal.Show()
    //   }.bind(this)
    // )
    // View Requist
    document.getElementById('MaintenanceRequestsTB').addEventListener(
      'ViewItem',
      function (data) {
        this.selectedRowData = this.selectedRowData = data.detail.RowData

        this.ChangeBox.Set(false)
        this.isVisable = true
        document.getElementById('note').querySelector('input').value = ''
        document.getElementById('note').querySelector('input').value = this.selectedRowData.note
        document.getElementById('Price').querySelector('input').value = this.selectedRowData.price
        document.getElementById('PriceSpent').querySelector('input').value = this.selectedRowData.price_spent

        //this.MaintenanceType.Set(this.selectedRowData.type_description)
        this.MaintenanceRequestTimeTBData = this.selectedRowData.maintenance_time

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
    document.getElementById('SendNotificationBTN').addEventListener(
      'click',
      function () {
        this.MaintenanceRequestSendNotificationModal.Show()
      }.bind(this)
    )
  },
  methods: {
    computeNet(row) {
      const parseMoney = v => {
        if (v === null || v === undefined) return 0
        if (typeof v === 'string') return Number(v.replace(/,/g, '')) || 0
        return Number(v) || 0
      }
      return parseMoney(row?.price) - parseMoney(row?.price_spent)
    },
    GetMaintenanceRequestsData(MTable) {
      let APIName = 'MaintenanceRequests'
      if (RequestStatusData == 2) {
        APIName = 'GetMaintenanceRequestsDontPayAndDone'
      }
      if (RequestStatusData == 3) {
        APIName = 'GetMaintenanceRequestsDontCompletedAndPay'
      }
      if (RequestStatusData == 4) {
        APIName = 'GetMaintenanceRequestsDetectionAndDontCompleted'
      }
      if (RequestStatusData == 5) {
        APIName = 'GetMaintenanceChanges'
      }
      api
        .get(APIName, {
          params: {
            MTable: MTable,
            MaintenanceRequestFrom: this.MaintenanceRequestsFromDate.Get()[0],
            MaintenanceRequestTo: this.MaintenanceRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.MaintenanceRequestsTBRowsCount = response.data.total

          const parseMoney = v => {
            if (v === null || v === undefined) return 0
            if (typeof v === 'string') return Number(v.replace(/,/g, '')) || 0
            return Number(v) || 0
          }

          const rows = response.data.data.map(r => ({
            ...r,
            net_amount: parseMoney(r.price) - parseMoney(r.price_spent),
          }))

          this.MaintenanceRequestsTBData = rows
          this.MaintenanceRequestsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },

    // Constant Request
    AcceptConstantRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)

      api
        .post('AcceptMaintenanceConstantRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    CloseConstantRequest() {
      if (this.selectedRowData.request_status != 'تم الدفع' && this.selectedRowData.type == 1) {
        ShowMessage('لا يمكن غلق الطلب الا بعد اجراء عملية الدفع')
        return
      }
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('completion_status', this.selectedRowData.completion_status)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      api
        .post('CloseMaintenanceConstantRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    // ======================

    // Other Request
    AcceptToDetectionRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)

      api
        .post('AcceptToDetectionMaintenanceRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    AcceptMaintenanceDateSpecifiedRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)

      api
        .post('AcceptMaintenanceDateSpecified', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    AcceptToPayRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)
      api
        .post('AcceptToPayMaintenanceRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    ConvertFromDetectionToPaymentRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)

      api
        .post('AcceptToPayMaintenanceRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    // ConvertFromDetectionToAnjazAndPaymentRequest() {
    //   ShowLoading()
    //   var Parameters = new FormData()
    //   Parameters.append('RequestID', this.selectedRowData.id)
    //   Parameters.append('pid', this.selectedRowData.pid)
    //   Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
    //   Parameters.append('note', document.getElementById('note').querySelector('input').value)
    //   Parameters.append('price', document.getElementById('Price').querySelector('input').value)

    //   api
    //     .post('ConvertFromDetectionToAnjazAndPayment', Parameters, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     })
    //     .then(response => {
    //       HideLoading()
    //       if (response.data.success == true) {
    //         this.MaintenanceRequestsTB.LoadMTable()
    //         this.MaintenanceRequestModal.Hide()
    //       } else {
    //         HideLoading()
    //         ShowMessage(response.data.message)
    //       }
    //     })
    //     .catch(error => {
    //       HideLoading()
    //       if (error.response && error.response.status === 422) {
    //         const firstError = Object.values(error.response.data.errors)[0][0]
    //         ShowMessage(firstError)
    //       } else ShowMessage('حدث خطأ غير متوقع')
    //     })
    // },
    CloseOtherRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('completion_status', this.selectedRowData.completion_status)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      api
        .post('CloseMaintenanceOtherRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    ReturnToUnderReview() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)

      api
        .post('ReturnToUnderReviewMaintenanceRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    ConvertToAnjazAndCloseRequest() {
      if (this.selectedRowData.request_status != 'تم الدفع' && this.selectedRowData.type == 1) {
        ShowMessage('لا يمكن غلق الطلب الا بعد اجراء عملية الدفع')
        return
      }
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      api
        .post('ConvertToAnjazAndCloseMaintenanceRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    // ======================

    //Change
    IsChanges(name, Value) {
      this.isVisable = !Value
    },
    AcceptAndConvertToChangesRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)

      api
        .post('AcceptAndConvertToChanges', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    ReceiveTheAmountRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)

      api
        .post('ReceiveTheAmountChanges', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    InputPayChangeAndCloseRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)
      Parameters.append('price_spent', document.getElementById('PriceSpent').querySelector('input').value)

      api
        .post('InputPayChangeAndClose', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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

    PrintReceipt() {
      if (!this.selectedRowData || !this.selectedRowData.id) {
        ShowMessage('لا توجد بيانات للطلب لطباعتها')
        return
      }

      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('maintenance_detail', this.selectedRowData.maintenance_detail)
      Parameters.append('note', document.getElementById('note').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)
      Parameters.append('price_spent', document.getElementById('PriceSpent').querySelector('input').value)

      api
        .post('MaintenanceReceiveVoucher', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            const r = this.selectedRowData
            const parseMoney = v => {
              if (v === null || v === undefined) return 0
              if (typeof v === 'string') return Number(v.replace(/,/g, '')) || 0
              return Number(v) || 0
            }
            const formatIQD = amt => parseMoney(amt).toLocaleString('ar-IQ', { maximumFractionDigits: 0 }) + ' د.ع'

            // بيانات الـ QR فقط (من دون أي تغيير في التصميم)
            const qrData = JSON.stringify({
              id: r.id ?? '',
              pid: r.pid ?? '',
              phone: (r.phone ?? '').toString().replace(/\s/g, ''),
              price: parseMoney(r.price),
            })

            const html = `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>صيانة المنازل</title>
  <style>
    @page { size: A4; margin: 14mm; }
    body { font-family: MFontB, "Segoe UI", Arial, sans-serif; direction: rtl; color: #111; }
    .wrap { max-width: 720px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 16px; }
    .title { font-size: 22px; font-weight: 700; }
    .meta { font-size: 12px; color: #555; margin-top: 6px; }
    .box { border: 1px solid #ccc; border-radius: 8px; padding: 12px 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { padding: 10px 8px; border-bottom: 1px dashed #ddd; vertical-align: top; font-size: 14px; }
    th { text-align: right; width: 30%; color: #333; }
    .total { font-weight: 700; font-size: 18px; }
    .footer { display: flex; justify-content: space-between; margin-top: 18px; font-size: 16px; }
    .sig { width: 48%; border-top: 1px solid #aaa; text-align: center; padding-top: 6px; height: 40px; }
    .note { margin-top: 10px; font-size: 12px; color: #666; }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="title">وصل قبض (صيانة المنازل)</div>
      <div class="meta">
        التاريخ: ${new Date().toLocaleString('ar-IQ')}
      </div>
    </div>

    <div class="box">
      <table>
        <tr>
          <th>رقم الوصل</th>
          <td>${r.id ?? ''}</td>
        </tr>
        <tr>
          <th>المدينة</th>
          <td>${r.compound ?? ''}</td>
        </tr>
         <tr>
          <th>اسم مقدم الطلب</th>
          <td>${r.name ?? ''}</td>
        </tr>
        <tr>
          <th>رقم الهاتف</th>
          <td>${r.phone ?? ''}</td>
        </tr>
        <tr>
          <th>العنوان</th>
          <td>${r.address ?? ''}</td>
        </tr>
        <tr>
          <th>تفاصيل الطلب</th>
          <td>${r.maintenance_detail ?? ''}</td>
        </tr>
        <tr>
          <th class="total">المبلغ</th>
          <td class="total">${formatIQD(r.price)}</td>
        </tr>
      </table>

      <br></br>

      <!-- ✅ QR Code فقط، بدون أي تغييرات شكلية -->
      <div id="receiptQR"></div>

      <br></br>

      <div class="footer" style="font-size: 18px">
        <div class="sig">توقيع صاحب الطلب</div>
        <div class="sig">توقيع الإدارة</div>
      </div>
    </div>

    <br></br>

    <div class="no-print" style="text-align:center; margin-top:14px;">
      <button onclick="window.print()">طباعة</button>
      <button onclick="window.close()">إغلاق</button>
    </div>
  </div>
</body>
</html>`

            const w = window.open('', '_blank', 'width=900,height=800')
            if (!w) {
              ShowMessage('لم يتم فتح نافذة الطباعة (قد يكون محظورًا من المتصفح).')
              return
            }
            w.document.open()
            w.document.write(html)
            w.document.close()
            w.focus()

            // تحميل مكتبة QR فقط ورسمها داخل #receiptQR (لا تغيير آخر)
            const s = w.document.createElement('script')
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
            s.onload = () => {
              try {
                const el = w.document.getElementById('receiptQR')
                new w.QRCode(el, {
                  text: qrData,
                  width: 140,
                  height: 140,
                  colorDark: '#000000',
                  colorLight: '#ffffff',
                  correctLevel: w.QRCode.CorrectLevel.M,
                })
              } catch (e) {
                console.error(e)
              }

              // نفس سلوكك السابق: لا نطبع تلقائياً (السطر أدناه متروك كما هو لديك)
              // setTimeout(() => { w.print() }, 300)
            }
            w.document.head.appendChild(s)
            // this.MaintenanceRequestModal.Hide()
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
    // ======================

    SaveRejectRequest() {
      ShowLoading()

      var Parameters = new FormData()
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

    SendNotification() {
      ShowLoading()

      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('Reason', document.getElementById('TheNotification').querySelector('input').value)

      api
        .post('SendNotificationMaintenance', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.MaintenanceRequestModal.Hide()
            this.MaintenanceRequestSendNotificationModal.Hide()
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

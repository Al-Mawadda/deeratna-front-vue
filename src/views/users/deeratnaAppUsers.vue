<template>
  <div class="ComponentWrapper">
    <!-- ===============  add subsc Model  ========= -->
    <MModal
      ref="AddCustomerModal"
      :Name="'AddCustomerModal'"
      :Title="'اضافة مشترك جديد'"
    >
      <!-- <MComboBox
        ref="Compounds"
        :Name="'Compounds'"
        :Label="' اسم المدينة *'"
        :Items="CompoundsItems"
      >
      </MComboBox> -->

      <div class="MField" id="username">
        <input ref="username" type="text" required />
        <label>كلمة الدخول *</label>
        <div class="MFieldBG"></div>
      </div>

      <!-- <div class="MField" id="address">
        <input ref="address" type="text" required />
        <label>العنوان *</label>
        <div class="MFieldBG"></div>
      </div> -->

      <div class="MField" id="phone">
        <input ref="phone" type="text" required />
        <label>هاتف المشترك *</label>
        <div class="MFieldBG"></div>
      </div>

      <div class="MField" id="status">
        <input ref="status" type="text" required />
        <label>حالة الاشتراك *</label>
        <div class="MFieldBG"></div>
      </div>

      <!-- <div class="MField" id="Notes">
        <input ref="Notes" type="text" required />
        <label>الملاحظات *</label>
        <div class="MFieldBG"></div>
      </div> -->

      <div class="ModalButtons">
        <div class="MButton" id="SavePersonBTN" @click="SavePerson">حفـــظ</div>
      </div>
    </MModal>

    <div class="MButton" id="GetCustomersBTN">عرض البيانات</div>
    <div class="MGroup">
      <MDate
        ref="CustomersFromDate"
        :Name="'CustomersFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="CustomersToDate"
        :Name="'CustomersToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>
    <MTable
      ref="CustomersTB"
      :Name="'CustomersTB'"
      :DataArray="CustomersTBData"
      :Columns="CustomersTBColumns"
      :Sums="CustomersTBSums"
      :GetDataFunction="GetCustomersData"
      :RowsCount="CustomersTBRowsCount"
      :RowsPerPage="10"
    >
      <template v-slot:options>
        <!-- View Videosdffhroif Option -->
        <div class="MTableOption" OptionEventName="EditItem">
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
          <div class="MTableOptionName">تعديل</div>
        </div>
        <div class="MTableOption" OptionEventName="DeleteItem">
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
          <div class="MTableOptionName">حذف</div>
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
      Operation: ref(''),
      AddCustomerModal: ref(null),
      ID: ref(''),
      GlobalsStore: ref(useGlobalsStore()),
      Compounds: ref(null),
      CompoundsItems: ref([]),
      CompanyName: ref(null),
      CompanyNameItems: ref([]),
      SubscriptionTypeItems: ref([]),
      CustomersTB: ref(null),
      CustomersTBData: ref([]),
      CustomersTBRowsCount: ref(0),

      CustomersTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'uid',
          label: 'رمز المستخدم',
        },
        {
          name: 'real_estates.compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'real_estates.address',
          label: 'العنوان',
        },
        {
          name: 'username',
          label: 'كلمة الدخول',
        },
        {
          name: 'phone',
          label: 'رقم الهاتف',
        },
        {
          name: 'status',
          label: 'حالة الاشتراك',
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
      ],
      CustomersTBSums: ref([]),

      CustomersFromDate: ref(null),
      CustomersToDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.CompoundsItems = this.GlobalsStore.ComboBoxes['Compounds']
    this.CustomersTB.LoadMTable()
    //ReLoad table
    document.getElementById('GetCustomersBTN').addEventListener(
      'click',
      function () {
        this.CustomersTB.ReLoadMTable()
      }.bind(this)
    )
    // EditItem
    document.getElementById('CustomersTB').addEventListener(
      'EditItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.Operation = 2
        this.ID = this.selectedRowData.id

        document.getElementById('username').querySelector('input').value =
          this.selectedRowData.username
        document.getElementById('phone').querySelector('input').value =
          this.selectedRowData.phone
        document.getElementById('status').querySelector('input').value =
          this.selectedRowData.status

        this.AddCustomerModal.Show()
      }.bind(this)
    )
    // DeleteItem
    document.getElementById('CustomersTB').addEventListener(
      'DeleteItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.ID = this.selectedRowData.id
        api
          .put(`deleteCustomer/` + this.ID)
          .then(response => {
            HideLoading()
            if (response.data.success) {
              ShowMessage(response.data.message)
              this.CustomersTB.LoadMTable()
            } else {
              ShowMessage(response.data.message)
            }
          })
          .catch(error => {
            HideLoading()
            if (error.response && error.response.status === 500) {
              ShowMessage(error.response.data.message || 'حدث خطأ غير متوقع')
            } else {
              ShowMessage('حدث خطأ غير متوقع')
            }
          })
      }.bind(this)
    )
  },
  methods: {
    GetCustomersData(MTable) {
      api
        .get('getAllCustomer', {
          params: {
            MTable: MTable,
            CustomersFrom: this.CustomersFromDate.Get(),
            CustomersTo: this.CustomersToDate.Get(),
          },
        })
        .then(response => {
          this.CustomersTBData = response.data.data
          this.CustomersTBRowsCount = response.data.total
          this.CustomersTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },

    //==============Save  person=========================
    SavePerson() {
      ShowLoading()
      var Parameters = new FormData()

      Parameters.append(
        'username',
        document.getElementById('username').querySelector('input').value
      )
      Parameters.append(
        'phone',
        document.getElementById('phone').querySelector('input').value
      )
      Parameters.append(
        'status',
        document.getElementById('status').querySelector('input').value
      )
      api
        .put(`updateCustomer/` + this.ID, Parameters)
        .then(response => {
          HideLoading()
          if (response.data.message == 'تمت العملية بنجاح') {
            this.CustomersTB.LoadMTable()
            this.AddCustomerModal.Hide()
            // this.clearFields()
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
    clearFields() {
      this.Compounds.Clear()
      this.CompanyName.Clear()
      Object.keys(this.$refs).forEach(ref => {
        const field = this.$refs[ref]
        // Check if the ref is an input field or a custom component
        if (field.tagName === 'INPUT') {
          field.value = ''
        } else if (typeof field.reset === 'function') {
          // If it's a custom component like MDate with a reset method
          field.reset()
        }
      })
    },
  },
}
</script>

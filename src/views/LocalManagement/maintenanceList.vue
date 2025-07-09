<template>
  <div class="ComponentWrapper">
    <!-- =============== add subsc Model========= -->
    <MModal
      ref="AddMaintenanceListModal"
      :Name="'AddMaintenanceListModal'"
      :Title="'اضافة صيانة جديدة'"
    >
      <div class="MField" id="MaintenanceDetails">
        <input ref="MaintenanceDetails" type="text" required />
        <label>تفاصيل الصيانة</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Price" v-OnlyNumbers>
        <input ref="Price" type="text" required />
        <label>السعر</label>
        <div class="MFieldBG"></div>
      </div>

      <div class="ModalButtons">
        <div
          class="MButton"
          id="SaveMaintenanceListBTN"
          @click="SaveMaintenanceList"
        >
          حفـــظ
        </div>
      </div>
    </MModal>

    <div class="MButton" id="AddMaintenanceListBTN">ادخال اشتراك جديد</div>
    <div class="MButton" id="GetMaintenanceListBTN">عرض البيانات</div>
    <MTable
      ref="MaintenanceListTB"
      :Name="'MaintenanceListTB'"
      :DataArray="MaintenanceListTBData"
      :Columns="MaintenanceListTBColumns"
      :Sums="MaintenanceListTBSums"
      :GetDataFunction="GetMaintenanceListData"
      :RowsCount="MaintenanceListTBRowsCount"
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

    return {
      hasPermission,
      Operation: ref(''),
      AddMaintenanceListModal: ref(null),
      ID: ref(''),
      GlobalsStore: ref(useGlobalsStore()),
      MaintenanceListTB: ref(null),
      MaintenanceListTBData: ref([]),

      MaintenanceListTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'details',
          label: 'تفاصيل الصيانة',
        },
        {
          name: 'price',
          label: 'السعر',
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
      ],
      MaintenanceListTBSums: ref([]),

      MaintenanceListTBRowsCount: ref(0),
      MaintenanceListFromDate: ref(null),
      MaintenanceListToDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.MaintenanceListTB.LoadMTable()
    //Reload Data
    document.getElementById('GetMaintenanceListBTN').addEventListener(
      'click',
      function () {
        this.MaintenanceListTB.ReLoadMTable()
      }.bind(this)
    )
    // ShowModal
    document.getElementById('AddMaintenanceListBTN').addEventListener(
      'click',
      function () {
        this.AddMaintenanceListModal.Show()
        this.Operation = 1
        this.clearFields()
      }.bind(this)
    )
    // EditData
    document.getElementById('MaintenanceListTB').addEventListener(
      'EditItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.Operation = 2
        this.ID = this.selectedRowData.id
        document.getElementById('Price').querySelector('input').value =
          this.selectedRowData.price
        document
          .getElementById('MaintenanceDetails')
          .querySelector('input').value = this.selectedRowData.details

        this.AddMaintenanceListModal.Show()
      }.bind(this)
    )
    //Delete Data
    document.getElementById('MaintenanceListTB').addEventListener(
      'DeleteItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.ID = this.selectedRowData.id
        api
          .delete(`MaintenanceList/` + this.ID)
          .then(response => {
            HideLoading()
            if (response.data.success) {
              ShowMessage(response.data.message)
              this.MaintenanceListTB.LoadMTable()
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
    //load data from table to table and combo companyName
    GetMaintenanceListData(MTable) {
      api
        .get('MaintenanceList', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.MaintenanceListTBData = response.data.data
          this.MaintenanceListTBRowsCount = response.data.total
          this.MaintenanceListTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },

    //==============Save  person=========================
    SaveMaintenanceList() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append(
        'details',
        document.getElementById('MaintenanceDetails').querySelector('input')
          .value
      )
      Parameters.append(
        'price',
        document.getElementById('Price').querySelector('input').value
      )

      //=========post ============
      if (this.Operation == 1) {
        api
          .post('MaintenanceList', Parameters, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            HideLoading()
            if (response.data.message == 'تمت العملية بنجاح') {
              this.MaintenanceListTB.LoadMTable()
              this.AddMaintenanceListModal.Hide()
              this.clearFields()
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
      } else if (this.Operation == 2) {
        api
          .put(`MaintenanceList/` + this.ID, Parameters)
          .then(response => {
            HideLoading()
            if (response.data.message == 'تمت العملية بنجاح') {
              this.MaintenanceListTB.LoadMTable()
              this.AddMaintenanceListModal.Hide()
              this.clearFields()
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
      }
    },
    clearFields() {
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

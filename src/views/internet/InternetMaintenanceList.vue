<template>
  <div class="ComponentWrapper">
    <!-- =============== add subsc Model========= -->
    <MModal
      ref="AddInternetMaintenanceListModal"
      :Name="'AddInternetMaintenanceListModal'"
      :Title="'اضافة صيانة جديدة'"
    >
      <div class="MField" id="InternetMaintenanceDetails">
        <input ref="InternetMaintenanceDetails" type="text" required />
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
          id="SaveInternetMaintenanceListBTN"
          @click="SaveInternetMaintenanceList"
        >
          حفـــظ
        </div>
      </div>
    </MModal>

    <div class="MButton" id="AddInternetMaintenanceListBTN">
      ادخال صيانة جديدة
    </div>
    <div class="MButton" id="GetInternetMaintenanceListBTN">عرض البيانات</div>
    <MTable
      ref="InternetMaintenanceListTB"
      :Name="'InternetMaintenanceListTB'"
      :DataArray="InternetMaintenanceListTBData"
      :Columns="InternetMaintenanceListTBColumns"
      :Sums="InternetMaintenanceListTBSums"
      :GetDataFunction="GetInternetMaintenanceListData"
      :RowsCount="InternetMaintenanceListTBRowsCount"
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
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'

export default {
  setup() {
    return {
      Operation: ref(''),
      AddInternetMaintenanceListModal: ref(null),
      ID: ref(''),
      GlobalsStore: ref(useGlobalsStore()),
      InternetMaintenanceListTB: ref(null),
      InternetMaintenanceListTBData: ref([]),

      InternetMaintenanceListTBColumns: [
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
      InternetMaintenanceListTBSums: ref([]),

      InternetMaintenanceListTBRowsCount: ref(0),
      InternetMaintenanceListFromDate: ref(null),
      InternetMaintenanceListToDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.InternetMaintenanceListTB.LoadMTable()
    //Reload Data
    document.getElementById('GetInternetMaintenanceListBTN').addEventListener(
      'click',
      function () {
        this.InternetMaintenanceListTB.ReLoadMTable()
      }.bind(this)
    )
    // ShowModal
    document.getElementById('AddInternetMaintenanceListBTN').addEventListener(
      'click',
      function () {
        this.AddInternetMaintenanceListModal.Show()
        this.Operation = 1
        this.clearFields()
      }.bind(this)
    )
    // EditData
    document.getElementById('InternetMaintenanceListTB').addEventListener(
      'EditItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.Operation = 2
        this.ID = this.selectedRowData.id
        document.getElementById('Price').querySelector('input').value =
          this.selectedRowData.price
        document
          .getElementById('InternetMaintenanceDetails')
          .querySelector('input').value = this.selectedRowData.details

        this.AddInternetMaintenanceListModal.Show()
      }.bind(this)
    )
    //Delete Data
    document.getElementById('InternetMaintenanceListTB').addEventListener(
      'DeleteItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.ID = this.selectedRowData.id
        api
          .delete(`internetMaintenanceList/` + this.ID)
          .then(response => {
            HideLoading()
            if (response.data.success) {
              ShowMessage(response.data.message)
              this.InternetMaintenanceListTB.LoadMTable()
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
    GetInternetMaintenanceListData(MTable) {
      api
        .get('internetMaintenanceList', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.InternetMaintenanceListTBData = response.data.data
          this.InternetMaintenanceListTBRowsCount = response.data.total
          this.InternetMaintenanceListTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },

    //==============Save  person=========================
    SaveInternetMaintenanceList() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append(
        'details',
        document
          .getElementById('InternetMaintenanceDetails')
          .querySelector('input').value
      )
      Parameters.append(
        'price',
        document.getElementById('Price').querySelector('input').value
      )

      //=========post ============
      if (this.Operation == 1) {
        api
          .post('internetMaintenanceList', Parameters, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            HideLoading()
            if (response.data.message == 'تمت العملية بنجاح') {
              this.InternetMaintenanceListTB.LoadMTable()
              this.AddInternetMaintenanceListModal.Hide()
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
          .put(`internetMaintenanceList/` + this.ID, Parameters)
          .then(response => {
            HideLoading()
            if (response.data.message == 'تمت العملية بنجاح') {
              this.InternetMaintenanceListTB.LoadMTable()
              this.AddInternetMaintenanceListModal.Hide()
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

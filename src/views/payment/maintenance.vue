<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessMaintenanceTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate
        ref="MaintenanceFromDate"
        :Name="'MaintenanceFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="MaintenanceToDate"
        :Name="'MaintenanceToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>

    <MTable
      ref="MaintenanceTB"
      :Name="'MaintenanceTB'"
      :DataArray="MaintenanceTBData"
      :Columns="MaintenanceTBColumns"
      :Sums="MaintenanceTBSums"
      :GetDataFunction="GetMaintenanceData"
      :RowsCount="MaintenanceTBRowsCount"
      :RowsPerPage="10"
    >
    </MTable>
  </div>
</template>
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { useGlobalsStore } from '../../stores/Globals.js'

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)
    const GlobalsStore = ref(useGlobalsStore())

    return {
      hasPermission,
      MaintenanceTB: ref(null),
      MaintenanceTBData: ref([]),
      MaintenanceTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'pid',
          label: 'رمز الشخص',
        },
        {
          name: 'name',
          label: 'اسم الساكن',
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
          name: 'payment_name',
          label: 'نوع العملية',
        },
        {
          name: 'payment_amount',
          label: 'المبلغ',
          sum: true,
          type: 'currency',
        },
        {
          name: 'transaction_status',
          label: 'الحالة',
        },
        {
          name: 'payment_method',
          label: 'الية الدفع',
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
        {
          name: 'transaction_id',
          label: 'معرف المعاملة',
        },
      ],
      MaintenanceTBSums: ref([]),

      MaintenanceTBRowsCount: ref(0),
      MaintenanceFromDate: ref(null),
      MaintenanceToDate: ref(null),
    }
  },
  mounted() {
    this.MaintenanceTB.LoadMTable()
    document
      .getElementById('GetSuccessMaintenanceTransactionsBTN')
      .addEventListener(
        'click',
        function () {
          this.MaintenanceTB.ReLoadMTable()
        }.bind(this)
      )
  },
  methods: {
    GetMaintenanceData(MTable) {
      api
        .get('GetMaintenanceTransactions', {
          params: {
            MTable: MTable,
            maintenanceFrom: this.MaintenanceFromDate.Get(),
            maintenanceTo: this.MaintenanceToDate.Get(),
          },
        })
        .then(response => {
          this.MaintenanceTBData = response.data.data
          this.MaintenanceTBRowsCount = response.data.total
          this.MaintenanceTBSums = response.data.sums
        })
        .catch(error => {
          this.ShowMessage('حدث خطا', error)
        })
    },
    GetMaintenanceDataSuccess(MTable) {
      MTable['Filters']['transaction_status'] = 'success';
      api
        .get('GetMaintenanceTransactions', {
          params: {
            MTable: MTable,
            maintenanceFrom: this.MaintenanceFromDate.Get(),
            maintenanceTo: this.MaintenanceToDate.Get(),
          },
        })
        .then(response => {
          this.MaintenanceTBData = response.data.data
          this.MaintenanceTBRowsCount = response.data.total
          this.MaintenanceTBSums = response.data.sums
        })
        .catch(error => {
          this.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

<style scoped>
#MaintenanceFromDate,
#MaintenanceToDate {
  max-width: 300px;
}
</style>

<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessServicesTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate ref="ServicesFromDate" :Name="'ServicesFromDate'" :Label="'تاريخ من'"></MDate>
      <MDate ref="ServicesToDate" :Name="'ServicesToDate'" :Label="'تاريخ الى'"></MDate>
    </div>
    <MTable ref="ServicesTB" :Name="'ServicesTB'" :DataArray="ServicesTBData" :Columns="ServiceTBColumns"
      :Sums="ServicesTBSums" :GetDataFunction="GetServicesData" :RowsCount="ServicesTBRowsCount" :RowsPerPage="10">
    </MTable>
  </div>
</template>
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { ShowMessage } from '@/MJS.js'
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission => authStore.user && authStore.user.permissions.includes(permission)
    const GlobalsStore = ref(useGlobalsStore());

    return {
      hasPermission,
      ServicesTB: ref(null),
      ServicesTBData: ref([]),
      ServicesTBRowsCount: ref(0),
      ServiceTBColumns: [
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
          name: 'person_name',
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
      ServicesTBSums: ref([]),
      ServicesFromDate: ref(null),
      ServicesToDate: ref(null),
    }
  },
  mounted() {
    this.ServicesTB.LoadMTable()
    document
      .getElementById('GetSuccessServicesTransactionsBTN')
      .addEventListener(
        'click',
        function () {
          this.ServicesTB.LoadMTable()
        }.bind(this),
      )
  },
  methods: {
    GetServicesData(MTable) {
      api
        .get('GetServicesTransactions', {
          params: {
            MTable: MTable,
            serviceFrom: this.ServicesFromDate.Get(),
            serviceTo: this.ServicesToDate.Get(),
          },
        })
        .then(response => {
          this.ServicesTBData = response.data.data
          this.ServicesTBRowsCount = response.data.total
          this.ServicesTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

<style scoped>
#ServicesFromDate,
#ServicesToDate {
  max-width: 300px;
}
</style>

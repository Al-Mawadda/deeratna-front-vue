<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessCarLabelsTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate
        ref="CarLabelsFromDate"
        :Name="'CarLabelsFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="CarLabelsToDate"
        :Name="'CarLabelsToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>

    <MTable
      ref="CarLabelsTB"
      :Name="'CarLabelsTB'"
      :DataArray="CarLabelsTBData"
      :Columns="CarLabelsTBColumns"
      :Sums="CarLabelsTBSums"
      :GetDataFunction="GetCarLabelsData"
      :RowsCount="CarLabelsTBRowsCount"
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
      CarLabelsTB: ref(null),
      CarLabelsTBData: ref([]),
      CarLabelsTBColumns: [
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
      CarLabelsTBSums: ref([]),

      CarLabelsTBRowsCount: ref(0),
      CarLabelsFromDate: ref(null),
      CarLabelsToDate: ref(null),
    }
  },
  mounted() {
    this.CarLabelsTB.LoadMTable()
    document
      .getElementById('GetSuccessCarLabelsTransactionsBTN')
      .addEventListener(
        'click',
        function () {
          this.CarLabelsTB.LoadMTable()
        }.bind(this)
      )
  },
  methods: {
    GetCarLabelsData(MTable) {
      api
        .get('GetCarLabelsTransactions', {
          params: {
            MTable: MTable,
            carLabelFrom: this.CarLabelsFromDate.Get(),
            carLabelTo: this.CarLabelsToDate.Get(),
          },
        })
        .then(response => {
          this.CarLabelsTBData = response.data.data
          this.CarLabelsTBRowsCount = response.data.total
          this.CarLabelsTBSums = response.data.sums
        })
        .catch(error => {
          this.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

<style scoped>
#CarLabelsFromDate,
#CarLabelsToDate {
  max-width: 300px;
}
</style>

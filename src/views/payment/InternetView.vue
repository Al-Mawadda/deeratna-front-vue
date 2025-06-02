<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessInternetsTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate
        ref="InternetTransactionsFromDate"
        :Name="'InternetTransactionsFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="InternetTransactionsToDate"
        :Name="'InternetTransactionsToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>

    <MTable
      ref="InternetsTB"
      :Name="'InternetsTB'"
      :DataArray="InternetsTBData"
      :Columns="InternetsTBColumns"
      :Sums="InternetsTBSums"
      :GetDataFunction="GetInternetsData"
      :RowsCount="InternetsTBRowsCount"
      :RowsPerPage="10"
    >
      <!-- <template v-slot:options>
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="..."></path>
            </svg>
          </div>
          <div class="MTableOptionName">عرض</div>
        </div>
        <div class="MTableOption" OptionEventName="DeleteItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="..."></path>
            </svg>
          </div>
          <div class="MTableOptionName">حذف</div>
        </div>
      </template> -->
    </MTable>
  </div>
</template>
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { ShowMessage } from '@/MJS.js'
import { useGlobalsStore } from '../../stores/Globals.js'

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)
    const GlobalsStore = ref(useGlobalsStore())

    return {
      hasPermission,
      InternetsTB: ref(null),
      InternetsTBData: ref([]),
      InternetsTBColumns: [
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
      InternetsTBSums: ref([]),
      InternetsTBRowsCount: ref(0),
      InternetTransactionsFromDate: ref(null),
      InternetTransactionsToDate: ref(null),
    }
  },
  mounted() {
    this.InternetsTB.LoadMTable()
    document
      .getElementById('GetSuccessInternetsTransactionsBTN')
      .addEventListener(
        'click',
        function () {
          this.InternetsTB.LoadMTable()
        }.bind(this)
      )
  },
  methods: {
    GetInternetsData(MTable) {
      api
        .get('GetInternetTransactions', {
          params: {
            MTable: MTable,
            InternetTransactionsFrom: this.InternetTransactionsFromDate.Get(),
            InternetTransactionsTo: this.InternetTransactionsToDate.Get(),
          },
        })
        .then(response => {
          this.InternetsTBData = response.data.data
          this.InternetsTBRowsCount = response.data.total
          this.InternetsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

<style scoped>
#InternetTransactionsFromDate,
#InternetTransactionsToDate {
  max-width: 300px;
}
</style>

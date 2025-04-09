<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessInstallmentsTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate
        ref="InstallmentsFromDate"
        :Name="'InstallmentsFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="InstallmentsToDate"
        :Name="'InstallmentsToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>

    <MTable
      ref="InstallmentsTB"
      :Name="'InstallmentsTB'"
      :DataArray="InstallmentsTBData"
      :Columns="InstallmentsTBColumns"
      :Sums="InstallmentsTBSums"
      :GetDataFunction="GetInstallmentsData"
      :RowsCount="InstallmentsTBRowsCount"
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

    <div class="MGroup">
      <div class="MlabelText">مجموع المبالغ =</div>
      <div class="MlabelNumber" id="InstallmentsTotal"></div>
    </div>
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
      InstallmentsTB: ref(null),
      InstallmentsTBData: ref([]),
      InstallmentsTBColumns: [
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
      InstallmentsTBSums: ref([]),

      InstallmentsTBRowsCount: ref(0),
      InstallmentsFromDate: ref(null),
      InstallmentsToDate: ref(null),
    }
  },
  mounted() {
    this.InstallmentsTB.LoadMTable()
    document
      .getElementById('GetSuccessInstallmentsTransactionsBTN')
      .addEventListener(
        'click',
        function () {
          this.InstallmentsTB.LoadMTable()
        }.bind(this)
      )
  },
  methods: {
    GetInstallmentsData(MTable) {
      api
        .get('GetInstallmentsTransactions', {
          params: {
            MTable: MTable,
            installmentFrom: this.InstallmentsFromDate.Get(),
            installmentTo: this.InstallmentsToDate.Get(),
          },
        })
        .then(response => {
          this.InstallmentsTBData = response.data.data
          this.InstallmentsTBRowsCount = response.data.total
          this.InstallmentsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

<style scoped>
#InstallmentsFromDate,
#InstallmentsToDate {
  max-width: 300px;
}
</style>

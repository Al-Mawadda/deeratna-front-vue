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
      :HeadersArray="InstallmentsTBHeaders"
      :TotalsArray="InstallmentsTBTotals"
      :DisplayColumnsArray="InstallmentsTBDisplayColumns"
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
export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)

    return {
      hasPermission,
      InstallmentsTB: ref(null),
      InstallmentsTBData: ref([]),
      InstallmentsTBHeaders: ref([
        '#',
        'المجمع',
        'اسم الساكن',
        'العنوان',
        'رقم الهاتف',
        'المبلغ',
        'الحالة',
        'الية الدفع',
        'التاريخ',
        'معرف المعاملة',
      ]),
      InstallmentsTBDisplayColumns: ref([
        'id',
        'compound',
        'person_name',
        'address',
        'phone',
        'payment_amount',
        'transaction_status',
        'payment_method',
        'created_at',
        'transaction_id',
      ]),
      InstallmentsTBTotals: ref(['Count', '', '', '', '', '', '']),
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
    GetInstallmentsData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      api
        .get('GetInstallmentsTransactions', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
            installmentFrom: this.InstallmentsFromDate.Get(),
            installmentTo: this.InstallmentsToDate.Get(),
          },
        })
        .then(response => {
          this.InstallmentsTBRowsCount = response.data.paginated_data.total
          this.InstallmentsTBData = response.data.paginated_data.data
          document.getElementById('InstallmentsTotal').innerHTML =
            new Intl.NumberFormat('en-US').format(
              response.data.total_payment_amount
            )
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

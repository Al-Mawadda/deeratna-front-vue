<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessInstallmentsTransactionsBTN">
      عرض البيانات
    </div>

    <MTable
      ref="InstallmentsTB"
      :MTableName="'InstallmentsTB'"
      :DataArray="InstallmentsTBData"
      :HeadersArray="InstallmentsTBHeaders"
      :TotalsArray="InstallmentsTBTotals"
      :DisplayColumnsArray="InstallmentsTBDisplayColumns"
      :GetDataFunction="GetInstallmentsData"
      :RowsCount="InstallmentsTBRowsCount"
      :RowsPerPage="10"



    >
      <template v-slot:options>
        <!-- View Videosdffhroif Option -->
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="..."></path>
            </svg>
          </div>
          <div class="MTableOptionName">عرض</div>
        </div>
        <!-- Delete Video Option -->
        <div class="MTableOption" OptionEventName="DeleteItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="..."></path>
            </svg>
          </div>
          <div class="MTableOptionName">حذف</div>
        </div>
      </template>
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
import MTable from '../../components/MTable.vue'

export default {
  components: {
    MTable,
  },
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
        'معرف المعاملة',
        'التاريخ',
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
        'transaction_id',
        'created_at',
      ]),
      InstallmentsTBTotals: ref(['Count', '', '', '', '', '', '']),
      InstallmentsTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.InstallmentsTB.LoadMTable()
  },
  methods: {
    GetInstallmentsData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      api
        .get('GetInstallmentsTransactions', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
          },
        })
        .then(response => {
          this.InstallmentsTBRowsCount = response.data.paginated_data.total
          this.InstallmentsTBData = response.data.paginated_data.data
          document.getElementById('InstallmentsTotal').innerHTML =
            new Intl.NumberFormat('en-US').format(
              response.data.total_payment_amount,
            )
        })
        .catch(error => {
          this.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

<style scoped></style>

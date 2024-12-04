<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessNfcCardsTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate
        ref="NfcCardsFromDate"
        :Name="'NfcCardsFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="NfcCardsToDate"
        :Name="'NfcCardsToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>

    <MTable
      ref="NfcCardsTB"
      :MTableName="'NfcCardsTB'"
      :DataArray="NfcCardsTBData"
      :HeadersArray="NfcCardsTBHeaders"
      :TotalsArray="NfcCardsTBTotals"
      :DisplayColumnsArray="NfcCardsTBDisplayColumns"
      :GetDataFunction="GetNfcCardsData"
      :RowsCount="NfcCardsTBRowsCount"
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
      <div class="MlabelNumber" id="NfcCardsTotal"></div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import MTable from '../../components/MTable.vue'
import MDate from '../../components/MDate.vue'
import { ShowMessage } from '@/MJS.js'
export default {
  components: {
    MTable,
    MDate,
  },
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)

    return {
      hasPermission,
      NfcCardsTB: ref(null),
      NfcCardsTBData: ref([]),
      NfcCardsTBHeaders: ref([
        '#',
        'المجمع',
        'اسم الساكن',
        'العنوان',
        'رقم الهاتف',
        'نوع العملية',
        'المبلغ',
        'الحالة',
        'الية الدفع',
        'التاريخ',
        'معرف المعاملة',
      ]),
      NfcCardsTBDisplayColumns: ref([
        'id',
        'compound',
        'person_name',
        'address',
        'phone',
        'payment_name',
        'payment_amount',
        'transaction_status',
        'payment_method',
        'created_at',
        'transaction_id',
      ]),
      NfcCardsTBTotals: ref(['Count', '', '', '', '', '', '']),
      NfcCardsTBRowsCount: ref(0),
      NfcCardsFromDate: ref(null),
      NfcCardsToDate: ref(null),
    }
  },
  mounted() {
    this.NfcCardsTB.LoadMTable()
    document
      .getElementById('GetSuccessNfcCardsTransactionsBTN')
      .addEventListener(
        'click',
        function () {
          this.NfcCardsTB.LoadMTable()
        }.bind(this),
      )
  },
  methods: {
    GetNfcCardsData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      api
        .get('GetNfcCardsTransactions', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
            nfcCardFrom: this.NfcCardsFromDate.Get(),
            nfcCardTo: this.NfcCardsToDate.Get(),
          },
        })
        .then(response => {
          this.NfcCardsTBRowsCount = response.data.paginated_data.total
          this.NfcCardsTBData = response.data.paginated_data.data
          document.getElementById('NfcCardsTotal').innerHTML =
            new Intl.NumberFormat('en-US').format(
              response.data.total_payment_amount,
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
#NfcCardsFromDate,
#NfcCardsToDate {
  max-width: 300px;
}
</style>

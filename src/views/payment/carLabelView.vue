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
      :MTableName="'CarLabelsTB'"
      :DataArray="CarLabelsTBData"
      :HeadersArray="CarLabelsTBHeaders"
      :TotalsArray="CarLabelsTBTotals"
      :DisplayColumnsArray="CarLabelsTBDisplayColumns"
      :GetDataFunction="GetCarLabelsData"
      :RowsCount="CarLabelsTBRowsCount"
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
      <div class="MlabelNumber" id="CarLabelsTotal"></div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import MTable from '../../components/MTable.vue'
import MDate from '../../components/MDate.vue'

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
      CarLabelsTB: ref(null),
      CarLabelsTBData: ref([]),
      CarLabelsTBHeaders: ref([
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
      CarLabelsTBDisplayColumns: ref([
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
      CarLabelsTBTotals: ref(['Count', '', '', '', '', '', '']),
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
        }.bind(this),
      )
  },
  methods: {
    GetCarLabelsData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      api
        .get('GetCarLabelsTransactions', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
            carLabelFrom: this.CarLabelsFromDate.Get(),
            carLabelTo: this.CarLabelsToDate.Get(),
          },
        })
        .then(response => {
          this.CarLabelsTBRowsCount = response.data.paginated_data.total
          this.CarLabelsTBData = response.data.paginated_data.data
          document.getElementById('CarLabelsTotal').innerHTML =
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

<style scoped>
#CarLabelsFromDate,
#CarLabelsToDate {
  max-width: 300px;
}
</style>

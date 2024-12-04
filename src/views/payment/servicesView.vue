<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessServicesTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate
        ref="ServicesFromDate"
        :Name="'ServicesFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="ServicesToDate"
        :Name="'ServicesToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>

    <MTable
      ref="ServicesTB"
      :MTableName="'ServicesTB'"
      :DataArray="ServicesTBData"
      :HeadersArray="ServicesTBHeaders"
      :TotalsArray="ServicesTBTotals"
      :DisplayColumnsArray="ServicesTBDisplayColumns"
      :GetDataFunction="GetServicesData"
      :RowsCount="ServicesTBRowsCount"
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
      <div class="MlabelNumber" id="ServicesTotal"></div>
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
      ServicesTB: ref(null),
      ServicesTBData: ref([]),
      ServicesTBHeaders: ref([
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
      ServicesTBDisplayColumns: ref([
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
      ServicesTBTotals: ref(['Count', '', '', '', '', '', '']),
      ServicesTBRowsCount: ref(0),
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
    GetServicesData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      api
        .get('GetServicesTransactions', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
            serviceFrom: this.ServicesFromDate.Get(),
            serviceTo: this.ServicesToDate.Get(),
          },
        })
        .then(response => {
          this.ServicesTBRowsCount = response.data.paginated_data.total
          this.ServicesTBData = response.data.paginated_data.data
          document.getElementById('ServicesTotal').innerHTML =
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
#ServicesFromDate,
#ServicesToDate {
  max-width: 300px;
}
</style>

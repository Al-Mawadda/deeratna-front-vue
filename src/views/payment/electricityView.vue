<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="GetSuccessElectricitysTransactionsBTN">
      عرض البيانات
    </div>
    <div class="MGroup">
      <MDate
        ref="ElectricitysFromDate"
        :Name="'ElectricitysFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="ElectricitysToDate"
        :Name="'ElectricitysToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>

    <MTable
      ref="ElectricitysTB"
      :MTableName="'ElectricitysTB'"
      :DataArray="ElectricitysTBData"
      :HeadersArray="ElectricitysTBHeaders"
      :TotalsArray="ElectricitysTBTotals"
      :DisplayColumnsArray="ElectricitysTBDisplayColumns"
      :GetDataFunction="GetElectricitysData"
      :RowsCount="ElectricitysTBRowsCount"
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
      <div class="MlabelNumber" id="ElectricitysTotal"></div>
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
      ElectricitysTB: ref(null),
      ElectricitysTBData: ref([]),
      ElectricitysTBHeaders: ref([
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
      ElectricitysTBDisplayColumns: ref([
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
      ElectricitysTBTotals: ref(['Count', '', '', '', '', '', '']),
      ElectricitysTBRowsCount: ref(0),
      ElectricitysFromDate: ref(null),
      ElectricitysToDate: ref(null),
    }
  },
  mounted() {
    this.ElectricitysTB.LoadMTable()
    document
      .getElementById('GetSuccessElectricitysTransactionsBTN')
      .addEventListener(
        'click',
        function () {
          this.ElectricitysTB.LoadMTable()
        }.bind(this),
      )
  },
  methods: {
    GetElectricitysData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      api
        .get('GetElectricityTransactions', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
            electricityFrom: this.ElectricitysFromDate.Get(),
            electricityTo: this.ElectricitysToDate.Get(),
          },
        })
        .then(response => {
          this.ElectricitysTBRowsCount = response.data.paginated_data.total
          this.ElectricitysTBData = response.data.paginated_data.data
          document.getElementById('ElectricitysTotal').innerHTML =
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
#ElectricitysFromDate,
#ElectricitysToDate {
  max-width: 300px;
}
</style>

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
      :Name="'ElectricitysTB'"
      :DataArray="ElectricitysTBData"
      :Columns="ElectricitysTBColumns"
      :Sums="ElectricitysTBSums"
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
  </div>
</template>
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { ShowMessage } from '@/MJS.js'
import { useGlobalsStore } from '../../stores/Globals.js'

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())

    return {
      ElectricitysTB: ref(null),
      ElectricitysTBData: ref([]),
      ElectricitysTBColumns: [
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
          name: 'pid',
          label: 'رمز الشخص',
        },
        {
          name: 'name',
          label: 'اسم الشخص',
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
      ElectricitysTBSums: ref([]),

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
          this.ElectricitysTB.ReLoadMTable()
        }.bind(this)
      )
  },
  methods: {
    GetElectricitysData(MTable) {
      api
        .get('GetElectricityTransactions', {
          params: {
            MTable: MTable,
            electricityFrom: this.ElectricitysFromDate.Get(),
            electricityTo: this.ElectricitysToDate.Get(),
          },
        })
        .then(response => {
          this.ElectricitysTBData = response.data.data
          this.ElectricitysTBRowsCount = response.data.total
          this.ElectricitysTBSums = response.data.sums
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

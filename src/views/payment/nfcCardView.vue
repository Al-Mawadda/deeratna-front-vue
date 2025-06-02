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
      :Name="'NfcCardsTB'"
      :DataArray="NfcCardsTBData"
      :Columns="NfcCardsTBColumns"
      :Sums="NfcCardsTBSums"
      :GetDataFunction="GetNfcCardsData"
      :RowsCount="NfcCardsTBRowsCount"
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
      NfcCardsTB: ref(null),
      NfcCardsTBData: ref([]),
      NfcCardsTBColumns: [
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
      NfcCardsTBSums: ref([]),

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
        }.bind(this)
      )
  },
  methods: {
    GetNfcCardsData(MTable) {
      api
        .get('GetNfcCardsTransactions', {
          params: {
            MTable: MTable,
            nfcCardFrom: this.NfcCardsFromDate.Get(),
            nfcCardTo: this.NfcCardsToDate.Get(),
          },
        })
        .then(response => {
          this.NfcCardsTBData = response.data.data
          this.NfcCardsTBRowsCount = response.data.total
          this.NfcCardsTBSums = response.data.sums
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

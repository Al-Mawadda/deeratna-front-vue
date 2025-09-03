<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="ReloadNFCCardsLogBTN">اعادة تحميل البيانات</div>
    <div class="MGroup">
      <MDate ref="NFCCardsDate" :Name="'NFCCardsDate'" :Label="'التاريخ'" :Range="true" :Clearable="true"></MDate>
      <div class="MButton" id="GetNFCCardsLogDataBTN">عرض البيانات</div>
    </div>

    <MTable ref="NFCCardsLogTB" :Name="'NFCCardsLogTB'" :DataArray="NFCCardsLogTBData" :Columns="NFCCardsLogTBColumns"
      :GetDataFunction="GetNFCCardsLogData" :RowsCount="NFCCardsLogTBRowsCount" :RowsPerPage="10">
    </MTable>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue';
import { api } from '../../axios';
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore());

    return {
      GlobalsStore,
      NFCCardsLogTB: ref(null),
      NFCCardsLogTBData: ref([]),
      NFCCardsDate: ref(null),
      NFCCardsLogTBColumns: [
        {
          name: 'pid',
          label: 'الرمز',
        },
        {
          name: 'name',
          label: 'الاسم',
        },
        {
          name: 'relations.compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'relations.address',
          label: 'العنوان',
        },
        {
          name: 'relations.relation',
          label: 'العلاقة',
        },
        {
          name: 'card_status',
          label: 'الحالة',
        },
        {
          name: 'card_notes',
          label: 'الملاحظات',
        },
        {
          name: 'attributes.attribute',
          label: 'الصفة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Attributes || [],
        },
        {
          name: 'action_type',
          label: 'العملية',
          filter: 'combo',
          filter_items: ['EDIT', 'ADD', 'DELETE'],
        },
        {
          name: 'action_date',
          label: 'التاريخ',
          filter: 'date',
        },
        {
          name: 'action_time',
          label: 'الوقت',
        },
      ],
      NFCCardsLogTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.NFCCardsLogTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadNFCCardsLogBTN').addEventListener('click', function () {
      Instance.NFCCardsLogTB.ReLoadMTable();
    });
    document.getElementById('GetNFCCardsLogDataBTN').addEventListener('click', function () {
      Instance.NFCCardsLogTB.LoadMTable();
    });
  },
  methods: {
    GetNFCCardsLogData(MTable) {
      api
        .get('GetNFCCardsLogData', {
          params: {
            RangeDates: this.NFCCardsDate.Get(),
            MTable: MTable,
          },
        })
        .then(response => {
          this.NFCCardsLogTBData = response.data.data
          this.NFCCardsLogTBRowsCount = response.data.total
        })
        .catch(error => {
          window.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>
<style scoped>
#NFCCardsDate {
  max-width: 300px;
}
</style>

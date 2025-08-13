<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="ReloadAutoUpdatesLogBTN">اعادة تحميل البيانات</div>
    <MTable ref="AutoUpdatesLogTB" :Name="'AutoUpdatesLogTB'" :DataArray="AutoUpdatesLogTBData"
      :Columns="AutoUpdatesLogTBColumns" :GetDataFunction="GetAutoUpdatesLogData" :RowsCount="AutoUpdatesLogTBRowsCount"
      :RowsPerPage="10">
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
      AutoUpdatesLogTB: ref(null),
      AutoUpdatesLogTBData: ref([]),
      AutoUpdatesLogTBColumns: [
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
          name: 'houseno',
          label: 'العنوان',
        },
        {
          name: 'buyername',
          label: 'اسم المشتري',
        },
        {
          name: 'buyerphone',
          label: 'رقم هاتف المشتري',
        },
        {
          name: 'realname',
          label: 'اسم الساكن',
        },
        {
          name: 'realnamephone',
          label: 'رقم هاتف الساكن',
        },
        {
          name: 'housestate',
          label: 'حالة السكن',
        },
        {
          name: 'sendfrom',
          label: 'القسم',
        },
        {
          name: 'actionname',
          label: 'العملية',
        },
        {
          name: 'execution',
          label: 'التنفيذ',
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
      AutoUpdatesLogTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.AutoUpdatesLogTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadAutoUpdatesLogBTN').addEventListener('click', function () {
      Instance.AutoUpdatesLogTB.ReLoadMTable();
    });
  },
  methods: {
    GetAutoUpdatesLogData(MTable) {
      api
        .get('GetAutoUpdatesLogData', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.AutoUpdatesLogTBData = response.data.data
          this.AutoUpdatesLogTBRowsCount = response.data.total
        })
        .catch(error => {
          window.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

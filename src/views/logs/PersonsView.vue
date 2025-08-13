<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="ReloadPersonsLogBTN">اعادة تحميل البيانات</div>
    <MTable ref="PersonsLogTB" :Name="'PersonsLogTB'" :DataArray="PersonsLogTBData" :Columns="PersonsLogTBColumns"
      :GetDataFunction="GetPersonsLogData" :RowsCount="PersonsLogTBRowsCount" :RowsPerPage="10">
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
      PersonsLogTB: ref(null),
      PersonsLogTBData: ref([]),
      PersonsLogTBColumns: [
        {
          name: 'id',
          label: '#',
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
          label: 'المدينة',
        },
        {
          name: 'phone',
          label: 'رقم الهاتف',
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
          filter_items: ['EDIT','ADD','DELETE'],
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
      PersonsLogTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.PersonsLogTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadPersonsLogBTN').addEventListener('click', function () {
      Instance.PersonsLogTB.ReLoadMTable();
    });
  },
  methods: {
    GetPersonsLogData(MTable) {
      api
        .get('GetPersonsLogData', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.PersonsLogTBData = response.data.data
          this.PersonsLogTBRowsCount = response.data.total
        })
        .catch(error => {
          window.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

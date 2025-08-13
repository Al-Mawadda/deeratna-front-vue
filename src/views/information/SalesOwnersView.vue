<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="ReloadOwnersBTN">اعادة تحميل البيانات</div>
    <MTable ref="OwnersTB" :Name="'OwnersTB'" :DataArray="OwnersTBData" :Columns="OwnersTBColumns"
      :GetDataFunction="GetOwnersData" :RowsCount="OwnersTBRowsCount" :RowsPerPage="10">
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
      OwnersTB: ref(null),
      OwnersTBData: ref([]),
      OwnersTBColumns: [
        {
          name: 'BuyerName',
          label: 'الاسم',
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
          name: 'phone',
          label: 'رقم الهاتف',
        },

      ],
      OwnersTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.OwnersTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadOwnersBTN').addEventListener('click', function () {
      Instance.OwnersTB.ReLoadMTable();
    });
  },
  methods: {
    GetOwnersData(MTable) {
      api
        .get('GetSalesOwners', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.OwnersTBData = response.data.data
          this.OwnersTBRowsCount = response.data.total
        })
        .catch(error => {
          window.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

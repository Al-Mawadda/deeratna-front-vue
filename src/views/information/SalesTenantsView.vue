<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="ReloadTenantsBTN">اعادة تحميل البيانات</div>
    <MTable ref="TenantsTB" :Name="'TenantsTB'" :DataArray="TenantsTBData" :Columns="TenantsTBColumns"
      :GetDataFunction="GetTenantsData" :RowsCount="TenantsTBRowsCount" :RowsPerPage="10">
    </MTable>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore());

    return {
      GlobalsStore,
      TenantsTB: ref(null),
      TenantsTBData: ref([]),
      TenantsTBColumns: [
        {
          name: 'TenantName',
          label: 'الاسم',
        },
        {
          name: 'Compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'houseno',
          label: 'العنوان',
        },
        {
          name: 'TenantPhone',
          label: 'رقم الهاتف',
        },
        {
          name: 'EjarFrom',
          label: 'الايجار من',
          filter: 'date',
        },
        {
          name: 'EjarTo',
          label: 'الايجار الى',
          filter: 'date',
        },
      ],
      TenantsTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.TenantsTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadTenantsBTN').addEventListener('click', function () {
      Instance.TenantsTB.ReLoadMTable();
    });
  },
  methods: {
    GetTenantsData(MTable) {
      api
        .get('GetSalesTenants', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.TenantsTBData = response.data.data
          this.TenantsTBRowsCount = response.data.total
        })
        .catch(error => {
          window.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>
<style scoped>
.MField,
.MDate {
  min-width: 200px;
}

.SalesTenantName {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
}
</style>

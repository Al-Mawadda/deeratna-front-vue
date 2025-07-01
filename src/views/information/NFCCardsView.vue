<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="ReloadNFCCardsBTN">اعادة تحميل البيانات</div>
    <MTable ref="NFCCardsTB" :Name="'NFCCardsTB'" :DataArray="NFCCardsTBData" :Columns="NFCCardsTBColumns"
      :Sums="NFCCardsTBSums" :GetDataFunction="GetNFCCardsData" :RowsCount="NFCCardsTBRowsCount" :RowsPerPage="10">
    </MTable>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    const authStore = useAuthStore()
    const GlobalsStore = ref(useGlobalsStore());
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)

    return {
      GlobalsStore,

      hasPermission,
      NFCCardsTB: ref(null),
      NFCCardsTBData: ref([]),
      NFCCardsTBColumns: [
        {
          name: 'pid',
          label: 'رمز الشخص',
        },
        {
          name: 'persons.name',
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
          name: 'nfc_id',
          label: 'رمز البطاقة',
        },
        {
          name: 'card_expire',
          label: 'تاريخ الصلاحية',
        },
        {
          name: 'card_status',
          label: 'حالة البطاقة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.NFCCardStatus || [],
        },
      ],
      NFCCardsTBSums: ref([]),
      NFCCardsTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.NFCCardsTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadNFCCardsBTN').addEventListener('click', function () {
      Instance.NFCCardsTB.ReLoadMTable();
    });
  },
  methods: {
    GetNFCCardsData(MTable) {
      api
        .get('GetNFCCardsData', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.NFCCardsTBData = response.data.data
          this.NFCCardsTBRowsCount = response.data.total
          this.NFCCardsTBSums = response.data.sums
        })
        .catch(error => {
          window.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

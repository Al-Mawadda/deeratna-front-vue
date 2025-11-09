<template>
  <div class="ComponentWrapper">
    <div class="MButton" id="ReloadCarLabelsBTN">اعادة تحميل البيانات</div>
    <MTable ref="CarLabelsTB" :Name="'CarLabelsTB'" :DataArray="CarLabelsTBData" :Columns="CarLabelsTBColumns"
      :GetDataFunction="GetCarLabelsData" :RowsCount="CarLabelsTBRowsCount" :RowsPerPage="10">
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
      CarLabelsTB: ref(null),
      CarLabelsTBData: ref([]),
      CarLabelsTBColumns: [
        {
          name: 'pid',
          label: '#',
        },
        {
          name: 'name',
          label: 'الاسم',
        },
        {
          name: 'real_estates.compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'real_estates.address',
          label: 'العنوان',
        },
        {
          name: 'label_code',
          label: 'رمز الملصق',
        },
        {
          name: 'number',
          label: 'رقم العجلة',
        },
        {
          name: 'details',
          label: 'تفاصيل العجلة',
        },
        {
          name: 'label_status',
          label: 'الحالة',
        },
        {
          name: 'label_expire',
          label: 'تاريخ الانتهاء',
        },
        {
          name: 'phone',
          label: 'رقم الهاتف',
        },
        {
          name: 'label_suspension_reason',
          label: 'سبب التوقف',
        },
        {
          name: 'attributes.attribute',
          label: 'الصفة',
        },
      ],
      CarLabelsTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.CarLabelsTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadCarLabelsBTN').addEventListener('click', function () {
      Instance.CarLabelsTB.ReLoadMTable();
    });
  },
  methods: {
    GetCarLabelsData(MTable) {
      api
        .get('GetCarLabelsData', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.CarLabelsTBData = response.data.data
          this.CarLabelsTBRowsCount = response.data.total
        })
        .catch(error => {
          window.ShowMessage('حدث خطا', error)
        })
    },
  },
}
</script>

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
import { useAuthStore } from '../../stores/auth';
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

      CarLabelsTB: ref(null),
      CarLabelsTBData: ref([]),
      CarLabelsTBColumns: [
        {
          name: 'userId',
          label: '#',
        },
        {
          name: 'userName',
          label: 'الاسم',
        },
        {
          name: 'cityName',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'address',
          label: 'العنوان',
        },
        {
          name: 'cardNumber',
          label: 'رقم الملصق',
        },
        {
          name: 'carNum',
          label: 'رقم العجلة',
        },
        {
          name: 'carDet',
          label: 'تفاصيل العجلة',
        },
        {
          name: 'objectt',
          label: 'الصفة',
        },
        {
          name: 'privilege',
          label: 'الصلاحية',
        },
                {
          name: 'issDate',
          label: 'تاريخ الانشاء',
        },
                {
          name: 'expireDate',
          label: 'تاريخ الانتهاء',
        },
        {
          name: 'phoneNum',
          label: 'رقم الهاتف',
        },
        {
          name: 'reson',
          label: 'سبب التوقف',
        },
        {
          name: 'note',
          label: 'الملاحظات',
        },
        {
          name: 'noteSp',
          label: 'الملاحظات الخاصة',
        },
        {
          name: 'isDelete',
          label: 'محذوف',
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

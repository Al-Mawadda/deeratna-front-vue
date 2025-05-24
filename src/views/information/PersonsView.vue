<template>
  <div class="ComponentWrapper">
    <RouterLink to="/persons/add" class="MButton" id="AddPersonBTN">اضافة شخص</RouterLink>
    <div class="MButton" id="ReloadPersonsBTN">اعادة تحميل البيانات</div>
    <MTable ref="PersonsTB" :Name="'PersonsTB'" :DataArray="PersonsTBData" :Columns="PersonsTBColumns"
      :Sums="PersonsTBSums" :GetDataFunction="GetPersonsData" :RowsCount="PersonsTBRowsCount" :RowsPerPage="10">
      <template v-slot:options>
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="M500.2,249.6c124.1,1.1,233.2,42.7,328.2,122.1c39.6,33,72.3,72.7,106.8,110.6c9,9.9,8.7,25.5-0.8,36.4
  c-53.9,62.1-109.3,122.5-182.1,163.7c-66,37.4-136.2,60.8-212,66.4C399.6,759.2,276.4,716.6,169,626.3
  C130.9,594.3,99.2,556,66,519.3c-10-11-10.5-26-0.9-37.1c53.3-61.5,107.9-121.4,179.6-162.7c66.8-38.5,138-62.1,215.1-68.3
  C473.2,250.2,486.7,250.1,500.2,249.6z M504.7,308.1c-19.4,0.8-34.9,0.7-50.4,2.2c-61.5,6.1-119,24.8-173,54.6
  c-59.2,32.7-106.2,79.4-150.3,129.6c-4.1,4.7-3.1,8.1,0.7,12.1c21.3,22.2,40.9,45.9,63.9,66.5c86.2,77.3,186.4,118.2,302.7,118.9
  c68.3,0.4,133-14.2,194.7-43.2c70.8-33.3,126.2-85.4,176.6-143.7c4-4.6,2-7.9-1.3-11.3c-21.3-22.2-40.9-45.9-63.8-66.6
  C718.1,349.4,617.3,308.9,504.7,308.1z" />
              <path d="M392.3,499.7c0.2-59,49.3-108.3,108.1-107.4c60.6,0.9,107.4,47.4,107.2,108c-0.2,60.9-47.5,106.9-107.8,107.4
  C440.8,608.1,392.1,558.6,392.3,499.7z M500.2,556.5c30.5,0,56.4-25.9,56.4-56.4c0-30.6-25.7-56.5-56.2-56.6
  c-31-0.1-56.9,25.8-56.8,56.8C443.8,530.8,469.7,556.6,500.2,556.5z" />
            </svg>
          </div>
          <div class="MTableOptionName">عرض</div>
        </div>
      </template>
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
      Birth: ref(null),
      identificationIssuingDate: ref(null),
      ContractDate: ref(null),
      SaleDate: ref(null),

      PersonsTB: ref(null),
      PersonsTBData: ref([]),
      PersonsTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'name',
          label: 'الاسم',
        },
        {
          name: 'identification_type',
          label: 'نوع المستمسك',
        },
        {
          name: 'identification_number',
          label: 'رقم المستمسك',
        },
        {
          name: 'car_number',
          label: 'رقم العجلة',
        },
        {
          name: 'phone',
          label: 'رقم الهاتف',
        },
        {
          name: 'relations.compound',
          label: 'مدينة الساكن',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'relations.address',
          label: 'عنوان الساكن',
        },
        {
          name: 'address',
          label: 'العنوان',
        },
        {
          name: 'study',
          label: 'التحصيل الدراسي',
        },
        {
          name: 'relations.guardian_name',
          label: 'اسم صاحب العقار',
        },
        {
          name: 'attributes.attribute',
          label: 'الصفة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Attributes || [],
        }
      ],
      PersonsTBSums: ref([]),
      PersonsTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.PersonsTB.LoadMTable()

    let Instance = this;

    document.getElementById('ReloadPersonsBTN').addEventListener('click', function () {
      Instance.PersonsTB.LoadMTable();
    });
    document.getElementById('PersonsTB').addEventListener('ViewItem', function (data) {
      Instance.GlobalsStore.setMArray(data.detail.RowData);
      Instance.$router.push({ name: 'EditPerson' });
    });
  },
  methods: {
    GetPersonsData(MTable) {
      api
        .get('GetPersonsData', {
          params: {
            MTable: MTable,
          },
        })
        .then(response => {
          this.PersonsTBData = response.data.data
          this.PersonsTBRowsCount = response.data.total
          this.PersonsTBSums = response.data.sums
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
</style>

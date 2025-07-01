<template>
  <div class="ComponentWrapper">
<div class="MGroup">
        <MComboBox ref='Compound' :Name="'Compound'" :Label="'المدينة'"
          :Items="CompoundItems"></MComboBox>
          <div class="MField" id="Address">
          <input type="text" required>
          <label>العنوان</label>
          <div class="MFieldBG"></div>
        </div>
              <div class="MButton" id="GetSalesTenant" @click="GetSalesTenant">عرض</div>
              <div class="SalesTenantName"></div>
  </div>
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
Compound: ref(null),
CompoundItems: ref([]),
    }
  },
  mounted() {
this.CompoundItems = this.GlobalsStore.ComboBoxes['Compounds'];
  },
  methods: {
    GetSalesTenant() {
      document.querySelector('.SalesTenantName').innerHTML = '';
      api
        .get('GetSalesTenant', {
          params: {
            compound: this.Compound.GetValue(),
            address: document.getElementById('Address').querySelector('input').value,
          },
        })
        .then(response => {
          document.querySelector('.SalesTenantName').innerHTML = response.data;
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
  width:100%;
  justify-content: center;
  margin-top: 20px;
}
</style>

<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div class="MGroupTitle">معلومات العقار</div>
      <div class="MField" id="ID">
        <input disabled type="text" required>
        <label>الرمز</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox ref='Compound' :Name="'Compound'" :Label="'المدينة'" :Items="CompoundItems"></MComboBox>
      <div class="MField" id="Address">
        <input type="text" required>
        <label>العنوان</label>
        <div class="MFieldBG"></div>
      </div>
    </div>
    <div class="ComponentButtons">
      <div class="MButton" id="SaveBTN" @click="Save">حفظ</div>
      <div class="MButton" id="DeleteBTN" @click="Delete">حذف</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from '../../axios.js';
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore());

    return {
      GlobalsStore,
      ID: ref(0),
      Compound: ref(null),
      CompoundItems: ref([]),
    };
  },
  mounted() {
    this.CompoundItems = this.GlobalsStore.ComboBoxes['Compounds'];
    this.ComponentLoad();
  },
  methods: {
    ComponentLoad() {
      document.querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      if (this.$route.meta.Operation == 'ADD') {
        document.getElementById('ID').style.display = 'none';
        document.getElementById('DeleteBTN').style.display = 'none';
      }

      if (this.$route.meta.Operation == 'EDIT') {
        this.ID = this.GlobalsStore.MArray['id'];
        document.getElementById('ID').style.display = 'flex';
        document.getElementById('DeleteBTN').style.display = 'flex';

        document.getElementById('ID').querySelector('input').value = this.GlobalsStore.MArray['id'];
        this.Compound.Set(this.GlobalsStore.MArray['compound']);
        document.getElementById('Address').querySelector('input').value = this.GlobalsStore.MArray['address'];
      }
    },
    Save() {
      window.ShowLoading();

      var Operation = this.$route.meta.Operation;

      var Parameters = new FormData();

      Parameters.append('id', this.ID);      
      Parameters.append('compound', this.Compound.GetValue());
      Parameters.append('address', document.getElementById('Address').querySelector('input').value);

      if (Operation == 'ADD') {
        api.post('AddRealEstate', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            window.HideLoading();
            this.$router.push({ name: 'RealEstates' });
          } else {
            window.HideLoading();
            window.ShowMessage(response.data);
          }
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }

      if (Operation == 'EDIT') {
        api.post('EditRealEstate', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            window.HideLoading();
            this.$router.push({ name: 'RealEstates' });
          } else {
            window.HideLoading();
            window.ShowMessage(response.data);
          }
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }
    },
    Delete() {
      var YesFunction = function () {
        window.ShowLoading();
        api.post("DeleteRealEstate", null, {
          params: {
            id: this.ID,
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            this.$router.push({ name: 'RealEstates' });
            window.HideChoose();
          } else {
            window.HideChoose();
            window.ShowMessage(response.data);
          }
          window.HideLoading();
        }).catch(error => {
          window.HideChoose();
          window.HideLoading();
          window.ShowMessage(error);
        });
      }.bind(this);
      var NoFunction = function () {
        window.HideChoose();
      }
      window.ShowChoose('هل انت متاكد من عملية الحذف؟', YesFunction, NoFunction);
    },
  }
}
</script>

<style scoped>
#DeleteBTN {
  background-color: red;
}

#DeleteBTN:hover {
  background-color: var(--MButtonBG);
  color: red;
}
</style>

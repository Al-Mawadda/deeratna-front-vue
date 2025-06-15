<template>
  <div class="ComponentWrapper">
    <RouterLink to="/camps/contractors/add" class="MButton" id="AddContractorBTN">اضافة متعهد</RouterLink>
    <div class="MButton" id="ReloadContractorsBTN">اعادة تحميل البيانات</div>
    <MTable ref="ContractorsTB" :Name="'ContractorsTB'" :DataArray="ContractorsTBData" :Columns="ContractorsTBColumns"
      :Sums="ContractorsTBSums" :GetDataFunction="GetContractors" :RowsCount="ContractorsTBRowsCount" :RowsPerPage="10">
      <template v-slot:options>
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon"><svg viewBox="0 0 1000 1000">
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
            </svg></div>
          <div class="MTableOptionName">عرض</div>
        </div>
        <div class="MTableOption" OptionEventName="DeleteItem">
          <div class="MTableOptionIcon"><svg viewBox="0 0 1000 1000">
              <path
                d="M906.1,242.4c-4.5-16.8-18.9-26-40.5-26c-89.9,0-179.8,0-269.8,0l-103.4,0v-0.2l-70.2,0c-65.9,0-131.8,0-197.8,0
	c-6.8,0-13.5,0-20.3,0c-24.2,0-49.1,0-73.7,0.3c-12.9,0.2-24.3,5.5-31.2,14.5c-6.3,8.3-8.3,18.8-5.5,29.6
	c4.1,16,18.4,26.1,37.3,26.4c14.2,0.2,28.7,0.1,42.7,0.1c5.9,0,11.9,0,17.8,0c0.8,0,1.6,0,2.5,0c8.9,0,14.2,0,18.3,4.2
	c4,4.1,4,9.5,4,18.4l0,149.7c0,103.7,0,207.3,0,311c0,13,0.4,23.9,1.2,34.2c6.4,79,75.7,143.7,154.5,144.2
	c68.3,0.4,137.8,0.3,205,0.2c17,0,34-0.1,51-0.1c15.5,0,31.3-2.8,46.9-8.3c67-23.6,108.6-82.9,108.7-154.7
	c0.1-108.3,0.1-218.5,0.1-325c0-51,0-102.1,0-153.1c0-7.7,0-12.8,3.8-16.7c3.8-3.9,8.9-3.9,16.6-3.9c7.3,0,14.8,0,22,0.1
	c14.4,0.1,29.3,0.1,43.8-0.2c12.9-0.3,24.2-5.7,31-14.8C907.1,263.7,909,253.1,906.1,242.4z M686.4,852.8
	c-17.2,17.3-40.4,26.5-67.2,26.5c0,0,0,0,0,0c-23.8,0-47.6,0-71.5,0c-22.7,0-45.7,0-68.9,0c-32.7,0-65.6,0-98.2-0.1
	c-46.8-0.1-82.1-27.4-92.1-71.2c-1.7-7.4-1.6-14.6-1.6-21.5c0-1.1,0-2.2,0-3.3c0-60.2,0-120.3,0-180.5l0-51.2l0-58.7
	c0-61.5,0-123.1,0-184.6c0-7.9,0-13.1,3.9-17c3.9-3.9,8.8-3.9,17-3.9c128,0,256,0,383.9,0c8.2,0,13.2,0,17,3.8
	c3.9,3.9,3.9,9.1,3.9,17c0,44.2,0,89.1-0.1,132.6c-0.1,112.9-0.2,229.6,0.5,344.4C713.5,810.7,703.7,835.4,686.4,852.8z" />
              <path class="st1" d="M712.8,440.7c0-43.4,0.1-88.4,0.1-132.6c0-7.9,0-13.1-3.9-17c-3.9-3.8-8.8-3.8-17-3.8c-128,0-256,0-383.9,0
	c-8.2,0-13.1,0-17,3.9c-3.9,3.9-3.9,9.1-3.9,17c0,61.5,0,123.1,0,184.6l0,58.7l0,51.2c0,60.2,0,120.3,0,180.5c0,1.1,0,2.2,0,3.3
	c0,6.9-0.1,14.1,1.6,21.5c10,43.8,45.2,71.1,92.1,71.2c32.6,0.1,65.5,0.1,98.2,0.1c23.2,0,46.2,0,68.9,0c23.8,0,47.6,0,71.5,0
	c0,0,0,0,0,0c26.8,0,50-9.1,67.2-26.5c17.3-17.4,27.1-42.1,26.9-67.8C712.6,670.3,712.7,553.5,712.8,440.7z M619.3,864.3
	c-23.8,0-47.6,0-71.5,0c-54.7,0-111.3,0.1-167-0.1c-40.1-0.1-69-22.4-77.5-59.5c-1.3-5.7-1.3-11.7-1.2-18.1c0-1.1,0-2.3,0-3.4
	c0-60.2,0-120.3,0-180.5l0-51.2l0-58.7c0-61.5,0-123.1,0-184.6c0-2,0-4.2,0.1-5.8c1.6-0.1,3.8-0.1,5.9-0.1c128,0,256,0,383.9,0
	c2.1,0,4.3,0,5.9,0.1c0.1,1.5,0.1,3.7,0.1,5.7c0,44.2,0,89.1-0.1,132.5c-0.1,112.9-0.2,229.7,0.5,344.5c0.1,21.7-8.1,42.5-22.5,57.1
	C661.5,856.6,641.9,864.3,619.3,864.3z" />
              <path d="M382.7,86.6c0.1,19.9,14.7,33.9,35.5,34c18.8,0.1,38,0.1,56.5,0c8.3,0,16.6,0,24.9,0c8.1,0,16.3,0,24.4,0c18.7,0,38,0,57,0
	c21.6-0.1,36.2-13.8,36.2-34.2c0.1-20.4-14.9-35.2-35.5-35.3C553.9,51,526.4,51,499.4,51c-27.8,0-55,0.1-81.4,0.2
	c-10,0-19.1,3.6-25.5,10.1C386.1,67.7,382.6,76.7,382.7,86.6z" />
              <path d="M535.3,423.2c0-4.8-0.5-9.4-1.4-13.8c-3.5-16-17.1-26.7-33.9-26.7c0,0,0,0-0.1,0c-16.9,0-30.2,10.6-33.9,27
	c-1.2,5.4-1.4,10.9-1.4,15.7c0,40.2,0,80.4,0,120.6l0,70.1c0,40.4,0,82.2,0.1,123.3c0,5.8,0.4,10.7,1.2,15c3,16,14.4,26.5,31.4,28.8
	c12.7,1.7,27.5-6.7,33.8-19.1c3-5.9,4.3-12.7,4.3-22l0-84.7C535.4,580.7,535.4,501.3,535.3,423.2z" />
            </svg></div>
          <div class="MTableOptionName">حذف</div>
        </div>
      </template>
    </MTable>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from '../../axios.js';
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    return {
      GlobalsStore: ref(useGlobalsStore()),

      ContractorsTB: ref(null),
      ContractorsTBData: ref([]),
      ContractorsTBColumns: [
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
          name: 'phone',
          label: 'رقم الهاتف',
        },
        {
          name: 'camps.camp_full_name',
          label: 'الكمبات',
        }
      ],
      ContractorsTBSums: ref([]),
      ContractorsTBRowsCount: ref(0),
    };
  },
  mounted() {
    this.ContractorsTB.LoadMTable();

    document.getElementById('ReloadContractorsBTN').addEventListener('click', function () {
      this.ContractorsTB.ReLoadMTable();
    }.bind(this));
    document.getElementById('ContractorsTB').addEventListener('ViewItem', function (data) {
      this.GlobalsStore.setMArray(data.detail.RowData);
      this.$router.push({ name: 'EditCampsContractor' });
    }.bind(this));
    document.getElementById('ContractorsTB').addEventListener('DeleteItem', function (data) {

      var YesFunction = function () {
        window.ShowLoading();

        api.post("DeleteContractor", null, {
          params: {
            id: data.detail.RowData['id'],
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            this.ContractorsTB.LoadMTable();
            window.HideLoading();
            window.HideChoose();
          } else {
            window.HideChoose();
            window.HideLoading();
            window.ShowMessage(response.data);
          }
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
    }.bind(this));
  },
  methods: {
    GetContractors(MTable) {
      api.get('GetContractors', {
        params: {
          MTable: MTable,
        }
      }).then(response => {
        this.ContractorsTBData = response.data.data
        this.ContractorsTBRowsCount = response.data.total
        this.ContractorsTBSums = response.data.sums
      }).catch(error => {
        window.ShowMessage('حدث خطا', error);
      });
    },
  }
}
</script>

<style scoped></style>

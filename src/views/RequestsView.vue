<template>
  <div class="ComponentWrapper">
    <RouterLink to="/videos/add" class="MButton" id="AddVideoBTN">
      اضافة فيديو
    </RouterLink>
    <div class="MButton" id="ReloadVideosBTN">اعادة تحميل الفيديوات</div>
    <MTable
      ref="VideosTB"
      :MTableName="'VideosTB'"
      :DataArray="VideosTBData"
      :HeadersArray="VideosTBHeaders"
      :TotalsArray="VideosTBTotals"
      :DisplayColumnsArray="VideosTBDisplayColumns"
      :GetDataFunction="GetVideosData"
      :RowsCount="VideosTBRowsCount"
      :RowsPerPage="10"
    >
      <template v-slot:options>
        <!-- View Video Option -->
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="..."></path>
            </svg>
          </div>
          <div class="MTableOptionName">عرض</div>
        </div>
        <!-- Delete Video Option -->
        <div class="MTableOption" OptionEventName="DeleteItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="..."></path>
            </svg>
          </div>
          <div class="MTableOptionName">حذف</div>
        </div>
      </template>
    </MTable>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from '../axios.js';
import { useGlobalsStore } from '../stores/Globals.js';
import MTable from '../components/MTable.vue';
import { ShowMessage, HideModal, ShowChooseModal } from '@/MJS.js';

export default {
  components: {
    MTable,
  },
  setup() {
    const GlobalsStore = ref(useGlobalsStore());
    const VideosTB = ref(null);
    const VideosTBData = ref([]);
    const VideosTBHeaders = ref(['#', 'اسم الفيديو', 'المجمع', 'الفيديو']);
    const VideosTBDisplayColumns = ref(['id', 'name', 'compound', 'video']);
    const VideosTBTotals = ref(['Count', '', '', '']);
    const VideosTBRowsCount = ref(0);


    const GetVideosData = (PageNo = 1, FilterArray = {}, SortArray = {}) => {
      axios
        .get('/main-slider-ads-get', {
          params: {
            PageNo,
            FilterArray,
            SortArray,
          },
        })
        .then((response) => {
          VideosTBRowsCount.value = response.data.total;
          VideosTBData.value = response.data.data.map((item) => ({
            id: item.id,
            name: item.name,
            compound: item.compound,
            video: item.images.length > 0 ? item.images[0].path : null,
          }));
        })
        .catch((error) => {
          ShowMessage('حدث خطأ', error.message);
        });
    };

    const DeleteVideo = (row) => {
      const YesFunction = () => {
        axios
          .delete(`/main-slider-ads-delete/${row.id}`)
          .then((response) => {
            if (response.data.success) {
              GetVideosData();
              HideModal(document.getElementById('ChooseModal'));
              ShowMessage('تم الحذف بنجاح');
            } else {
              ShowMessage(response.data.message);
            }
          })
          .catch((error) => {
            ShowMessage('فشل الحذف', error.message);
          });
      };

      const NoFunction = () => {
        HideModal(document.getElementById('ChooseModal'));
      };

      ShowChooseModal('هل انت متأكد من عملية الحذف؟', YesFunction, NoFunction);
    };

    return {
      GlobalsStore,
      VideosTB,
      VideosTBData,
      VideosTBHeaders,
      VideosTBDisplayColumns,
      VideosTBTotals,
      VideosTBRowsCount,
      GetVideosData,
    };
  },
  mounted() {
    this.VideosTB.LoadMTable();

    document.getElementById('ReloadVideosBTN').addEventListener(
      'click',
      function () {
        this.VideosTB.LoadMTable();
      }.bind(this)
    );

    document.getElementById('VideosTB').addEventListener(
      'ViewItem',
      function (data) {
        const SelectedRow = this.VideosTBData.find((item) => item.id === data.detail.RowID);
        this.GlobalsStore.setMArray(SelectedRow);
        this.$router.push({ name: 'EditVideo', params: { id: data.detail.RowID } });
      }.bind(this)
    );

    document.getElementById('VideosTB').addEventListener(
      'DeleteItem',
      function (data) {
        const SelectedRow = this.VideosTBData.find((item) => item.id === data.detail.RowID);
        this.DeleteVideo(SelectedRow);
      }.bind(this)
    );
  },
};
</script>

<style scoped>
.ComponentWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.MButton {
  margin-bottom: 16px;
}

.MTableOption {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.MTableOptionIcon {
  margin-right: 8px;
}
</style>

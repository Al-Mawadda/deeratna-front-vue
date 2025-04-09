<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <MDate
        ref="QrLogFromDate"
        :Name="'QrLogFromDate'"
        :Label="'التاريخ'"
        :Range="true"
        :Clearable="true"
      ></MDate>
    </div>
    <div class="MButton" id="GetQrLogDataBTN">عرض البيانات</div>
    <MTable
      ref="qrLogTB"
      :Name="'qrLogTB'"
      :DataArray="qrLogTBData"
      :Columns="qrLogTBColumns"
      :Sums="qrLogTBSums"
      :GetDataFunction="GetqrLogData"
      :RowsCount="qrLogTBRowsCount"
      :RowsPerPage="10"
    >
    </MTable>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue'
import axios from 'axios'
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())

    return {
      ID: ref(''),
      GlobalsStore: ref(useGlobalsStore()),
      QrLogFromDate: ref(null),
      qrLogTB: ref(null),
      qrLogTBData: ref([]),

      qrLogTBColumns: [
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'address',
          label: 'العنوان',
        },
        {
          name: 'name',
          label: 'اسم الساكن',
        },
        {
          name: 'visitor_name',
          label: 'اسم الزائر',
        },
        {
          name: 'phone',
          label: 'رقم الهاتف',
        },
        {
          name: 'period',
          label: 'مدة الزيارة',
        },
        {
          name: 'created_qr',
          label: 'وقت الانشاء',
        },
        {
          name: 'entry_date',
          label: 'وقت الدخول',
        },
        {
          name: 'out_date',
          label: 'وقت الخروج',
        },
        {
          name: 'gate_name',
          label: 'بوابة الدخول',
        },
        {
          name: 'img',
          label: 'صورة',
        },
      ],
      qrLogTBSums: ref([]),

      qrLogTBRowsCount: ref(0),
      qrLogFromDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: 'https://almawadda-online.com/qrcode/public/api/',
    }
  },
  mounted() {
    this.qrLogTB.LoadMTable()
    document.getElementById('GetQrLogDataBTN').addEventListener(
      'click',
      function () {
        ShowLoading()
        this.qrLogTB.LoadMTable()
        HideLoading()
      }.bind(this)
    )
  },
  methods: {
    GetqrLogData(MTable) {
      axios
        .get(this.ServerPath + 'qrlog-deeratna', {
          params: {
            MTable: MTable,
            QrLogFrom: this.QrLogFromDate.Get()[0],
            QrLogTo: this.QrLogFromDate.Get()[1],
          },
        })
        .then(response => {
          this.qrLogTBData = response.data.data
          this.qrLogTBRowsCount = response.data.total
          this.qrLogTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },
  },
}
</script>

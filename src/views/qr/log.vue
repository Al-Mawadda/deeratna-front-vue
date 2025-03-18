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
      :HeadersArray="qrLogTBHeaders"
      :TotalsArray="qrLogTBTotals"
      :DisplayColumnsArray="qrLogTBDisplayColumns"
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
    return {
      ID: ref(''),
      GlobalsStore: ref(useGlobalsStore()),
      QrLogFromDate: ref(null),
      qrLogTB: ref(null),
      qrLogTBData: ref([]),
      qrLogTBHeaders: ref([
        '#',
        'المجمع',
        'العنوان',
        'اسم الساكن',
        'اسم الزائر',
        'رقم الهاتف',
        'مدة الزيارة',
        'وقت الانشاء',
        'وقت الدخول',
        'وقت الخروج',
        'الصورة',
      ]),
      qrLogTBDisplayColumns: ref([
        'id',
        'compound',
        'address',
        'name',
        'visitor_name',
        'phone',
        'period',
        'created_qr',
        'entry_date',
        'out_date',
        'img',
      ]),
      qrLogTBTotals: ref(['Count', '', '', '', '', '', '', '', '', '', '', '']),
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
    GetqrLogData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      axios
        .get(this.ServerPath + 'qrlog-deeratna', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
            QrLogFrom: this.QrLogFromDate.Get()[0],
            QrLogTo: this.QrLogFromDate.Get()[1],
          },
        })
        .then(response => {
          this.qrLogTBRowsCount = response.data.total
          this.qrLogTBData = response.data.data
        })
        .catch(error => {
          ShowMessage(error)
        })
    },
  },
}
</script>

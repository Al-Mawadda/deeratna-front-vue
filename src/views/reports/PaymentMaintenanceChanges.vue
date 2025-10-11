<template>
  <div class="ComponentWrapper" dir="rtl">
    <!-- التاريخ -->
    <div class="MGroup">
      <MDate ref="ChangesFromDate" :Name="'ChangesFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true" />
    </div>

    <div class="MGroup">
      <div class="MButton" @click="handleFetch">عرض البيانات</div>
    </div>

    <div class="container">
      <!-- تحكم بحجم خط رؤوس الأعمدة -->
      <div class="controls">
        <div class="control-row">
          <label>حجم خط عناوين الأعمدة:</label>
          <input type="range" min="12" max="28" v-model.number="headerFontSize" />
          <span class="val">{{ headerFontSize }}px</span>
        </div>
      </div>

      <div class="buttons">
        <button class="btn" @click="exportPDF" :disabled="!rowsSorted.length">تصدير PDF</button>
        <button class="btn" @click="exportExcel" :disabled="!rowsSorted.length">تصدير الى اكسل</button>
        <button class="btn" @click="printAll" :disabled="!rowsSorted.length">طبـاعـــــة</button>
      </div>

      <div class="print-root" v-if="rowsSorted.length" ref="printRoot">
        <div class="pdf-section">
          <h2 class="title">{{ reportTitle }}</h2>

          <div class="table-wrapper">
            <table class="styled-table pivot" :style="tableVars">
              <thead>
                <tr>
                  <th class="head-cell city">المدينة</th>
                  <th class="head-cell">المبلغ المستلم</th>
                  <th class="head-cell">المبلغ المصروف</th>
                  <th class="head-cell">المبلغ الصافي</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in rowsSorted" :key="'row_' + idx">
                  <td class="city">{{ r.city }}</td>
                  <td>{{ formatCurrency(r.sum_received) }}</td>
                  <td>{{ formatCurrency(r.sum_spent) }}</td>
                  <td>{{ formatCurrency(r.net_amount) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="totals-row">
                  <th class="city">المجموع</th>
                  <th>{{ formatCurrency(totals.sum_received) }}</th>
                  <th>{{ formatCurrency(totals.sum_spent) }}</th>
                  <th>{{ formatCurrency(totals.net_amount) }}</th>
                </tr>
                <tr class="grand-row">
                  <th class="city">الإجمالي الكلي</th>
                  <th class="grand-amount" colspan="3">
                    {{ formatCurrency(grandTotal) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">لا توجد بيانات «تغييرات» للعرض. اختر تاريخاً ثم اضغط "عرض البيانات".</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { api } from '../../axios'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'MaintenanceChangesAmountsByCompound',
  data() {
    return {
      rows: [], // { city, sum_received, sum_spent, net_amount }
      headerFontSize: 16, // تحكم بحجم خط رؤوس الأعمدة
      cityPins: ['الامل 1', 'الامل 2', 'الامل 3', 'الامال'],
      loading: false,
      errorMsg: '',
    }
  },
  setup() {
    return { ChangesFromDate: ref(null), printRoot: ref(null) }
  },
  computed: {
    tableVars() {
      return { '--th-font-size': this.headerFontSize + 'px' }
    },

    rowsSorted() {
      const arr = Array.isArray(this.rows) ? [...this.rows] : []
      arr.sort((a, b) => {
        const ia = this.cityIndex(a.city),
          ib = this.cityIndex(b.city)
        if (ia !== ib) return ia - ib
        return (a.city || '').localeCompare(b.city || '', 'ar', { numeric: true, sensitivity: 'base' })
      })
      return arr
    },

    totals() {
      return this.rowsSorted.reduce(
        (acc, r) => {
          acc.sum_received += Number(r.sum_received || 0)
          acc.sum_spent += Number(r.sum_spent || 0)
          acc.net_amount += Number(r.net_amount || 0)
          return acc
        },
        { sum_received: 0, sum_spent: 0, net_amount: 0 }
      )
    },

    // نفس أسلوبك: إجمالي كلي = مجموع كل الأعمدة
    grandTotal() {
      return Number(this.totals.sum_received) + Number(this.totals.sum_spent) + Number(this.totals.net_amount)
    },

    reportTitle() {
      const [from, to] = this.getPickedDates()
      if (from && to && this.sameMonth(from, to)) return `مبالغ تغييرات الصيانة حسب المدينة للشهر ${from.getMonth() + 1}/${from.getFullYear()}`
      if (from && to) return `مبالغ تغييرات الصيانة حسب المدينة للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      return 'مبالغ تغييرات الصيانة حسب المدينة'
    },
  },
  methods: {
    formatCurrency(v) {
      return new Intl.NumberFormat('en-US').format(Number(v || 0))
    },

    getPickedDates() {
      const picked = this?.ChangesFromDate?.Get?.() || []
      const from = picked[0] ? new Date(picked[0]) : null
      const to = picked[1] ? new Date(picked[1]) : null
      return [from, to]
    },
    sameMonth(a, b) {
      return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
    },

    normalizeCity(s) {
      if (!s) return ''
      const arNums = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' }
      return s
        .toString()
        .normalize('NFKC')
        .trim()
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ـ/g, '')
        .replace(/[٠-٩]/g, d => arNums[d])
        .replace(/[\u200f\u200e]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/(\D)(\d)/g, '$1 $2')
        .replace(/(\d)(\D)/g, '$1 $2')
        .trim()
    },
    cityIndex(city) {
      const n = this.normalizeCity(city)
      const m = n.match(/(?:^|\s)الامل\s*([0-9]+)(?:\s|$)/)
      if (m) {
        const num = parseInt(m[1], 10)
        if (num >= 1 && num <= 3) return num - 1
      }
      if (/(?:^|\s)الامال(?:\s|$)/.test(n)) return 3
      return 1000
    },

    buildDateParams() {
      const picked = this?.ChangesFromDate?.Get?.() || []
      const p = {}
      if (picked[0]) {
        p.PaymentsTotalReportFrom = picked[0]
        p.PaymentsTotalReportTo = picked[1]
      }
      return p
    },

    handleFetch() {
      this.loading = true
      this.errorMsg = ''
      api
        .get('getMaintenanceChangesAmountsByCompound', { params: this.buildDateParams() })
        .then(res => {
          if (res.data?.success) {
            const arr = Array.isArray(res.data.data) ? res.data.data : []
            this.rows = arr.map(x => ({
              city: x.city ?? x.compound ?? 'غير محدد',
              sum_received: Number(x.sum_received ?? 0),
              sum_spent: Number(x.sum_spent ?? 0),
              net_amount: Number(x.net_amount ?? 0),
            }))
          } else {
            this.rows = []
            this.errorMsg = res.data?.message || 'لا توجد بيانات.'
          }
        })
        .catch(err => {
          this.rows = []
          this.errorMsg = 'فشل الطلب: ' + (err?.message || err)
        })
        .finally(() => (this.loading = false))
    },

    async exportPDF() {
      const root = this.$refs.printRoot
      if (!root) return
      if (document.fonts?.ready) {
        await document.fonts.ready.catch(() => {})
      }

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageW = pdf.internal.pageSize.getWidth(),
        pageH = pdf.internal.pageSize.getHeight()
      const sec = root.querySelector('.pdf-section')

      const canvas = await html2canvas(sec, { scale: Math.max(2, window.devicePixelRatio || 2), useCORS: true, backgroundColor: '#ffffff' })
      const imgW = pageW - 20,
        imgH = (canvas.height * imgW) / canvas.width
      const imgData = canvas.toDataURL('image/png')

      let heightLeft = imgH,
        y = 10
      pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH)
      heightLeft -= pageH - y
      while (heightLeft > 0) {
        y = heightLeft - imgH + 10
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH)
        heightLeft -= pageH
      }
      pdf.save('maintenance_changes_amounts_by_compound.pdf')
    },

    exportExcel() {
      if (!this.rowsSorted.length) return
      const wb = XLSX.utils.book_new()

      const data = this.rowsSorted.map(r => ({
        المدينة: r.city,
        'المبلغ المستلم': r.sum_received,
        'المبلغ المصروف': r.sum_spent,
        'المبلغ الصافي': r.net_amount,
      }))
      // صف المجموع
      data.push({
        المدينة: 'المجموع',
        'المبلغ المستلم': this.totals.sum_received,
        'المبلغ المصروف': this.totals.sum_spent,
        'المبلغ الصافي': this.totals.net_amount,
      })
      // صف الإجمالي الكلي (نفس أسلوبك)
      data.push({
        المدينة: 'الإجمالي الكلي',
        'المبلغ المستلم': '',
        'المبلغ المصروف': '',
        'المبلغ الصافي': '',
        'الإجمالي العام': this.grandTotal,
      })

      const ws = XLSX.utils.json_to_sheet(data, { header: ['المدينة', 'المبلغ المستلم', 'المبلغ المصروف', 'المبلغ الصافي', 'الإجمالي العام'] })
      XLSX.utils.book_append_sheet(wb, ws, 'تغييرات الصيانة')
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'maintenance_changes_amounts_by_compound.xlsx')
    },

    printAll() {
      const root = this.$refs.printRoot
      if (!root) return
      const original = document.body.innerHTML
      document.body.innerHTML = `<div style="direction:rtl;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">${root.innerHTML}</div>`
      window.print()
      document.body.innerHTML = original
      window.location.reload()
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.controls {
  background: #f7f9fb;
  border: 1px solid #e0e6ef;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}
.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-family: 'MFontB';
}
.control-row .val {
  color: #444;
  min-width: 46px;
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 12px 0;
}
.btn {
  background: #00b89a;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-family: 'MFontB';
  font-size: 15px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.title {
  text-align: center;
  margin-bottom: 12px;
  font-size: 18px;
  font-family: 'MFontB';
  color: #000;
}
.print-root {
  background: #fff;
}
.pdf-section {
  margin-bottom: 24px;
  page-break-after: always;
  break-after: page;
}

.table-wrapper {
  overflow-x: auto;
}
.styled-table.pivot {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
}
.styled-table.pivot th,
.styled-table.pivot td {
  border: 1px solid #000;
  padding: 10px 12px;
  text-align: center;
  font-family: 'MFontB';
  font-size: 16px;
  white-space: nowrap;
}
.styled-table.pivot thead tr {
  background: #dfe6f3;
  color: #000;
  font-weight: bold;
}
.styled-table.pivot thead th {
  font-size: var(--th-font-size, 16px);
} /* يتحكم بها السلايدر */
.styled-table.pivot .head-cell.city,
.styled-table.pivot td.city {
  font-weight: bold;
}
.styled-table.pivot tfoot tr.totals-row {
  background: #fff275;
  font-weight: bold;
}
.styled-table.pivot tfoot tr.grand-row {
  background: #ffe36e;
  font-weight: bold;
}
.styled-table.pivot tfoot tr.grand-row .grand-amount {
  font-size: 21px;
  font-weight: 900;
  padding: 16px 0;
  line-height: 1.2;
}

.empty-state {
  text-align: center;
  padding: 30px 10px;
  color: #333;
  font-family: 'MFontB';
}
</style>

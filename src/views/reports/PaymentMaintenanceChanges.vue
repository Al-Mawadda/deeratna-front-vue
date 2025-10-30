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
        <button class="btn" @click="exportPDF" :disabled="!hasAnyData">تصدير PDF</button>
        <button class="btn" @click="exportExcel" :disabled="!hasAnyData">تصدير الى اكسل</button>
        <button class="btn" @click="printAll" :disabled="!hasAnyData">طبـاعـــــة</button>
      </div>

      <div class="print-root" v-if="hasAnyData" ref="printRoot">
        <!-- الصفحة 1: تغييرات الصيانة (حسب المدن) -->
        <div class="pdf-section" v-if="rowsSorted.length">
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
                <tr v-for="(r, idx) in rowsSorted" :key="'chg_' + idx">
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
                  <th class="city">مجموع المبلغ</th>
                  <th class="grand-amount" colspan="3">
                    {{ formatCurrency(grandTotal) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- الصفحة 2: جميع مبالغ الكاش (pay_type = 'كاش') حسب المدن -->
        <div class="pdf-section" v-if="cashRowsSorted.length">
          <h2 class="title">{{ reportTitleCash }}</h2>

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
                <tr v-for="(r, idx) in cashRowsSorted" :key="'cash_' + idx">
                  <td class="city">{{ r.city }}</td>
                  <td>{{ formatCurrency(r.sum_received) }}</td>
                  <td>{{ formatCurrency(r.sum_spent) }}</td>
                  <td>{{ formatCurrency(r.net_amount) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="totals-row">
                  <th class="city">المجموع</th>
                  <th>{{ formatCurrency(cashTotals.sum_received) }}</th>
                  <th>{{ formatCurrency(cashTotals.sum_spent) }}</th>
                  <th>{{ formatCurrency(cashTotals.net_amount) }}</th>
                </tr>
                <tr class="grand-row">
                  <th class="city">مجموع المبلغ</th>
                  <th class="grand-amount" colspan="3">
                    {{ formatCurrency(cashGrandTotal) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">لا توجد بيانات للعرض. اختر تاريخاً ثم اضغط "عرض البيانات".</div>
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
      // الصفحة 1
      rows: [], // { city, sum_received, sum_spent, net_amount }

      // الصفحة 2 (كاش)
      cashRows: [], // { city, sum_received, sum_spent, net_amount }

      headerFontSize: 16,
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

    hasAnyData() {
      return this.rowsSorted.length || this.cashRowsSorted.length
    },

    // ===== الصفحة 1 (تغييرات) =====
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
    grandTotal() {
      // المطلوب: الإجمالي الكلي = مجموع المبلغ الصافي فقط
      return Number(this.totals.net_amount || 0)
    },

    // ===== الصفحة 2 (كاش) =====
    cashRowsSorted() {
      const arr = Array.isArray(this.cashRows) ? [...this.cashRows] : []
      arr.sort((a, b) => {
        const ia = this.cityIndex(a.city),
          ib = this.cityIndex(b.city)
        if (ia !== ib) return ia - ib
        return (a.city || '').localeCompare(b.city || '', 'ar', { numeric: true, sensitivity: 'base' })
      })
      return arr
    },
    cashTotals() {
      return this.cashRowsSorted.reduce(
        (acc, r) => {
          acc.sum_received += Number(r.sum_received || 0)
          acc.sum_spent += Number(r.sum_spent || 0)
          acc.net_amount += Number(r.net_amount || 0)
          return acc
        },
        { sum_received: 0, sum_spent: 0, net_amount: 0 }
      )
    },
    cashGrandTotal() {
      return Number(this.cashTotals.net_amount || 0)
    },

    // ===== عناوين =====
    reportTitle() {
      const [from, to] = this.getPickedDates()
      if (from && to && this.sameMonth(from, to)) return `مبالغ تغييرات الصيانة حسب المدينة للشهر ${from.getMonth() + 1}/${from.getFullYear()}`
      if (from && to) return `مبالغ تغييرات الصيانة حسب المدينة للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      return 'مبالغ تغييرات الصيانة حسب المدينة'
    },
    reportTitleCash() {
      const [from, to] = this.getPickedDates()
      if (from && to && this.sameMonth(from, to)) return `مبالغ صيانة المنازل (كاش) حسب المدينة للشهر ${from.getMonth() + 1}/${from.getFullYear()}`
      if (from && to) return `مبالغ صيانة المنازل (كاش) حسب المدينة للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      return 'مبالغ صيانة المنازل (كاش) حسب المدينة'
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
      const params = this.buildDateParams()

      // الصفحة 1: تغييرات
      api
        .get('getMaintenanceChangesAmountsByCompound', { params })
        .then(res => {
          if (res.data?.success) {
            const arr = Array.isArray(res.data.data) ? res.data.data : []
            this.rows = arr.map(x => ({
              city: x.city ?? x.compound ?? 'غير محدد',
              sum_received: Number(x.sum_received ?? x.total_received ?? 0),
              sum_spent: Number(x.sum_spent ?? x.total_spent ?? 0),
              net_amount: Number(
                x.net_amount ??
                  x.total_amount ?? // في حال كان الراوت يُرجِّع الصافي بهذا الاسم
                  (x.sum_received ?? x.total_received ?? 0) - (x.sum_spent ?? x.total_spent ?? 0)
              ),
            }))
          } else {
            this.rows = []
          }
        })
        .catch(() => {
          this.rows = []
        })
        .finally(() => {
          this.loading = false
        })

      // الصفحة 2: كاش
      api
        .get('getMaintenanceCashByCompound', { params }) // ← الراوت الذي ذكرتَه
        .then(res => {
          if (res.data?.success) {
            const arr = Array.isArray(res.data.data) ? res.data.data : []
            this.cashRows = arr.map(x => {
              const received = Number(x.sum_received ?? x.total_received ?? x.price_total ?? x.total_price ?? 0)
              const spent = Number(x.sum_spent ?? x.total_spent ?? x.price_spent_total ?? 0)
              const net = Number(
                x.net_amount ??
                  x.total_amount ?? // بعض الإصدارات تُرجّع الصافي بهذا الاسم
                  received - spent
              )
              return {
                city: x.city ?? x.compound ?? 'غير محدد',
                sum_received: received,
                sum_spent: spent,
                net_amount: net,
              }
            })
          } else {
            this.cashRows = []
          }
        })
        .catch(() => {
          this.cashRows = []
        })
    },

    // يصدر كل الأقسام الموجودة (واحدة تلو الأخرى)
    async exportPDF() {
      const root = this.$refs.printRoot
      if (!root) return
      if (document.fonts?.ready) {
        await document.fonts.ready.catch(() => {})
      }

      const sections = Array.from(root.querySelectorAll('.pdf-section'))
      const pdf = new jsPDF('l', 'mm', 'a4')
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      let first = true

      for (const sec of sections) {
        const canvas = await html2canvas(sec, { scale: Math.max(2, window.devicePixelRatio || 2), useCORS: true, backgroundColor: '#ffffff' })
        const imgW = pageW - 20
        const imgH = (canvas.height * imgW) / canvas.width
        const imgData = canvas.toDataURL('image/png')

        let heightLeft = imgH
        let y = 10

        if (!first) pdf.addPage()
        first = false

        pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH)
        heightLeft -= pageH - y
        while (heightLeft > 0) {
          y = heightLeft - imgH + 10
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH)
          heightLeft -= pageH
        }
      }
      pdf.save('maintenance_amounts_by_compound.pdf')
    },

    exportExcel() {
      if (!this.hasAnyData) return
      const wb = XLSX.utils.book_new()

      // Sheet 1: تغييرات
      if (this.rowsSorted.length) {
        const data1 = this.rowsSorted.map(r => ({
          المدينة: r.city,
          'المبلغ المستلم': r.sum_received,
          'المبلغ المصروف': r.sum_spent,
          'المبلغ الصافي': r.net_amount,
        }))
        data1.push({
          المدينة: 'المجموع',
          'المبلغ المستلم': this.totals.sum_received,
          'المبلغ المصروف': this.totals.sum_spent,
          'المبلغ الصافي': this.totals.net_amount,
        })
        data1.push({
          المدينة: 'مجموع المبلغ الكلي',
          'المبلغ المستلم': '',
          'المبلغ المصروف': '',
          'المبلغ الصافي': this.grandTotal,
        })
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data1, { header: ['المدينة', 'المبلغ المستلم', 'المبلغ المصروف', 'المبلغ الصافي'] }), 'تغييرات الصيانة')
      }

      // Sheet 2: كاش
      if (this.cashRowsSorted.length) {
        const data2 = this.cashRowsSorted.map(r => ({
          المدينة: r.city,
          'المبلغ المستلم': r.sum_received,
          'المبلغ المصروف': r.sum_spent,
          'المبلغ الصافي': r.net_amount,
        }))
        data2.push({
          المدينة: 'المجموع',
          'المبلغ المستلم': this.cashTotals.sum_received,
          'المبلغ المصروف': this.cashTotals.sum_spent,
          'المبلغ الصافي': this.cashTotals.net_amount,
        })
        data2.push({
          المدينة: 'مجموع المبلغ الكلي',
          'المبلغ المستلم': '',
          'المبلغ المصروف': '',
          'المبلغ الصافي': this.cashGrandTotal,
        })
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data2, { header: ['المدينة', 'المبلغ المستلم', 'المبلغ المصروف', 'المبلغ الصافي'] }), 'صيانة كاش')
      }

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'maintenance_amounts_by_compound.xlsx')
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
}
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

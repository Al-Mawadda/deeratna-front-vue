<template>
  <div class="ComponentWrapper" dir="rtl">
    <!-- اختيار التاريخ -->
    <div class="MGroup">
      <MDate ref="PaymentsTotalReportFromDate" :Name="'PaymentsTotalReportFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true" />
    </div>

    <div class="MGroup">
      <div class="MButton" id="GetPaymentTotalBTN" @click="handleFetch">عرض البيانات</div>
    </div>

    <div class="container">
      <div class="buttons">
        <button class="btn" @click="exportPDF" :disabled="!sections.length">تصدير PDF</button>
        <button class="btn" @click="exportExcel" :disabled="!sections.length">تصدير الى اكسل</button>
        <button class="btn" @click="printAll" :disabled="!sections.length">طبـاعـــــة</button>
      </div>

      <!-- نعرض الأقسام (صفحة لكل شركة دفع) -->
      <div class="print-root" v-if="sections.length" ref="printRoot">
        <div v-for="(sec, sidx) in sections" :key="'sec_' + sec.method_key" class="pdf-section">
          <h2 class="title">{{ baseTitle }} - {{ sec.method_label }}</h2>

          <div class="table-wrapper">
            <table class="styled-table pivot">
              <thead>
                <tr>
                  <th class="head-cell city">المدينة</th>
                  <th class="head-cell" v-for="k in pivotKeysShown" :key="'h_' + sidx + '_' + k">
                    {{ serviceLabels[k] || k }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(r, idx) in sec.rows" :key="'row_' + sidx + '_' + idx">
                  <td class="city">{{ r.city }}</td>
                  <td v-for="k in pivotKeysShown" :key="'c_' + sidx + '_' + idx + '_' + k">
                    {{ formatCurrency(r[k] || 0) }}
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr class="totals-row">
                  <th class="city">المجموع</th>
                  <th v-for="k in pivotKeysShown" :key="'t_' + sidx + '_' + k">
                    {{ formatCurrency(sec.colTotals[k] || 0) }}
                  </th>
                </tr>
                <tr class="grand-row">
                  <th class="city">الإجمالي الكلي</th>
                  <th class="grand-amount" :colspan="pivotKeysShown.length">
                    {{ formatCurrency(sec.grandTotal) }}
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
  name: 'PaymentsByServicePerMethod',
  data() {
    return {
      // بيانات خام من الراوت getPaymentsByMethod
      transactions: [],
      loading: false,
      errorMsg: '',

      // ترتيب الأعمدة (أنواع الخدمة) ثابت
      pivotKeysOrder: ['Services', 'Electricity', 'Maintenance', 'Internet Renew', 'Internet Maintenance', 'Car Label', 'NFC Card'],
      // تسميات عربية للخدمات
      serviceLabels: {
        Services: 'الخدمات',
        Electricity: 'المولد',
        Maintenance: 'صيانة المنازل',
        'Internet Renew': 'اشتراكات الانترنت',
        'Internet Maintenance': 'صيانة الانترنت',
        'Car Label': 'ليبل السيارات',
        'NFC Card': 'الباجات',
      },

      // ترتيب صفحات شركات الدفع
      methodsOrder: ['Zain Cash', 'Al Qaseh', 'Other'],
      methodLabels: {
        'Zain Cash': 'زين كاش',
        'Al Qaseh': 'القاصة',
        Other: 'أخرى',
      },

      // تثبيت ترتيب مدن الأمل
      cityPins: ['الامل 1', 'الامل 2', 'الامل 3', 'الامال'],
    }
  },
  setup() {
    return {
      PaymentsTotalReportFromDate: ref(null),
      printRoot: ref(null),
    }
  },
  computed: {
    pivotKeysShown() {
      return this.pivotKeysOrder
    },

    // عنوان عام (بدون اسم الشركة، لأن كل صفحة لها اسمها)
    baseTitle() {
      const picked = this?.PaymentsTotalReportFromDate?.Get?.()
      if (picked && picked[0]) {
        const from = new Date(picked[0])
        const to = picked[1] ? new Date(picked[1]) : null
        const sameMonth = to && from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()
        const mm = (from.getMonth() + 1).toString()
        const yyyy = from.getFullYear().toString()
        if (sameMonth) return `الدفع الالكتروني حسب الخدمة للشهر ${mm}/${yyyy}`
        if (to) return `الدفع الالكتروني حسب الخدمة للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      }
      return 'الدفع الالكتروني حسب الخدمة'
    },

    // sections: [{ method_key, method_label, rows, colTotals, grandTotal }]
    sections() {
      if (!Array.isArray(this.transactions) || !this.transactions.length) return []

      // 1) تجميع حسب الشركة -> مدينة -> خدمة
      const byMethod = {}
      for (const t of this.transactions) {
        const methodKey = t.payment_method_key || t.method_key || t.payment_method || 'Other'
        const methodLabel = this.methodLabels[methodKey] || t.payment_method_label || t.method_label || methodKey

        const city = t.city || t.compound || 'غير محدد'
        const svc = t.payment_key || t.payment_name || ''
        const amt = Number(t.total_amount || 0)

        if (!byMethod[methodKey]) {
          byMethod[methodKey] = { method_key: methodKey, method_label: methodLabel, byCity: {} }
        }
        if (!byMethod[methodKey].byCity[city]) {
          byMethod[methodKey].byCity[city] = {}
        }
        byMethod[methodKey].byCity[city][svc] = (byMethod[methodKey].byCity[city][svc] || 0) + amt
      }

      // 2) بناء الأقسام بترتيب methodsOrder وإهمال الفارغ
      const out = []
      for (const m of this.methodsOrder) {
        const bucket = byMethod[m]
        if (!bucket) continue

        // سطور المدن مرتبة (الأمل 1 ثم 2 ثم 3 ثم الأمال ثم أبجديًا)
        const cities = Object.keys(bucket.byCity).sort((a, b) => {
          const ia = this.cityIndex(a),
            ib = this.cityIndex(b)
          if (ia !== ib) return ia - ib
          return (a || '').localeCompare(b || '', 'ar', { numeric: true, sensitivity: 'base' })
        })

        const rows = cities.map(city => {
          const row = { city }
          for (const k of this.pivotKeysShown) row[k] = Number(bucket.byCity[city][k] || 0)
          return row
        })

        // مجاميع الأعمدة وإجمالي الصفحة
        const colTotals = {}
        for (const k of this.pivotKeysShown) colTotals[k] = 0
        for (const r of rows) for (const k of this.pivotKeysShown) colTotals[k] += Number(r[k] || 0)
        const grandTotal = Object.values(colTotals).reduce((s, v) => s + Number(v || 0), 0)

        out.push({
          method_key: m,
          method_label: this.methodLabels[m] || m,
          rows,
          colTotals,
          grandTotal,
        })
      }

      // (اختياري) أضف بقية الشركات غير المعرفة في methodsOrder بنهاية القائمة
      for (const key of Object.keys(byMethod)) {
        if (this.methodsOrder.includes(key)) continue
        const bucket = byMethod[key]
        const cities = Object.keys(bucket.byCity).sort((a, b) => {
          const ia = this.cityIndex(a),
            ib = this.cityIndex(b)
          if (ia !== ib) return ia - ib
          return (a || '').localeCompare(b || '', 'ar', { numeric: true, sensitivity: 'base' })
        })
        const rows = cities.map(city => {
          const row = { city }
          for (const k of this.pivotKeysShown) row[k] = Number(bucket.byCity[city][k] || 0)
          return row
        })
        const colTotals = {}
        for (const k of this.pivotKeysShown) colTotals[k] = 0
        for (const r of rows) for (const k of this.pivotKeysShown) colTotals[k] += Number(r[k] || 0)
        const grandTotal = Object.values(colTotals).reduce((s, v) => s + Number(v || 0), 0)
        out.push({
          method_key: key,
          method_label: this.methodLabels[key] || bucket.method_label || key,
          rows,
          colTotals,
          grandTotal,
        })
      }

      return out
    },
  },
  methods: {
    formatCurrency(v) {
      return new Intl.NumberFormat('en-US').format(Number(v || 0))
    },

    // ترتيب خاص لمدن الأمل
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
      const picked = this?.PaymentsTotalReportFromDate?.Get?.() || []
      const p = {}
      if (picked[0]) {
        p.PaymentsTotalReportFrom = picked[0]
        p.PaymentsTotalReportTo = picked[1]
      }
      return p
    },

    handleFetch() {
      this.getdata(this.buildDateParams())
    },

    getdata(params) {
      this.loading = true
      this.errorMsg = ''
      api
        .get('getPaymentsByMethod', { params })
        .then(res => {
          if (res.data?.success) {
            const rows = Array.isArray(res.data.data) ? res.data.data : []
            this.transactions = rows.map(x => ({
              city: x.city ?? x.compound ?? 'غير محدد',
              payment_key: x.payment_key ?? x.payment_name ?? '',
              payment_label: x.payment_label ?? x.payment_name ?? x.payment_key ?? '',
              payment_method_key: x.payment_method_key ?? x.method_key ?? x.payment_method ?? 'Other',
              payment_method_label: x.payment_method_label ?? x.method_label ?? x.payment_method_key ?? 'غير محدد',
              total_amount: Number(x.total_amount ?? 0),
            }))
          } else {
            this.transactions = []
            this.errorMsg = res.data?.message || 'حدث خطأ أثناء جلب البيانات'
          }
        })
        .catch(err => {
          this.transactions = []
          this.errorMsg = 'فشل الطلب: ' + (err?.message || err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // PDF: صفحة لكل شركة دفع
    async exportPDF() {
      const root = this.$refs.printRoot
      if (!root) return

      // تأكد من تحميل الخطوط (بدون catch فارغ)
      if (document.fonts?.ready) {
        await document.fonts.ready.catch(() => {})
      }

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      let firstPage = true

      const sections = Array.from(root.querySelectorAll('.pdf-section'))

      for (const sec of sections) {
        const canvas = await html2canvas(sec, {
          scale: Math.max(2, window.devicePixelRatio || 2),
          useCORS: true,
          backgroundColor: '#ffffff',
        })
        const imgW = pageW - 20
        const imgH = (canvas.height * imgW) / canvas.width
        const imgData = canvas.toDataURL('image/png')

        let heightLeft = imgH
        let y = 10

        if (!firstPage) pdf.addPage()
        firstPage = false

        pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH)
        heightLeft -= pageH - y

        // لو القسم طويل، نُقسّمه لعدة صفحات
        while (heightLeft > 0) {
          y = heightLeft - imgH + 10
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH)
          heightLeft -= pageH
        }
      }

      pdf.save('payments_by_service_per_method.pdf')
    },

    // Excel: ورقة لكل شركة دفع
    exportExcel() {
      if (!this.sections.length) return
      const wb = XLSX.utils.book_new()

      this.sections.forEach(sec => {
        const rows = sec.rows.map((r, idx) => {
          const obj = { '#': idx + 1, المدينة: r.city }
          for (const k of this.pivotKeysShown) obj[this.serviceLabels[k] || k] = r[k] || 0
          return obj
        })
        // صف المجموع
        const totalsRow = { '#': '', المدينة: 'المجموع' }
        for (const k of this.pivotKeysShown) totalsRow[this.serviceLabels[k] || k] = sec.colTotals[k] || 0
        rows.push(totalsRow)
        // صف الإجمالي الكلي
        rows.push({ '#': '', المدينة: 'الإجمالي الكلي', [this.serviceLabels[this.pivotKeysShown[0]] || this.pivotKeysShown[0]]: '', 'الإجمالي العام': sec.grandTotal })

        const ws = XLSX.utils.json_to_sheet(rows)
        const safeName = (sec.method_label || sec.method_key || 'Sheet').toString().slice(0, 28)
        XLSX.utils.book_append_sheet(wb, ws, safeName)
      })

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'payments_by_service_per_method.xlsx')
    },

    // طباعة: كل قسم في صفحة منفصلة بفضل CSS
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
/* الحاوية */
.container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* الأزرار */
.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}
.btn {
  background-color: #00b89a;
  color: white;
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

/* العنوان */
.title {
  text-align: center;
  margin-bottom: 12px;
  font-size: 18px;
  font-family: 'MFontB';
  color: #000;
}

/* تغليف الجداول */
.print-root {
  background: #fff;
}
.pdf-section {
  margin-bottom: 24px;
  /* فصل الصفحة عند الطباعة/الـ PDF */
  page-break-after: always;
  break-after: page;
}

/* جدول محوري */
.table-wrapper {
  overflow-x: auto;
}
.styled-table.pivot {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
  table-layout: fixed;
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
  background-color: #dfe6f3;
  color: #000;
  font-weight: bold;
}
.styled-table.pivot .head-cell.city,
.styled-table.pivot td.city {
  font-weight: bold;
}

/* صف المجموع والإجمالي */
.styled-table.pivot tfoot tr.totals-row {
  background-color: #fff275;
  font-weight: bold;
}
.styled-table.pivot tfoot tr.grand-row {
  background-color: #ffe36e;
  font-weight: bold;
}
.styled-table.pivot tfoot tr.grand-row .grand-amount {
  font-size: 21px;
  font-weight: 900;
  padding: 16px 0;
  line-height: 1.2;
}

/* لا توجد بيانات */
.empty-state {
  text-align: center;
  padding: 30px 10px;
  color: #333;
  font-family: 'MFontB';
}
</style>

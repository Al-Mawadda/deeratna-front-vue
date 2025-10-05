<template>
  <div class="ComponentWrapper" dir="rtl">
    <!-- اختيار التاريخ (مدى زمني) -->
    <div class="MGroup">
      <MDate ref="PaymentsTotalReportFromDate" :Name="'PaymentsTotalReportFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true" />
    </div>

    <div class="MGroup">
      <div class="MButton" id="GetPaymentTotalBTN" @click="handleFetch">عرض البيانات</div>
    </div>

    <div class="container">
      <h2 class="title">{{ reportTitle }}</h2>

      <div class="buttons">
        <button class="btn" @click="exportPDF" :disabled="!pivotRows.length">تصدير PDF</button>
        <button class="btn" @click="exportExcel" :disabled="!pivotRows.length">تصدير الى اكسل</button>
        <button class="btn" @click="printAll" :disabled="!pivotRows.length">طبـاعـــــة</button>
      </div>

      <!-- الجدول المحوري (مثل الصورة) -->
      <div class="table-wrapper" v-if="pivotRows.length" ref="pdfRoot">
        <table class="styled-table pivot">
          <thead>
            <tr>
              <th class="head-cell city">المدينة</th>
              <th class="head-cell" v-for="k in pivotKeysShown" :key="'h_' + k">
                {{ labelsMap[k] || k }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in pivotRows" :key="`row_${idx}`">
              <td class="city">{{ r.city }}</td>
              <td v-for="k in pivotKeysShown" :key="`c_${idx}_${k}`">
                {{ formatCurrency(r[k] || 0) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <!-- صف مجموع الأعمدة (مثل الصف الأصفر بالصورة) -->
            <tr class="totals-row">
              <th class="city">المجموع</th>
              <th v-for="k in pivotKeysShown" :key="'t_' + k">
                {{ formatCurrency(colTotals[k] || 0) }}
              </th>
            </tr>
            <!-- صف الإجمالي الكلي -->
            <tr class="grand-row">
              <th class="city">الإجمالي الكلي</th>
              <th :colspan="pivotKeysShown.length">{{ formatCurrency(grandTotal) }}</th>
            </tr>
          </tfoot>
        </table>
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
  name: 'TransactionsByServicePivot',
  data() {
    return {
      transactions: [],
      loading: false,
      errorMsg: '',
      cityPins: ['الامل 1', 'الامل 2', 'الامل 3', 'الامال'], // الامل1،2،3 ثم الامال      // كل الأعمدة مطلوبة دائماً وبهذا الترتيب
      pivotKeysOrder: [
        'Services', // الخدمات
        'Electricity', // المولد
        'Maintenance', // صيانة
        'Internet Renew', // اشتراكات الانترنت
        'Internet Maintenance', // صيانة الانترنت
        'Car Label', // ليبل السيارات (دمج Add/Renew)
        'NFC Card', // الباجات (دمج Add/Renew)
      ],
      // تسميات عربية
      labelsMap: {
        Services: 'الخدمات',
        Electricity: 'المولد',
        Maintenance: 'صيانة المنازل',
        'Internet Renew': 'اشتراكات الانترنت',
        'Internet Maintenance': 'صيانة الانترنت',
        'Car Label': 'ملصق السيارات', // أو "ليبل السيارات"
        'NFC Card': 'باجات الدخول', // أو "الباجات"
      },
    }
  },
  setup() {
    return {
      PaymentsTotalReportFromDate: ref(null),
      pdfRoot: ref(null),
    }
  },
  computed: {
    // نعرض كل الأعمدة دائماً
    pivotKeysShown() {
      return this.pivotKeysOrder
    },

    // تجميع حسب المدينة ثم ملء الأعمدة كلها (حتى لو صفر)
    pivotRows() {
      if (!Array.isArray(this.transactions) || !this.transactions.length) return []
      const byCity = {}
      for (const r of this.transactions) {
        const city = r.city || r.compound || 'غير محدد'
        const key = r.payment_key || r.payment_name || ''
        const amount = Number(r.total_amount || 0)
        if (!byCity[city]) byCity[city] = {}
        byCity[city][key] = (byCity[city][key] || 0) + amount
      }
      return Object.keys(byCity)
        .sort((a, b) => {
          const ia = this.cityIndex(a)
          const ib = this.cityIndex(b)
          if (ia !== ib) return ia - ib // المثبّتة أولاً بالترتيب: الامل 1 ثم 2 ثم 3 ثم الامال
          return (a || '').localeCompare(b || '', 'ar') // ثم بقية المدن أبجديًا
        })
        .map(city => {
          const row = { city }
          for (const k of this.pivotKeysShown) row[k] = Number(byCity[city][k] || 0)
          return row
        })
    },

    // مجموع كل عمود
    colTotals() {
      const totals = {}
      for (const k of this.pivotKeysShown) totals[k] = 0
      for (const r of this.pivotRows) {
        for (const k of this.pivotKeysShown) totals[k] += Number(r[k] || 0)
      }
      return totals
    },

    // المجموع الكلي لكل الأعمدة
    grandTotal() {
      return Object.values(this.colTotals).reduce((s, v) => s + Number(v || 0), 0)
    },

    // عنوان التقرير
    reportTitle() {
      const picked = this?.PaymentsTotalReportFromDate?.Get?.()
      if (picked && picked[0]) {
        const from = new Date(picked[0])
        const to = picked[1] ? new Date(picked[1]) : null
        const sameMonth = to && from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()
        const mm = (from.getMonth() + 1).toString()
        const yyyy = from.getFullYear().toString()
        if (sameMonth) return `الدفع الالكتروني من خلال البرنامج لشهر ${mm}/${yyyy}`
        if (to) return `الدفع الالكتروني من خلال البرنامج للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      }
      return 'الدفع الالكتروني من خلال البرنامج'
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US').format(Number(value || 0))
    },

    normalizeCity(s) {
      if (!s) return ''
      const arNums = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' }
      return s
        .toString()
        .normalize('NFKC') // توحيد الأشكال
        .trim()
        .replace(/[أإآٱ]/g, 'ا') // توحيد الهمزات إلى ا
        .replace(/ـ/g, '') // إزالة التطويل
        .replace(/[٠-٩]/g, d => arNums[d]) // أرقام عربية → إنجليزية
        .replace(/[\u200f\u200e]/g, '') // إزالة علامات RTL/LTR المخفية
        .replace(/\s+/g, ' ') // مسافة واحدة
        .replace(/(\D)(\d)/g, '$1 $2') // "الامل1" → "الامل 1"
        .replace(/(\d)(\D)/g, '$1 $2') // "1الامل" → "1 الامل"
        .trim()
    },

    cityIndex(city) {
      const n = this.normalizeCity(city)

      // الامل + رقم (1..3) بأي مسافات
      const m = n.match(/(?:^|\s)الامل\s*([0-9]+)(?:\s|$)/)
      if (m) {
        const num = parseInt(m[1], 10)
        if (num >= 1 && num <= 3) return num - 1 // 0,1,2
      }

      // الامال بالضبط (مع مراعاة المسافات حولها)
      if (/(?:^|\s)الامال(?:\s|$)/.test(n)) return 3

      // الباقي بعدهم
      return 1000
    },

    // باراميترات التاريخ من MDate
    buildDateParams() {
      const picked = this?.PaymentsTotalReportFromDate?.Get?.()
      const params = {}
      if (picked && picked[0]) {
        params.PaymentsTotalReportFrom = picked[0]
        params.PaymentsTotalReportTo = picked[1]
      }
      return params
    },

    handleFetch() {
      const params = this.buildDateParams()
      this.getdata(params)
    },

    // جلب البيانات (توقع أن backend مطبّق الدمج للمفاتيح)
    getdata(params) {
      this.loading = true
      this.errorMsg = ''
      api
        .get('getPaymentsCompounds', { params })
        .then(res => {
          if (res.data?.success) {
            const rows = Array.isArray(res.data.data) ? res.data.data : []
            this.transactions = rows.map(x => ({
              city: x.city ?? x.compound ?? 'غير محدد',
              payment_key: x.payment_key ?? x.payment_name ?? '',
              payment_label: x.payment_label ?? x.payment_name ?? x.payment_key ?? '',
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
          console.error('Request failed:', err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // PDF للجدول المحوري
    exportPDF() {
      const root = this.$refs.pdfRoot
      if (!root) return
      html2canvas(root, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        .then(canvas => {
          const imgData = canvas.toDataURL('image/png')
          const pdf = new jsPDF('p', 'mm', 'a4')
          const pageWidth = 210,
            pageHeight = 297
          const imgWidth = pageWidth - 20
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight,
            position = 10
          pdf.text(this.reportTitle, 10, 10, { align: 'left' })
          pdf.addImage(imgData, 'PNG', 10, position + 5, imgWidth, imgHeight)
          heightLeft -= pageHeight - position
          while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }
          pdf.save('transactions_pivot.pdf')
        })
        .catch(err => {
          console.error('PDF export failed:', err)
          alert('تعذر إنشاء ملف الـ PDF. حاول مجدداً أو اطبع كـ PDF من المتصفح.')
        })
    },

    // Excel: نفس الأعمدة + صف المجموع + صف الإجمالي الكلي وعمود "الإجمالي العام"
    exportExcel() {
      if (!this.pivotRows.length) return
      const wb = XLSX.utils.book_new()

      const header = ['المدينة', ...this.pivotKeysShown.map(k => this.labelsMap[k] || k), 'الإجمالي العام']

      const data = this.pivotRows.map(r => {
        const row = { المدينة: r.city }
        for (const k of this.pivotKeysShown) row[this.labelsMap[k] || k] = r[k] || 0
        row['الإجمالي العام'] = '' // يبقى فارغاً لكل صف مدينة
        return row
      })

      // صف مجموع الأعمدة
      const totalsRow = { المدينة: 'المجموع' }
      for (const k of this.pivotKeysShown) {
        totalsRow[this.labelsMap[k] || k] = this.colTotals[k] || 0
      }
      totalsRow['الإجمالي العام'] = ''
      data.push(totalsRow)

      // صف الإجمالي الكلي
      const grandRow = { المدينة: 'الإجمالي الكلي' }
      for (const k of this.pivotKeysShown) {
        grandRow[this.labelsMap[k] || k] = ''
      }
      grandRow['الإجمالي العام'] = this.grandTotal
      data.push(grandRow)

      const ws = XLSX.utils.json_to_sheet(data, { header })
      XLSX.utils.book_append_sheet(wb, ws, 'التقرير')

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'transactions_pivot.xlsx')
    },

    // طباعة
    printAll() {
      if (!this.$el) return
      const printable = this.$el.querySelector('.table-wrapper')
      if (!printable) return
      const printContents = printable.innerHTML
      const originalContents = document.body.innerHTML
      document.body.innerHTML = `<div style="direction:rtl;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">${printContents}</div>`
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload()
    },
  },
}
</script>

<style scoped>
/* الحاوية */
.container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  background: #ffffff; /* مثل إحساس الأكسل */
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* العنوان */
.title {
  text-align: center;
  margin-bottom: 16px;
  font-size: 18px;
  font-family: 'MFontB';
  color: #000;
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
.btn:hover:not(:disabled) {
  background-color: #00b89a;
}

/* تغليف الجدول */
.table-wrapper {
  overflow-x: auto;
}

/* جدول محوري بشكل الأكسل */
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
  background-color: #dfe6f3; /* أزرق فاتح مثل الصورة */
  color: #000;
  font-weight: bold;
}
.styled-table.pivot .head-cell.city,
.styled-table.pivot td.city {
  font-weight: bold;
}

/* صف المجموع */
.styled-table.pivot tfoot tr.totals-row {
  background-color: #fff275; /* أصفر واضح */
  font-weight: bold;
}

/* صف الإجمالي الكلي */
.styled-table.pivot tfoot tr.grand-row {
  background-color: #ffe36e; /* أصفر أدكن قليلاً */
  font-weight: bold;
}

/* لا توجد بيانات */
.empty-state {
  text-align: center;
  padding: 30px 10px;
  color: #333;
  font-family: 'MFontB';
}
</style>

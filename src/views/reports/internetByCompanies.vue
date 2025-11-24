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
      <!-- التريكر: إخفاء المدن -->
      <div class="controls">
        <div class="control-row cols">
          <span class="label">خيارات العرض:</span>
          <label class="checkbox">
            <input type="checkbox" v-model="hideCities" />
            <span style="font-family: 'MFontB'; color: brown; font-size: 15px">إخفاء المدن وإظهار المجاميع فقط</span>
          </label>
        </div>
      </div>

      <div class="buttons">
        <button class="btn" @click="exportPDF" :disabled="!sections.length">تصدير PDF</button>
        <button class="btn" @click="exportExcel" :disabled="!sections.length">تصدير الى اكسل</button>
        <button class="btn" @click="printAll" :disabled="!sections.length">طبـاعـــــة</button>
      </div>

      <!-- لو توجد بيانات -->
      <div v-if="sections.length">
        <!-- صفحات الشركات (كل شركة صفحة) -->
        <div class="print-root" ref="printRoot">
          <div v-for="(sec, sidx) in sections" :key="'sec_' + sec.company_name" class="pdf-section">
            <h2 class="title">{{ baseTitle }} - {{ sec.company_name }}</h2>

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

                <!-- تفاصيل المدن (تُخفى عند تفعيل التريكر) -->
                <tbody v-if="!hideCities">
                  <tr v-for="(r, idx) in sec.rows" :key="'row_' + sidx + '_' + idx">
                    <td class="city">{{ r.city }}</td>
                    <td v-for="k in pivotKeysShown" :key="'c_' + sidx + '_' + idx + '_' + k">
                      {{ formatCurrency(r[k] || 0) }}
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr class="totals-row">
                    <!-- <th class="city">
                      {{ hideCities ? 'مجموع الشركة' : 'المجموع' }}
                    </th> -->
                    <!-- <th v-for="k in pivotKeysShown" :key="'t_' + sidx + '_' + k">
                      {{ formatCurrency(sec.colTotals[k] || 0) }}
                    </th> -->
                  </tr>
                  <tr class="grand-row">
                    <th class="city">الإجمالي الكلي للشركة</th>
                    <th class="grand-amount" :colspan="pivotKeysShown.length">
                      {{ formatCurrency(sec.grandTotal) }}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- ملخص نهائي: مجموع كل الشركات -->
        <div v-if="overallTotals" class="pdf-section overall-summary">
          <h2 class="title">الإجمالي الكلي لجميع الشركات</h2>

          <div class="table-wrapper">
            <table class="styled-table pivot">
              <thead>
                <tr>
                  <th class="head-cell city">البيان</th>
                  <th class="head-cell" v-for="k in pivotKeysShown" :key="'oh_' + k">
                    {{ serviceLabels[k] || k }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <!-- <td class="city">مجموع جميع الشركات</td>
                  <td v-for="k in pivotKeysShown" :key="'oc_' + k">
                    {{ formatCurrency(overallTotals.colTotals[k] || 0) }}
                  </td> -->
                </tr>
              </tbody>

              <tfoot>
                <tr class="grand-row">
                  <th class="city">الإجمالي الكلي</th>
                  <th class="grand-amount" :colspan="pivotKeysShown.length">
                    {{ formatCurrency(overallTotals.grandTotal) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- لا توجد بيانات -->
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
  name: 'PaymentsInternetByCompanies',

  data() {
    return {
      transactions: [],
      loading: false,
      errorMsg: '',

      // أعمدة الخدمة (pivot columns)
      pivotKeysOrder: ['Internet Renew'],
      serviceLabels: {
        'Internet Renew': 'اشتراكات الانترنت',
      },

      // ترتيب مدن الأمل
      cityPins: ['الامل 1', 'الامل 2', 'الامل 3', 'الامال'],

      selectedColumns: [],
      hideCities: false, // 🔴 التريكر
    }
  },

  setup() {
    return {
      PaymentsTotalReportFromDate: ref(null),
      printRoot: ref(null),
    }
  },

  computed: {
    isAllSelected() {
      return this.selectedColumns.length === this.pivotKeysOrder.length
    },

    pivotKeysShown() {
      const sel = Array.isArray(this.selectedColumns) ? this.selectedColumns : []
      const filtered = this.pivotKeysOrder.filter(k => sel.includes(k))
      return filtered.length ? filtered : this.pivotKeysOrder
    },

    baseTitle() {
      const picked = this?.PaymentsTotalReportFromDate?.Get?.()
      if (picked && picked[0]) {
        const from = new Date(picked[0])
        const to = picked[1] ? new Date(picked[1]) : null
        const sameMonth = to && from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()
        const mm = (from.getMonth() + 1).toString()
        const yyyy = from.getFullYear().toString()
        if (sameMonth) return `اشتراكات الانترنت حسب الشركة للشهر ${mm}/${yyyy}`
        if (to) return `اشتراكات الانترنت حسب الشركة للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      }
      return 'اشتراكات الانترنت حسب الشركة'
    },

    // sections: [{ company_name, rows, colTotals, grandTotal }]
    sections() {
      if (!Array.isArray(this.transactions) || !this.transactions.length) return []

      const byCompany = {}

      // 1) تجميع حسب الشركة -> مدينة -> خدمة
      for (const t of this.transactions) {
        const company = t.company_name || 'غير محدد'
        const city = t.city || t.compound || 'غير محدد'
        const svc = t.service_key || t.payment_name || ''
        const amt = Number(t.total_amount || 0)

        if (!byCompany[company]) {
          byCompany[company] = { company_name: company, byCity: {} }
        }
        if (!byCompany[company].byCity[city]) {
          byCompany[company].byCity[city] = {}
        }
        byCompany[company].byCity[city][svc] = (byCompany[company].byCity[city][svc] || 0) + amt
      }

      const out = []

      // 2) بناء سكشن لكل شركة
      for (const companyName of Object.keys(byCompany)) {
        const bucket = byCompany[companyName]

        const cities = Object.keys(bucket.byCity).sort((a, b) => {
          const ia = this.cityIndex(a)
          const ib = this.cityIndex(b)
          if (ia !== ib) return ia - ib
          return (a || '').localeCompare(b || '', 'ar', {
            numeric: true,
            sensitivity: 'base',
          })
        })

        const rows = cities.map(city => {
          const row = { city }
          for (const k of this.pivotKeysShown) {
            row[k] = Number(bucket.byCity[city][k] || 0)
          }
          return row
        })

        const colTotals = {}
        for (const k of this.pivotKeysShown) colTotals[k] = 0
        for (const r of rows) {
          for (const k of this.pivotKeysShown) {
            colTotals[k] += Number(r[k] || 0)
          }
        }
        const grandTotal = Object.values(colTotals).reduce((s, v) => s + Number(v || 0), 0)

        out.push({
          company_name: companyName,
          rows,
          colTotals,
          grandTotal,
        })
      }

      // 3) ترتيب الشركات حسب الإجمالي ثم ابجدياً
      out.sort((a, b) => {
        if (b.grandTotal !== a.grandTotal) {
          return b.grandTotal - a.grandTotal
        }
        return (a.company_name || '').localeCompare(b.company_name || '', 'ar', {
          numeric: true,
          sensitivity: 'base',
        })
      })

      return out
    },

    // المجموع الكلي لجميع الشركات
    overallTotals() {
      if (!this.sections.length) return null

      const totals = {}
      for (const k of this.pivotKeysShown) {
        totals[k] = 0
      }

      for (const sec of this.sections) {
        for (const k of this.pivotKeysShown) {
          totals[k] += Number(sec.colTotals[k] || 0)
        }
      }

      const grand = Object.values(totals).reduce((s, v) => s + Number(v || 0), 0)

      return {
        colTotals: totals,
        grandTotal: grand,
      }
    },
  },

  methods: {
    formatCurrency(v) {
      return new Intl.NumberFormat('en-US').format(Number(v || 0))
    },

    selectAll() {
      this.selectedColumns = [...this.pivotKeysOrder]
      this.persistSelected()
    },

    clearAll() {
      this.selectedColumns = [...this.pivotKeysOrder]
      this.persistSelected()
    },

    persistSelected() {
      localStorage.setItem('PaymentByInternetCompanies.selectedColumns', JSON.stringify(this.selectedColumns))
    },

    normalizeCity(s) {
      if (!s) return ''
      const arNums = {
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
      }
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
        .get('getPaymentsInternetByCompanies', { params })
        .then(res => {
          if (res.data?.success) {
            const rows = Array.isArray(res.data.data) ? res.data.data : []
            this.transactions = rows.map(x => ({
              city: x.city ?? x.compound ?? 'غير محدد',

              // نوع الخدمة (للاعمدة)
              service_key: x.service_key ?? x.payment_name ?? 'Internet Renew',
              payment_name: x.payment_name ?? x.service_key ?? 'Internet Renew',

              // اسم الشركة من internet_requests.company_name
              company_name: x.company_name ?? x.company_label ?? x.company_key ?? 'غير محدد',

              total_amount: Number(x.total_amount ?? x.sum_amount ?? 0),
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

    // PDF: صفحة لكل شركة + الملخص
    async exportPDF() {
      // نستخدم كل .pdf-section (الشركات + الملخص النهائي)
      const sections = Array.from(document.querySelectorAll('.pdf-section'))
      if (!sections.length) return

      if (document.fonts?.ready) {
        await document.fonts.ready.catch(() => {})
      }

      const pdf = new jsPDF('l', 'mm', 'a4')
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      let firstPage = true

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

        while (heightLeft > 0) {
          y = heightLeft - imgH + 10
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH)
          heightLeft -= pageH
        }
      }

      pdf.save('internet_payments_by_company_name.pdf')
    },

    // Excel: ورقة لكل شركة – تحترم حالة إخفاء المدن
    exportExcel() {
      if (!this.sections.length) return
      const wb = XLSX.utils.book_new()

      this.sections.forEach(sec => {
        const rows = []

        // تفاصيل المدن فقط إذا hideCities = false
        if (!this.hideCities) {
          sec.rows.forEach((r, idx) => {
            const obj = { '#': idx + 1, المدينة: r.city }
            for (const k of this.pivotKeysShown) {
              obj[this.serviceLabels[k] || k] = r[k] || 0
            }
            rows.push(obj)
          })
        }

        // صف المجموع
        const totalsRow = { '#': '', المدينة: this.hideCities ? 'مجموع الشركة' : 'المجموع' }
        for (const k of this.pivotKeysShown) {
          totalsRow[this.serviceLabels[k] || k] = sec.colTotals[k] || 0
        }
        rows.push(totalsRow)

        // صف الإجمالي الكلي
        rows.push({
          '#': '',
          المدينة: 'الإجمالي الكلي للشركة',
          [this.serviceLabels[this.pivotKeysShown[0]] || this.pivotKeysShown[0]]: '',
          'الإجمالي العام': sec.grandTotal,
        })

        const ws = XLSX.utils.json_to_sheet(rows)
        const safeName = (sec.company_name || 'Sheet').toString().slice(0, 28)

        XLSX.utils.book_append_sheet(wb, ws, safeName)
      })

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'internet_payments_by_company_name.xlsx')
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

  created() {
    const key = 'PaymentByInternetCompanies.selectedColumns'

    const saved = JSON.parse(localStorage.getItem(key) || 'null')
    if (Array.isArray(saved) && saved.length) {
      this.selectedColumns = saved.filter(k => this.pivotKeysOrder.includes(k))
    }

    if (!this.selectedColumns.length) {
      this.selectedColumns = [...this.pivotKeysOrder]
    }
  },

  watch: {
    selectedColumns: {
      handler() {
        this.persistSelected()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
/* أدوات التحكم */
.controls {
  background: #f7f9fb;
  border: 1px solid #e0e6ef;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
}
.control-row.cols {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
}
.control-row.cols .label {
  font-family: 'MFontB';
  color: #333;
}
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
}

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
  page-break-after: always;
  break-after: page;
}

/* الملخص النهائي */
.overall-summary {
  margin-top: 10px;
}
.overall-summary .title {
  margin-top: 0;
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

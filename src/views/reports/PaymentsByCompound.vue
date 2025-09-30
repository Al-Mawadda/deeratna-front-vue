<template>
  <div class="ComponentWrapper">
    <!-- اختيار التاريخ (مدى زمني) -->
    <div class="MGroup">
      <MDate ref="PaymentsTotalReportFromDate" :Name="'PaymentsTotalReportFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true" />
    </div>

    <div class="MGroup">
      <div class="MButton" id="GetPaymentTotalBTN" @click="handleFetch">عرض البيانات</div>
    </div>

    <div class="container">
      <h2 class="title">مجاميع الدفع الالكتروني</h2>

      <div class="buttons">
        <button class="btn" @click="exportPDF" :disabled="!groupedTransactions.length">تصدير PDF</button>
        <button class="btn" @click="exportExcel" :disabled="!groupedTransactions.length">تصدير الى اكسل</button>
        <button class="btn" @click="printAll" :disabled="!groupedTransactions.length">طبـاعـــــة</button>
      </div>

      <div class="table-wrapper" v-if="groupedTransactions.length" ref="pdfRoot">
        <!-- كروب لكل خدمة -->
        <div v-for="group in groupedTransactions" :key="group.payment_key" class="group-block" ref="groupBlocks">
          <h3 class="group-title">{{ group.payment_label }}</h3>

          <table class="styled-table">
            <thead>
              <tr>
                <th>#</th>
                <th>المدينة</th>
                <th>المبلغ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in group.items" :key="group.payment_key + '__' + row.city">
                <td>{{ i + 1 }}</td>
                <td>{{ row.city }}</td>
                <td>{{ formatCurrency(row.total_amount) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>مجموع {{ group.payment_label }}</th>
                <th>{{ formatCurrency(group.group_total) }}</th>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- جدول مُلخّص نهائي -->
        <div class="summary">
          <h3 class="group-title">الملخّص</h3>
          <table class="styled-table">
            <thead>
              <tr>
                <th>الخدمة</th>
                <th>المجموع</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="group in groupedTransactions" :key="'sum_' + group.payment_key">
                <td>{{ group.payment_label }}</td>
                <td>{{ formatCurrency(group.group_total) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>الإجمالي العام</th>
                <th>{{ formatCurrency(grandTotal) }}</th>
              </tr>
            </tfoot>
          </table>
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
  name: 'TransactionsByServiceGrouped',
  data() {
    return {
      // الصفوف الخام القادمة من الـ API (قائمة مسطّحة city/payment/total)
      transactions: [],
      loading: false,
      errorMsg: '',
      // ترتيب الخدمات لعرض الكروبات بنفس الترتيب المطلوب
      order: ['Services', 'Electricity', 'Maintenance', 'Internet Renew', 'Internet Maintenance', 'Car Label Add', 'Car Label Renew', 'NFC Card Add', 'NFC Card Renew'],
    }
  },
  setup() {
    return {
      PaymentsTotalReportFromDate: ref(null),
      groupBlocks: ref([]),
    }
  },
  computed: {
    // تجميع النتائج حسب نوع الخدمة
    groupedTransactions() {
      if (!Array.isArray(this.transactions) || !this.transactions.length) return []

      const groups = {}
      for (const r of this.transactions) {
        const key = r.payment_key || r.payment_name || ''
        const label = r.payment_label || r.payment_name || key || 'غير محدد'
        const city = r.city || r.compound || 'غير محدد'
        const amt = Number(r.total_amount || 0)

        if (!groups[key]) {
          groups[key] = { payment_key: key, payment_label: label, items: [], group_total: 0 }
        }
        groups[key].items.push({ city, total_amount: amt })
        groups[key].group_total += amt
      }

      // ترتيب الكروبات حسب order
      const list = Object.values(groups)
      list.sort((a, b) => this.order.indexOf(a.payment_key) - this.order.indexOf(b.payment_key))

      // داخل كل كروب: ترتيب المدن أبجدياً
      list.forEach(g => {
        g.items.sort((x, y) => (x.city || '').localeCompare(y.city || '', 'ar'))
      })
      return list
    },

    // إجمالي كل الكروبات
    grandTotal() {
      return this.groupedTransactions.reduce((s, g) => s + (g.group_total || 0), 0)
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US').format(Number(value || 0))
    },

    exportPDF() {
      // نحفظ منطقة الطباعة (الكروبات + الملخص)
      const root = this.$refs.pdfRoot
      if (!root) return

      // نرفع scale لتحسين الدقة
      html2canvas(root, { scale: 2, useCORS: true, backgroundColor: '#1e1e2f' })
        .then(canvas => {
          const imgData = canvas.toDataURL('image/png')

          // إعدادات A4 بالميليمتر
          const pdf = new jsPDF('p', 'mm', 'a4')
          const pageWidth = 210
          const pageHeight = 297

          // احسب أبعاد الصورة داخل الـ PDF
          const imgWidth = pageWidth
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          let heightLeft = imgHeight
          let position = 0

          // الصفحة الأولى
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight

          // صفحات إضافية لو المحتوى طويل
          while (heightLeft > 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }

          pdf.save('transactions_by_service.pdf')
        })
        .catch(err => {
          console.error('PDF export failed:', err)
          alert('تعذر إنشاء ملف الـ PDF. حاول مجدداً أو اطبع كـ PDF من المتصفح.')
        })
    },

    // بناء باراميترات التاريخ من MDate
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

    getdata(params) {
      this.loading = true
      this.errorMsg = ''
      api
        .get('getPaymentsCompounds', { params })
        .then(res => {
          if (res.data?.success) {
            // تطبيع الحقول لضمان وجود city/payment_key/payment_label/total_amount
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

    // تصدير: ورقة لكل خدمة + Summary
    exportExcel() {
      if (!this.groupedTransactions.length) return
      const wb = XLSX.utils.book_new()

      // ورقة لكل خدمة
      this.groupedTransactions.forEach(group => {
        const rows = group.items.map((it, idx) => ({
          '#': idx + 1,
          city: it.city,
          total_amount: it.total_amount,
        }))
        rows.push({ '#': '', city: `Total ${group.payment_label}`, total_amount: group.group_total })

        const ws = XLSX.utils.json_to_sheet(rows)
        const safeName = (group.payment_label || group.payment_key || 'Sheet').toString().slice(0, 28)
        XLSX.utils.book_append_sheet(wb, ws, safeName)
      })

      // ورقة الملخّص
      const summary = this.groupedTransactions.map(g => ({
        service: g.payment_label,
        total_amount: g.group_total,
      }))
      summary.push({ service: 'Grand Total', total_amount: this.grandTotal })
      const wsSum = XLSX.utils.json_to_sheet(summary)
      XLSX.utils.book_append_sheet(wb, wsSum, 'Summary')

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'transactions_by_service.xlsx')
    },

    // طباعة كل الجداول (الكروبات + الملخّص)
    printAll() {
      if (!this.$el) return
      const printable = this.$el.querySelector('.table-wrapper')
      if (!printable) return
      const printContents = printable.innerHTML
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload()
    },
  },
}
</script>

<style scoped>
#PaymentsTotalReportFromDate {
  max-width: 400px;
}

/* Container */
.container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  background: #1e1e2f;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Title */
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  color: white;
  font-family: 'MFontB';
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* Buttons */
.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
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

/* Table Wrapper */
.table-wrapper {
  display: grid;
  gap: 22px;
}

/* Group block */
.group-block {
  background: #202036;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.group-title {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-family: 'MFontB';
  color: burlywood;
}

/* Styled Table */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #2a2a3d;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.styled-table th,
.styled-table td {
  padding: 10px 16px;
  text-align: center;
  font-family: 'MFontB';
  font-size: 16px;
}
.styled-table thead tr {
  background-color: #00d1b2;
  color: #1e1e2f;
  font-weight: bold;
}
.styled-table tbody tr {
  border-bottom: 1px solid #444;
  transition: background 0.3s;
}
.styled-table tbody tr:hover {
  background-color: #3a3a55;
}
.styled-table tfoot tr {
  background-color: #11112b;
  font-weight: bold;
  color: #00d1b2;
  border-top: 2px solid #00d1b2;
}

/* Summary */
.summary {
  background: #202036;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.empty-state {
  text-align: center;
  padding: 30px 10px;
  color: #c7c7d9;
  font-family: 'MFontB';
}
</style>

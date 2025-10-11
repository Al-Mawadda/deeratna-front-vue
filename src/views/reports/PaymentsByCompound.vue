<template>
  <div class="ComponentWrapper" dir="rtl">
    <!-- التاريخ -->
    <div class="MGroup">
      <MDate ref="PaymentsTotalReportFromDate" :Name="'PaymentsTotalReportFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true" />
    </div>

    <div class="MGroup">
      <div class="MButton" id="GetPaymentTotalBTN" @click="handleFetch">عرض البيانات</div>
    </div>

    <div class="container">
      <!-- أدوات التحكم -->
      <div class="controls">
        <div class="control-row">
          <label>حجم خط عناوين الأعمدة:</label>
          <input type="range" min="12" max="28" v-model.number="headerFontSize" />
          <span class="val">{{ headerFontSize }}px</span>
        </div>

        <div class="control-row toggles">
          <label class="toggle">
            <input type="checkbox" v-model="showServices" />
            <span>إظهار الصفحة 1: الدفع الإلكتروني لتطبيق ديرتنا حسب الخدمة</span>
          </label>
          <label class="toggle">
            <input type="checkbox" v-model="showServicesWithMergedCol" />
            <span>إظهار الصفحة 2: الدفع الالكتروني + الكاش لتطبيق ديرتنا (مدمج)</span>
          </label>
          <label class="toggle">
            <input type="checkbox" v-model="showServicesWithCashCol" />
            <span>إظهار الصفحة 3: الدفع الالكتروني + الكاش لتطبيق ديرتنا (مفصل)</span>
          </label>
          <!-- <label class="toggle">
            <input type="checkbox" v-model="showMerged" />
            <span>إظهار الصفحة 4: «صيانة المنازل (مجمّع)»</span>
          </label> -->
        </div>
      </div>

      <div class="buttons">
        <button class="btn" @click="exportPDF" :disabled="!hasAnyData">تصدير PDF</button>
        <button class="btn" @click="exportExcel" :disabled="!hasAnyData">تصدير الى اكسل</button>
        <button class="btn" @click="printAll" :disabled="!hasAnyData">طبـاعـــــة</button>
      </div>

      <div class="print-root" v-if="hasAnyData" ref="printRoot">
        <!-- الصفحة 1: الخدمات (من transactions) -->
        <div class="pdf-section" v-if="showServices && pivotRows.length">
          <h2 class="title">{{ titleServices }}</h2>
          <div class="table-wrapper">
            <table class="styled-table pivot" :style="tableVars">
              <colgroup>
                <col :style="{ width: getWidth('city') }" />
                <col v-for="k in pivotKeysShown" :key="'col_svc_' + k" :style="{ width: getWidth(k) }" />
              </colgroup>
              <thead>
                <tr>
                  <th class="head-cell city">المدينة</th>
                  <th class="head-cell" v-for="k in pivotKeysShown" :key="'h_svc_' + k">
                    {{ labelsMap[k] || k }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in pivotRows" :key="'row_svc_' + idx">
                  <td class="city">{{ r.city }}</td>
                  <td v-for="k in pivotKeysShown" :key="'c_svc_' + idx + '_' + k">
                    {{ formatCurrency(r[k] || 0) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="totals-row">
                  <th class="city">المجموع</th>
                  <th v-for="k in pivotKeysShown" :key="'t_svc_' + k">
                    {{ formatCurrency(colTotals[k] || 0) }}
                  </th>
                </tr>
                <tr class="grand-row">
                  <th class="city">الإجمالي الكلي</th>
                  <th class="grand-amount" :colspan="pivotKeysShown.length">
                    {{ formatCurrency(grandTotal) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- الصفحة2: الخدمات (دمج «صيانة المنازل» الإلكتروني + الكاش في عمود واحد) -->
        <div class="pdf-section" v-if="showServicesWithMergedCol && pivotRowsWithMerged.length">
          <h2 class="title">{{ titleServicesWithMergedCol }}</h2>
          <div class="table-wrapper">
            <table class="styled-table pivot" :style="tableVars">
              <colgroup>
                <col :style="{ width: getWidth('city') }" />
                <col v-for="k in pivotKeysShownWithMerged" :key="'col_mrg_' + k" :style="{ width: getWidth(k) }" />
              </colgroup>
              <thead>
                <tr>
                  <th class="head-cell city">المدينة</th>
                  <th class="head-cell" v-for="k in pivotKeysShownWithMerged" :key="'h_mrg_' + k">
                    {{ labelsMap[k] || k }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in pivotRowsWithMerged" :key="'row_mrg_' + idx">
                  <td class="city">{{ r.city }}</td>
                  <td v-for="k in pivotKeysShownWithMerged" :key="'c_mrg_' + idx + '_' + k">
                    {{ formatCurrency(r[k] || 0) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="totals-row">
                  <th class="city">المجموع</th>
                  <th v-for="k in pivotKeysShownWithMerged" :key="'t_mrg_' + k">
                    {{ formatCurrency(colTotalsWithMerged[k] || 0) }}
                  </th>
                </tr>
                <tr class="grand-row">
                  <th class="city">الإجمالي الكلي</th>
                  <th class="grand-amount" :colspan="pivotKeysShownWithMerged.length">
                    {{ formatCurrency(grandTotalWithMerged) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <!-- الصفحة3: الخدمات + عمود "صيانة المنازل (كاش)" -->
        <div class="pdf-section" v-if="showServicesWithCashCol && pivotRowsWithCash.length">
          <h2 class="title">{{ titleServicesWithCashCol }}</h2>
          <div class="table-wrapper">
            <table class="styled-table pivot" :style="tableVars">
              <colgroup>
                <col :style="{ width: getWidth('city') }" />
                <col v-for="k in pivotKeysShownWithCash" :key="'col_mix_' + k" :style="{ width: getWidth(k) }" />
              </colgroup>
              <thead>
                <tr>
                  <th class="head-cell city">المدينة</th>
                  <th class="head-cell" v-for="k in pivotKeysShownWithCash" :key="'h_mix_' + k">
                    {{ labelsMapAll[k] || k }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in pivotRowsWithCash" :key="'row_mix_' + idx">
                  <td class="city">{{ r.city }}</td>
                  <td v-for="k in pivotKeysShownWithCash" :key="'c_mix_' + idx + '_' + k">
                    {{ formatCurrency(r[k] || 0) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="totals-row">
                  <th class="city">المجموع</th>
                  <th v-for="k in pivotKeysShownWithCash" :key="'t_mix_' + k">
                    {{ formatCurrency(colTotalsWithCash[k] || 0) }}
                  </th>
                </tr>
                <tr class="grand-row">
                  <th class="city">الإجمالي الكلي</th>
                  <th class="grand-amount" :colspan="pivotKeysShownWithCash.length">
                    {{ formatCurrency(grandTotalWithCash) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- الصفحة4: صيانة المنازل (مجمّع = إلكتروني + كاش) -->
        <div class="pdf-section" v-if="showMerged && mergedMaintenanceRows.length">
          <h2 class="title">{{ titleMerged }}</h2>
          <div class="table-wrapper">
            <table class="styled-table pivot" :style="tableVars">
              <colgroup>
                <col :style="{ width: getWidth('city') }" />
                <col :style="{ width: getWidth('MergedSingle') }" />
              </colgroup>
              <thead>
                <tr>
                  <th class="head-cell city">المدينة</th>
                  <th class="head-cell">صيانة المنازل</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in mergedMaintenanceRows" :key="'row_merge_' + idx">
                  <td class="city">{{ r.city }}</td>
                  <td>{{ formatCurrency(r.amount || 0) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="totals-row">
                  <th class="city">المجموع</th>
                  <th>{{ formatCurrency(mergedMaintenanceTotal) }}</th>
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
  name: 'PaymentsByServiceWithCashMaintenance',
  data() {
    return {
      transactions: [],
      maintenanceCash: [],

      // ترتيب الأعمدة للخدمات
      pivotKeysOrder: ['Services', 'Electricity', 'Maintenance', 'Internet Renew', 'Internet Maintenance', 'Car Label', 'NFC Card'],
      labelsMap: {
        Services: 'الخدمات',
        Electricity: 'المولد',
        Maintenance: 'صيانة المنازل',
        'Internet Renew': 'اشتراكات الانترنت',
        'Internet Maintenance': 'صيانة الانترنت',
        'Car Label': 'ليبل السيارات',
        'NFC Card': 'الباجات',
      },

      cashColKey: 'Maintenance Cash',
      cashColLabel: 'صيانة المنازل (كاش)',

      // ترتيب مدن الأمل
      cityPins: ['الامل 1', 'الامل 2', 'الامل 3', 'الامال'],

      // عرض الأعمدة (داخلي)
      columnWidths: {
        city: 140,
        Services: 140,
        Electricity: 140,
        Maintenance: 160,
        'Maintenance Cash': 160,
        'Internet Renew': 170,
        'Internet Maintenance': 180,
        'Car Label': 150,
        'NFC Card': 130,
        MergedSingle: 180,
      },
      headerFontSize: 16,

      // التoggles
      showServices: true,
      showServicesWithCashCol: false,
      showMerged: false,
      showServicesWithMergedCol: false, // ← الصفحة الجديدة

      loading: false,
      errorMsg: '',
    }
  },
  setup() {
    return { PaymentsTotalReportFromDate: ref(null), printRoot: ref(null) }
  },
  computed: {
    tableVars() {
      return { '--th-font-size': this.headerFontSize + 'px' }
    },

    hasAnyData() {
      return (this.showServices && this.pivotRows.length) || (this.showServicesWithCashCol && this.pivotRowsWithCash.length) || (this.showMerged && this.mergedMaintenanceRows.length) || (this.showServicesWithMergedCol && this.pivotRowsWithMerged.length)
    },

    pivotKeysShown() {
      return this.pivotKeysOrder
    },

    /* ===== الصفحة 1: الإلكتروني حسب الخدمة ===== */
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
          const ia = this.cityIndex(a),
            ib = this.cityIndex(b)
          if (ia !== ib) return ia - ib
          return (a || '').localeCompare(b || '', 'ar', { numeric: true, sensitivity: 'base' })
        })
        .map(city => {
          const row = { city }
          for (const k of this.pivotKeysShown) row[k] = Number(byCity[city][k] || 0)
          return row
        })
    },
    colTotals() {
      const totals = {}
      for (const k of this.pivotKeysShown) totals[k] = 0
      for (const r of this.pivotRows) for (const k of this.pivotKeysShown) totals[k] += Number(r[k] || 0)
      return totals
    },
    grandTotal() {
      return Object.values(this.colTotals).reduce((s, v) => s + Number(v || 0), 0)
    },

    /* ===== الصفحة 2: الإلكتروني + عمود الكاش ===== */
    pivotKeysShownWithCash() {
      const keys = [...this.pivotKeysOrder]
      const i = keys.indexOf('Maintenance')
      const already = keys.includes(this.cashColKey)
      if (i !== -1 && !already) keys.splice(i + 1, 0, this.cashColKey)
      return keys
    },
    labelsMapAll() {
      return { ...this.labelsMap, [this.cashColKey]: this.cashColLabel }
    },
    pivotRowsWithCash() {
      if (!Array.isArray(this.transactions) || !this.transactions.length) {
        if (!this.cashRows.length) return []
        const citiesOnlyCash = [...new Set(this.cashRows.map(r => r.city))]
        return citiesOnlyCash
          .sort((a, b) => {
            const ia = this.cityIndex(a),
              ib = this.cityIndex(b)
            if (ia !== ib) return ia - ib
            return (a || '').localeCompare(b || '', 'ar', { numeric: true, sensitivity: 'base' })
          })
          .map(city => {
            const row = { city }
            for (const k of this.pivotKeysOrder) row[k] = 0
            row[this.cashColKey] = Number(this.maintenanceCashMap[city] || 0)
            return row
          })
      }

      const byCity = {}
      for (const r of this.transactions) {
        const city = r.city || r.compound || 'غير محدد'
        const key = r.payment_key || r.payment_name || ''
        const amount = Number(r.total_amount || 0)
        if (!byCity[city]) byCity[city] = {}
        byCity[city][key] = (byCity[city][key] || 0) + amount
      }

      return Object.keys(byCity)
        .concat(Object.keys(this.maintenanceCashMap))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => {
          const ia = this.cityIndex(a),
            ib = this.cityIndex(b)
          if (ia !== ib) return ia - ib
          return (a || '').localeCompare(b || '', 'ar', { numeric: true, sensitivity: 'base' })
        })
        .map(city => {
          const row = { city }
          for (const k of this.pivotKeysOrder) row[k] = Number((byCity[city] && byCity[city][k]) || 0)
          row[this.cashColKey] = Number(this.maintenanceCashMap[city] || 0)
          return row
        })
    },
    colTotalsWithCash() {
      const totals = {}
      for (const k of this.pivotKeysShownWithCash) totals[k] = 0
      for (const r of this.pivotRowsWithCash) for (const k of this.pivotKeysShownWithCash) totals[k] += Number(r[k] || 0)
      return totals
    },
    grandTotalWithCash() {
      return Object.values(this.colTotalsWithCash).reduce((s, v) => s + Number(v || 0), 0)
    },

    /* ===== حسابات الكاش/المجمّع ===== */
    cashRows() {
      if (!Array.isArray(this.maintenanceCash) || !this.maintenanceCash.length) return []
      const rows = this.maintenanceCash.map(x => ({
        city: x.city ?? x.compound ?? 'غير محدد',
        amount: Number(x.total_amount ?? 0),
      }))
      rows.sort((a, b) => {
        const ia = this.cityIndex(a.city),
          ib = this.cityIndex(b.city)
        if (ia !== ib) return ia - ib
        return (a.city || '').localeCompare(b.city || '', 'ar', { numeric: true, sensitivity: 'base' })
      })
      return rows
    },
    cashTotal() {
      return this.cashRows.reduce((s, r) => s + Number(r.amount || 0), 0)
    },

    maintenanceElectronicMap() {
      const map = {}
      for (const r of this.transactions) {
        const city = r.city || r.compound || 'غير محدد'
        const key = r.payment_key || r.payment_name || ''
        if (key !== 'Maintenance') continue
        map[city] = (map[city] || 0) + Number(r.total_amount || 0)
      }
      return map
    },
    maintenanceCashMap() {
      const map = {}
      for (const r of this.cashRows) {
        map[r.city] = (map[r.city] || 0) + Number(r.amount || 0)
      }
      return map
    },

    /* ===== الصفحة 3: صيانة المنازل (مجمّع) ===== */
    mergedMaintenanceRows() {
      const cities = new Set([...Object.keys(this.maintenanceElectronicMap), ...Object.keys(this.maintenanceCashMap)])
      const rows = []
      cities.forEach(city => {
        const e = Number(this.maintenanceElectronicMap[city] || 0)
        const c = Number(this.maintenanceCashMap[city] || 0)
        rows.push({ city, amount: e + c })
      })
      rows.sort((a, b) => {
        const ia = this.cityIndex(a.city),
          ib = this.cityIndex(b.city)
        if (ia !== ib) return ia - ib
        return (a.city || '').localeCompare(b.city || '', 'ar', { numeric: true, sensitivity: 'base' })
      })
      return rows
    },
    mergedMaintenanceTotal() {
      return this.mergedMaintenanceRows.reduce((s, r) => s + Number(r.amount || 0), 0)
    },

    /* ===== الصفحة 4: الخدمات (صيانة المنازل = إلكتروني + كاش) ===== */
    pivotKeysShownWithMerged() {
      // نفس ترتيب الخدمات الأصلي بدون إضافة عمود الكاش
      return this.pivotKeysOrder
    },
    pivotRowsWithMerged() {
      // اتحاد المدن من المعاملات + الكاش (حتى لو مدينة عندها كاش فقط)
      const byCity = {}
      for (const r of this.transactions) {
        const city = r.city || r.compound || 'غير محدد'
        const key = r.payment_key || r.payment_name || ''
        const amount = Number(r.total_amount || 0)
        if (!byCity[city]) byCity[city] = {}
        byCity[city][key] = (byCity[city][key] || 0) + amount
      }
      const allCities = new Set([...Object.keys(byCity), ...Object.keys(this.maintenanceCashMap)])

      return Array.from(allCities)
        .sort((a, b) => {
          const ia = this.cityIndex(a),
            ib = this.cityIndex(b)
          if (ia !== ib) return ia - ib
          return (a || '').localeCompare(b || '', 'ar', { numeric: true, sensitivity: 'base' })
        })
        .map(city => {
          const row = { city }
          for (const k of this.pivotKeysOrder) {
            if (k === 'Maintenance') {
              const e = Number((byCity[city] && byCity[city]['Maintenance']) || 0)
              const c = Number(this.maintenanceCashMap[city] || 0)
              row[k] = e + c // ← الدمج هنا
            } else {
              row[k] = Number((byCity[city] && byCity[city][k]) || 0)
            }
          }
          return row
        })
    },
    colTotalsWithMerged() {
      const totals = {}
      for (const k of this.pivotKeysShownWithMerged) totals[k] = 0
      for (const r of this.pivotRowsWithMerged) {
        for (const k of this.pivotKeysShownWithMerged) totals[k] += Number(r[k] || 0)
      }
      return totals
    },
    grandTotalWithMerged() {
      return Object.values(this.colTotalsWithMerged).reduce((s, v) => s + Number(v || 0), 0)
    },

    /* عناوين الصفحات */
    titleServices() {
      const [from, to] = this.getPickedDates()
      if (from && to && this.sameMonth(from, to)) return `الدفع الالكتروني لتطبيق ديرتنا حسب الخدمة للشهر ${from.getMonth() + 1}/${from.getFullYear()}`
      if (from && to) return `الدفع الالكتروني لتطبيق ديرتنا حسب الخدمة للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      return 'الدفع الالكتروني  لتطبيق ديرتنا حسب الخدمة'
    },
    titleServicesWithMergedCol() {
      const [from, to] = this.getPickedDates()
      if (from && to && this.sameMonth(from, to)) return `الدفع الالكتروني + الكاش لتطبيق ديرتنا للشهر ${from.getMonth() + 1}/${from.getFullYear()}`
      if (from && to) return `الدفع الالكتروني + الكاش لتطبيق ديرتنا للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      return 'الخدمات — صيانة المنازل (مُدمَجة)'
    },
    titleServicesWithCashCol() {
      const [from, to] = this.getPickedDates()
      if (from && to && this.sameMonth(from, to)) return `الدفع الالكتروني + الكاش لتطبيق ديرتنا (مفصل) حسب الخدمة للشهر ${from.getMonth() + 1}/${from.getFullYear()}`
      if (from && to) return `الدفع الالكتروني + الكاش لتطبيق ديرتنا حسب الخدمة للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      return 'الخدمات + صيانة المنازل كاش (عمود إضافي)'
    },
    titleMerged() {
      const [from, to] = this.getPickedDates()
      if (from && to && this.sameMonth(from, to)) return `مجموع مبالغ صيانة المنازل (الكتروني + كاش) للشهر ${from.getMonth() + 1}/${from.getFullYear()}`
      if (from && to) return `مجموع مبالغ صيانة المنازل للفترة ${from.toLocaleDateString('ar')} - ${to.toLocaleDateString('ar')}`
      return 'صيانة المنازل (مجمّع)'
    },
  },
  methods: {
    formatCurrency(v) {
      return new Intl.NumberFormat('en-US').format(Number(v || 0))
    },

    getPickedDates() {
      const picked = this?.PaymentsTotalReportFromDate?.Get?.() || []
      const from = picked[0] ? new Date(picked[0]) : null
      const to = picked[1] ? new Date(picked[1]) : null
      return [from, to]
    },
    sameMonth(a, b) {
      return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
    },

    // عرض عمود (ثابت داخلياً – لا يوجد UI له)
    getWidth(key) {
      const w = this.columnWidths?.[key]
      const num = Number.isFinite(w) ? w : 140
      return Math.max(60, Math.min(num, 400)) + 'px'
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
      const params = this.buildDateParams()
      this.fetchServices(params)
      this.fetchMaintenanceCash(params)
    },

    fetchServices(params) {
      this.loading = true
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
          }
        })
        .catch(() => {
          this.transactions = []
        })
        .finally(() => {
          this.loading = false
        })
    },

    fetchMaintenanceCash(params) {
      api
        .get('getMaintenanceCashByCompound', { params })
        .then(res => {
          if (res.data?.success) {
            const rows = Array.isArray(res.data.data) ? res.data.data : []
            this.maintenanceCash = rows
          } else {
            this.maintenanceCash = []
          }
        })
        .catch(() => {
          this.maintenanceCash = []
        })
    },

    // يصدر فقط الصفحات المفعّلة (المعروضة)
    async exportPDF() {
      const root = this.$refs.printRoot
      if (!root) return
      if (document.fonts?.ready) {
        await document.fonts.ready.catch(() => {})
      }

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      let first = true

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
      pdf.save('services_cash_and_merged_maintenance.pdf')
    },

    // يضيف فقط الشيتات الخاصة بالصفحات المفعّلة
    exportExcel() {
      if (!this.hasAnyData) return
      const wb = XLSX.utils.book_new()

      // Sheet 1: الخدمات
      if (this.showServices && this.pivotRows.length) {
        const rows = this.pivotRows.map(r => {
          const obj = { المدينة: r.city }
          for (const k of this.pivotKeysShown) obj[this.labelsMap[k] || k] = r[k] || 0
          return obj
        })
        const totals = { المدينة: 'المجموع' }
        for (const k of this.pivotKeysShown) totals[this.labelsMap[k] || k] = this.colTotals[k] || 0
        rows.push(totals)
        const grand = { المدينة: 'الإجمالي الكلي' }
        for (const k of this.pivotKeysShown) grand[this.labelsMap[k] || k] = ''
        grand['الإجمالي العام'] = this.grandTotal
        rows.push(grand)
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'حسب الخدمة')
      }

      // Sheet 2: الخدمات + عمود «صيانة المنازل كاش»
      if (this.showServicesWithCashCol && this.pivotRowsWithCash.length) {
        const rows2 = this.pivotRowsWithCash.map(r => {
          const obj = { المدينة: r.city }
          for (const k of this.pivotKeysShownWithCash) obj[this.labelsMapAll[k] || k] = r[k] || 0
          return obj
        })
        const totals2 = { المدينة: 'المجموع' }
        for (const k of this.pivotKeysShownWithCash) totals2[this.labelsMapAll[k] || k] = this.colTotalsWithCash[k] || 0
        rows2.push(totals2)
        const grand2 = { المدينة: 'الإجمالي الكلي' }
        for (const k of this.pivotKeysShownWithCash) grand2[this.labelsMapAll[k] || k] = ''
        grand2['الإجمالي العام'] = this.grandTotalWithCash
        rows2.push(grand2)
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows2), 'الخدمات + كاش (عمود)')
      }

      // Sheet 3: صيانة المنازل (مجمّع)
      if (this.showMerged && this.mergedMaintenanceRows.length) {
        const rows3 = this.mergedMaintenanceRows.map(r => ({ المدينة: r.city, 'صيانة المنازل': r.amount }))
        rows3.push({ المدينة: 'المجموع', 'صيانة المنازل': this.mergedMaintenanceTotal })
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows3), 'صيانة المنازل (مجمّع)')
      }

      // Sheet 4: الخدمات (دمج «صيانة المنازل» الإلكتروني + الكاش)
      if (this.showServicesWithMergedCol && this.pivotRowsWithMerged.length) {
        const rows4 = this.pivotRowsWithMerged.map(r => {
          const obj = { المدينة: r.city }
          for (const k of this.pivotKeysShownWithMerged) obj[this.labelsMap[k] || k] = r[k] || 0
          return obj
        })
        const totals4 = { المدينة: 'المجموع' }
        for (const k of this.pivotKeysShownWithMerged) totals4[this.labelsMap[k] || k] = this.colTotalsWithMerged[k] || 0
        rows4.push(totals4)
        const grand4 = { المدينة: 'الإجمالي الكلي' }
        for (const k of this.pivotKeysShownWithMerged) grand4[this.labelsMap[k] || k] = ''
        grand4['الإجمالي العام'] = this.grandTotalWithMerged
        rows4.push(grand4)
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows4), 'الخدمات (دمج الصيانة)')
      }

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'services_cash_and_merged_maintenance.xlsx')
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
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ===== أدوات التحكم ===== */
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
.control-row.toggles {
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 12px 0;
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
.styled-table.pivot thead th {
  font-size: var(--th-font-size, 16px);
} /* ← يتحكم بها السلايدر */
.styled-table.pivot .head-cell.city,
.styled-table.pivot td.city {
  font-weight: bold;
}
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

.empty-state {
  text-align: center;
  padding: 30px 10px;
  color: #333;
  font-family: 'MFontB';
}
</style>

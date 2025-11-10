<template>
  <div class="ComponentWrapper" dir="rtl">
    <div class="MButton" id="ReloadCarLabelsBTN">اعادة تحميل البيانات</div>

    <MTable id="CarLabelsTB" ref="CarLabelsTB" :Name="'CarLabelsTB'" :DataArray="CarLabelsTBData"
      :Columns="CarLabelsTBColumns" :GetDataFunction="GetCarLabelsData" :RowsCount="CarLabelsTBRowsCount"
      :RowsPerPage="10">
      <template v-slot:options>
        <!-- خيار عرض/طباعة -->
        <div class="MTableOption" OptionEventName="ViewItem" title="عرض/طباعة الاستمارة">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path d="M500.2,249.6c124.1,1.1,233.2,42.7,328.2,122.1c39.6,33,72.3,72.7,106.8,110.6c9,9.9,8.7,25.5-0.8,36.4
              c-53.9,62.1-109.3,122.5-182.1,163.7c-66,37.4-136.2,60.8-212,66.4C399.6,759.2,276.4,716.6,169,626.3
              C130.9,594.3,99.2,556,66,519.3c-10-11-10.5-26-0.9-37.1c53.3-61.5,107.9-121.4,179.6-162.7c66.8-38.5,138-62.1,215.1-68.3
              C473.2,250.2,486.7,250.1,500.2,249.6z M504.7,308.1c-19.4,0.8-34.9,0.7-50.4,2.2c-61.5,6.1-119,24.8-173,54.6
              c-59.2,32.7-106.2,79.4-150.3,129.6c-4.1,4.7-3.1,8.1,0.7,12.1c21.3,22.2,40.9,45.9,63.9,66.5c86.2,77.3,186.4,118.2,302.7,118.9
              c68.3,0.4,133-14.2,194.7-43.2c70.8-33.3,126.2-85.4,176.6-143.7c4-4.6,2-7.9-1.3-11.3c-21.3-22.2-40.9-45.9-63.8-66.6
              C718.1,349.4,617.3,308.9,504.7,308.1z" />
              <path d="M392.3,499.7c0.2-59,49.3-108.3,108.1-107.4c60.6,0.9,107.4,47.4,107.2,108c-0.2,60.9-47.5,106.9-107.8,107.4
              C440.8,608.1,392.1,558.6,392.3,499.7z M500.2,556.5c30.5,0,56.4-25.9,56.4-56.4c0-30.6-25.7-56.5-56.2-56.6
              c-31-0.1-56.9,25.8-56.8,56.8C443.8,530.8,469.7,556.6,500.2,556.5z" />
            </svg>
          </div>
          <div class="MTableOptionName">عرض</div>
        </div>
      </template>
    </MTable>
  </div>
</template>

<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useGlobalsStore } from '../../stores/Globals.js'

export default {
  name: 'CarLabelsView',

  setup() {
    const GlobalsStore = ref(useGlobalsStore())
    return {
      GlobalsStore,
      CarLabelsTB: ref(null),
      CarLabelsTBData: ref([]),
      CarLabelsTBColumns: [
        { name: 'pid', label: '#' },
        { name: 'name', label: 'الاسم' },
        {
          name: 'real_estates.compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        { name: 'real_estates.address', label: 'العنوان' },
        {
          name: 'real_estates.relation',
          label: 'العلاقة',
        },
        {
          name: 'real_estates.guardian_name',
          label: 'اسم صاحب العقار',
        },
        { name: 'label_code', label: 'رمز الملصق' },
        { name: 'number', label: 'رقم العجلة' },
        { name: 'details', label: 'تفاصيل العجلة' },
        { name: 'label_status', label: 'الحالة' },
        { name: 'label_expire', label: 'تاريخ الانتهاء' },
        { name: 'phone', label: 'رقم الهاتف' },
        { name: 'label_suspension_reason', label: 'سبب التوقف' },
        { name: 'attributes.attribute', label: 'الصفة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Attributes || [],
         },
      ],
      CarLabelsTBRowsCount: ref(0),
    }
  },

  mounted() {
    this.CarLabelsTB.LoadMTable()

    const reloadBtn = document.getElementById('ReloadCarLabelsBTN')
    if (reloadBtn) reloadBtn.addEventListener('click', () => this.CarLabelsTB.ReLoadMTable())

    const tableEl = document.getElementById('CarLabelsTB')
    if (tableEl) {
      tableEl.addEventListener('ViewItem', e => {
        const row = e?.detail?.RowData || {}
        this.printCarLabel(row)
      })
    }
  },

  methods: {
    GetCarLabelsData(MTable) {
      api
        .get('GetCarLabelsData', { params: { MTable } })
        .then(res => {
          this.CarLabelsTBData = res.data.data
          this.CarLabelsTBRowsCount = res.data.total
        })
        .catch(err => {
          window.ShowMessage?.('حدث خطأ', err)
        })
    },

    _val(obj, path, fallback = '') {
      if (!obj) return fallback
      if (obj[path] !== undefined && obj[path] !== null) return obj[path]
      const parts = path.split('.')
      let cur = obj
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        if (Array.isArray(cur)) {
          cur = cur.map(v => (v && typeof v === 'object' ? v[p] : v)).filter(v => v !== undefined && v !== null && v !== '')
        } else if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
          cur = cur[p]
        } else {
          return fallback
        }
      }
      return Array.isArray(cur) ? Array.from(new Set(cur)).join(' ، ') : cur ?? fallback
    },

    // ======== طباعة A4 فارغة مع الحقول بالمليمتر ========
    printCarLabel(row) {
      // 1) البيانات
      const data = {
        name: this._val(row, 'name', ''),
        label_code: this._val(row, 'label_code', ''),
        address: this._val(row, 'real_estates.address') ?? this._val(row, 'real_estates_address', ''),
        number: this._val(row, 'number', ''),
        phone: this._val(row, 'phone', ''),
        attribute: this._val(row, 'attributes.attribute') ?? this._val(row, 'attribute', ''),
        details: this._val(row, 'details', ''),
        label_expire: this._val(row, 'label_expire', ''),
        compound: this._val(row, 'real_estates.compound') ?? this._val(row, 'real_estates_compound', ''),
        label_notes: this._val(row, 'label_notes', ''),
      }

      // 2) A4 وتموضع بالـ mm (عدّل حسب ما يلزمك)
      const PAGE_W_MM = 210,
        PAGE_H_MM = 297
      const POS = {
        name: { topMM: 78, leftMM: 112, widthMM: 85, align: 'right' },
        label_code: { topMM: 97, leftMM: 112, widthMM: 85, align: 'right' },
        address: { topMM: 111, leftMM: 112, widthMM: 85, align: 'right' },
        details: { topMM: 140, leftMM: 112, widthMM: 85, align: 'right' },
        label_expire: { topMM: 78, leftMM: 112, widthMM: 85, align: 'right' },
        attribute: { topMM: 88, leftMM: 20, widthMM: 75, align: 'right' },
        compound: { topMM: 99, leftMM: 20, widthMM: 75, align: 'right' },
        number: { topMM: 119, leftMM: 20, widthMM: 75, align: 'right' },
        phone: { topMM: 130, leftMM: 20, widthMM: 75, align: 'right' },
        label_notes: { topMM: 135, leftMM: 20, widthMM: 75, align: 'right' },
      }

      const escapeHTML = s =>
        String(s ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      const fieldHTML = (txt, pos) => {
        const style = `
          position:absolute; top:${pos.topMM}mm; left:${pos.leftMM}mm; width:${pos.widthMM}mm;
          text-align:${pos.align || 'right'}; font-size:4.6mm; font-weight:600;
          line-height:1.25; direction:rtl; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`
        return `<div style="${style}">${escapeHTML(txt)}</div>`
      }

      // 3) صفحة طباعة بإطار وترويسة، نفس طريقة الطباعة (iframe)
      const today = new Date().toISOString().slice(0, 10)
      const pageHTML = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>طباعة استمارة (A4)</title>
<style>
  @font-face { font-family: 'MFontB'; src: url('${new URL('../../assets/fonts/Tajawal-Bold.ttf', import.meta.url).href}') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'MFontR'; src: url('${new URL('../../assets/fonts/Tajawal-Regular.ttf', import.meta.url).href}') format('truetype'); font-weight: normal; font-style: normal; }
  @page { size: ${PAGE_W_MM}mm ${PAGE_H_MM}mm; margin: 0; }
  html, body { margin:0; padding:0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width: ${PAGE_W_MM}mm; height: ${PAGE_H_MM}mm; position: relative; margin: 0 auto; background:#fff; font-family: MFontB, MFontR, Tahoma, "Noto Naskh Arabic", system-ui, sans-serif; color:#000; }
  .frame { position:absolute; inset: 5mm; border: 2px solid #000; border-radius: 3mm; }
  .banner { position:absolute; left:5mm; right:5mm; top:5mm; height: 35mm; border:1px solid #333; border-radius: 2mm; overflow:hidden; }
  .banner-bg { height:100%; background: linear-gradient(135deg,#e4372f 0%, #f4c144 45%, #f7e6a0 70%, #e4372f 100%); opacity:.92; }
  .banner-row { position:absolute; inset:0; display:grid; grid-template-columns: 1fr 40mm 1fr; align-items:center; padding: 4mm 6mm; }
  .brand-en { text-align:left; font-weight:700; line-height:1.25; font-size: 4mm; }
  .brand-ar { text-align:right; font-weight:700; line-height:1.35; font-size: 4.4mm; }
  .logo { display:flex; justify-content:center; align-items:center; }
  .logo img { width: 28mm; height: 28mm; object-fit: contain; filter: drop-shadow(0 0 1px rgba(0,0,0,.3)); }
  .meta-box { position:absolute; right: 6mm; bottom: 4mm; background: rgba(255,255,255,.92); border: 1px solid #333; border-radius: 1.5mm; padding: 1.5mm 3mm; font-weight:700; font-size: 3.5mm; }
  .details { position:absolute; left: 8mm; right: 8mm; top: 35%;  display:grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .col { padding: 5mm 6mm; }
  .col:first-child { border-inline-start: none; }
  .row { display:grid; grid-template-columns: auto auto 1fr; align-items: baseline; column-gap: 2mm; margin: 4mm 0; font-size: 4.2mm; }
  .label { font-family: MFontB, Tahoma, sans-serif; font-weight:800; white-space: nowrap; }
  .sep { font-family: MFontB, Tahoma, sans-serif; font-weight:700; }
  .value { font-family: MFontB, Tahoma, sans-serif; border-bottom: .4mm dotted #bbb; min-height: 7mm; word-break: break-word; }
  .section-title { font-family: MFontB, Tahoma, sans-serif; font-size: 5.5mm; margin: 0 0 5mm; border-bottom: .5mm solid #000; padding-bottom: 1.5mm; }
  .notes { position:absolute; left: 8mm; right: 8mm; bottom: 8mm; font-size: 3.6mm; }
  .notes h4 { margin: 0 0 2mm; color: #b00; font-size: 4mm; }
  .rules { margin:0; padding-right: 5mm; }
  .rules li { margin: 1.5mm 0; }
  /* شاشة فقط */
  @media screen { body { background:#eaeaea; } .page { box-shadow:0 0 12px rgba(0,0,0,.25); margin-top:10px; } }
</style>
</head>
<body>
  <div class="page">
    <div class="frame"></div>
    <!-- تم إلغاء الترويسة (banner) وترك مساحة فارغة عوضاً عنها -->
    <div class="details">
      <div class="col">
        <div class="section-title">بيانات الساكن</div>
        <div class="row"><div class="label">الاسم الثلاثي</div><div class="sep">:</div><div class="value">${escapeHTML(data.name)}</div></div>
        <div class="row"><div class="label">اسم المدينة</div><div class="sep">:</div><div class="value">${escapeHTML(data.compound)}</div></div>
        <div class="row"><div class="label">عنوان السكن</div><div class="sep">:</div><div class="value">${escapeHTML(data.address)}</div></div>
        <div class="row"><div class="label">رقم الهاتف</div><div class="sep">:</div><div class="value">${escapeHTML(data.phone)}</div></div>
        <div class="row"><div class="label">الصفة</div><div class="sep">:</div><div class="value">${escapeHTML(data.attribute)}</div></div>
      </div>
      <div class="col">
        <div class="section-title">بيانات الملصق</div>
        <div class="row"><div class="label">رمز الملصق</div><div class="sep">:</div><div class="value">${escapeHTML(data.label_code)}</div></div>
        <div class="row"><div class="label">رقم العجلة</div><div class="sep">:</div><div class="value">${escapeHTML(data.number)}</div></div>
        <div class="row"><div class="label">تفاصيل العجلة</div><div class="sep">:</div><div class="value">${escapeHTML(data.details)}</div></div>
        <div class="row"><div class="label">تاريخ الانتهاء</div><div class="sep">:</div><div class="value">${escapeHTML(data.label_expire)}</div></div>
        <div class="row"><div class="label">الملاحظات</div><div class="sep">:</div><div class="value">${escapeHTML(data.label_notes)}</div></div>
      </div>
    </div>

  </div>
</body>
</html>`.trim()

      this._printWithIframe(pageHTML)
    },

    // يطبع عبر iframe داخل نفس التبويب
    _printWithIframe(html) {
      const iframe = document.createElement('iframe')
      Object.assign(iframe.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        width: '0',
        height: '0',
        border: '0',
      })
      iframe.setAttribute('aria-hidden', 'true')
      document.body.appendChild(iframe)

      const win = iframe.contentWindow || iframe
      const doc = win.document
      doc.open()
      doc.write(html)
      doc.close()

      setTimeout(() => {
        win.focus()
        win.print()
        setTimeout(() => document.body.removeChild(iframe), 400)
      }, 120)
    },
  },
}
</script>

<style scoped>
.MButton {
  display: inline-block;
  background: #3b82f6;
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 12px;
}

.MButton:hover {
  opacity: 0.9;
}

.MTableOption {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  background: #f3f4f6;
}

.MTableOption:hover {
  background: #e5e7eb;
}

.MTableOptionIcon {
  width: 18px;
  height: 18px;
}

.MTableOptionName {
  font-size: 12px;
}
</style>

<template>
  <div class="ComponentWrapper">
    <!-- ========= InternetRequest Model======== -->
    <MModal ref="InternetRequestModal" :Name="'InternetRequestModal'" :Title="' طلب ' + selectedRowData.request_type + ' اشتراك انترنت ' + selectedRowData.name">
      <!-- ============= details Table =============== -->
      <table cellpadding="0" cellspacing="0" class="RequestsMTable">
        <thead>
          <tr>
            <th>الحقل</th>
            <th>القيمة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>الاسم</td>
            <td>{{ selectedRowData.name }}</td>
          </tr>
          <tr>
            <td>المدينة</td>
            <td>{{ selectedRowData.compound }}</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td>{{ selectedRowData.address }}</td>
          </tr>
          <tr>
            <td>الهاتف</td>
            <td>{{ selectedRowData.phone }}</td>
          </tr>
          <tr>
            <td>هاتف الاشتراك</td>
            <td>{{ selectedRowData.subscriber_phone }}</td>
          </tr>
          <tr>
            <td>الشركة</td>
            <td>{{ selectedRowData.company_name }}</td>
          </tr>
          <tr>
            <td>الاشتراك</td>
            <td>{{ selectedRowData.subscription_type }}</td>
          </tr>
          <tr>
            <td>السعر</td>
            <td>{{ selectedRowData.price }}</td>
          </tr>
          <tr>
            <td>نوع الطلب</td>
            <td>{{ selectedRowData.request_type }}</td>
          </tr>
          <tr>
            <td>حالة الطلب</td>
            <td>{{ selectedRowData.request_status }}</td>
          </tr>
          <tr>
            <td>تاريخ الطلب</td>
            <td>{{ selectedRowData.created_at }}</td>
          </tr>
          <tr v-if="selectedRowData.rejection_reason != ''">
            <td>سبب الرفض</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
          </tr>
        </tbody>
      </table>

      <div class="MField" id="SubscriberName">
        <input :Disabled="selectedRowData.request_status == 'تم'" type="text" required />
        <label>اسم المشترك</label>
        <div class="MFieldBG"></div>
      </div>

      <div class="MField" id="SubscriberPhone" v-OnlyNumbers>
        <input :Disabled="selectedRowData.request_status == 'تم'" type="text" required />
        <label>رقم هاتف الاشتراك</label>
        <div class="MFieldBG"></div>
      </div>

      <MComboBox :Clearable="true" :Disabled="selectedRowData.request_status == 'تم'" ref="CompanyName" :Name="'CompanyName'" :Label="' اسم الشركة *'" :Items="CompanyNamesItems" :ItemsName="'company_name'" />
      <MComboBox :Clearable="true" :Disabled="selectedRowData.request_status == 'تم'" ref="SubscriptionType" :Name="'SubscriptionType'" :Label="' نوع الاشتراك *'" :Items="SubscriptionTypeItems" :ItemsName="'subscription_type'" />
      <div class="MField" id="Price">
        <input type="text" required disabled />
        <label>السعر</label>
        <div class="MFieldBG"></div>
      </div>

      <!-- نستمع لحدث المكوّن + عندنا باك-أب -->
      <MDate v-show="selectedRowData.request_type == 'تجديد'" ref="InternetActivationDate" :Name="'InternetActivationDate'" :Label="'تاريخ التفعيل'" @m-date-value-change="UpdateExpireFromActivation" @MDateValueChange="UpdateExpireFromActivation" />
      <MDate v-show="selectedRowData.request_type == 'تجديد'" ref="InternetExpireDate" :Name="'InternetExpireDate'" :Label="'تاريخ الانتهاء'" />

      <!--========== Images ==========-->
      <div v-show="selectedRowData.request_type != 'تجديد'" class="ImagesContainer">
        <div class="RequestImage" v-if="selectedRowData.id_image != ''">
          <div class="RequestImageTitle">بطاقة موحدة</div>
          <div class="RequestImagePreview" @click="ShowImage">
            <div class="RequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000"><path d="M450.2565,36.0294c...Z" fill="white" /></svg>
            </div>
            <img :src="IDImage" />
          </div>
        </div>

        <div class="RequestImage" v-if="selectedRowData.id_image_back != ''">
          <div class="RequestImageTitle">ضهر البطاقة الموحدة</div>
          <div class="RequestImagePreview" @click="ShowImage">
            <div class="RequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000"><path d="M450.2565,36.0294c...Z" fill="white" /></svg>
            </div>
            <img :src="IDImageBack" />
          </div>
        </div>

        <div class="RequestImage" v-if="selectedRowData.housing_image != ''">
          <div class="RequestImageTitle">بطاقة السكن</div>
          <div class="RequestImagePreview" @click="ShowImage">
            <div class="RequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000"><path d="M450.2565,36.0294c...Z" fill="white" /></svg>
            </div>
            <img :src="HousingImage" />
          </div>
        </div>

        <div class="RequestImage" v-if="selectedRowData.housing_image_back != ''">
          <div class="RequestImageTitle">ضهر بطاقة السكن</div>
          <div class="RequestImagePreview" @click="ShowImage">
            <div class="RequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000"><path d="M450.2565,36.0294c...Z" fill="white" /></svg>
            </div>
            <img :src="HousingImageBack" />
          </div>
        </div>
      </div>

      <div class="ModalButtons">
        <div v-show="(selectedRowData.request_type == 'نصب' && selectedRowData.request_status == 'قيد المراجعة') || (selectedRowData.request_type == 'تجديد' && selectedRowData.request_status != 'تم')" class="MButton" id="AcceptBTN" @click="AcceptRequest()">موافق</div>

        <div v-show="selectedRowData.request_status == 'قيد المراجعة'" class="MButton" id="RejectBTN">رفض</div>

        <div v-show="selectedRowData.request_type == 'نصب' || selectedRowData.request_type == 'تجديد'" class="MButton" id="CloseRequestBTN" @click="CloseRequest()">تحديث وغلق الطلب</div>
      </div>
    </MModal>

    <!-- ========= Reject Model======== -->
    <MModal ref="InternetRequestRejectModal" :Name="'InternetRequestRejectModal'" :Title="'رفض الطلب'">
      <div class="MField" id="RejectionReason">
        <input type="text" required />
        <label>سبب الرفض</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SaveRejectRequest">حفظ</div>
      </div>
    </MModal>

    <div class="MButton" id="GetInternetRequestsBTN">عرض البيانات</div>

    <div class="MGroup">
      <MDate ref="InternetRequestsFromDate" :Name="'InternetRequestsFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true" />
    </div>

    <MTable ref="InternetRequestsTB" :Name="'InternetRequestsTB'" :DataArray="InternetRequestsTBData" :Columns="InternetRequestsTBColumns" :Sums="InternetRequestsTBSums" :GetDataFunction="GetInternetRequestsData" :RowsCount="InternetRequestsTBRowsCount" :RowsPerPage="10">
      <template v-slot:options>
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000"><path d="M500.2,249.6..." /></svg>
          </div>
          <div class="MTableOptionName">عرض</div>
        </div>
      </template>
    </MTable>
  </div>
</template>

<script>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { api, GetServerPath } from '../../axios'
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())
    return {
      IDImage: ref(''),
      InternetActivationDate: ref(null),
      InternetExpireDate: ref(null),
      SuppressExpireSync: ref(false),
      InternetRequestModal: ref(null),
      InternetRequestRejectModal: ref(null),
      HousingImage: ref(''),
      IDImageBack: ref(''),
      HousingImageBack: ref(''),
      CompanyName: ref(null),
      CompanyNameItems: ref([]),
      SubscriptionType: ref(null),
      SubscriptionTypeItems: ref([]),
      CompanyNamesItems: ref([]),
      InternetRequestsTB: ref(null),
      InternetRequestsTBData: ref([]),
      InternetRequestsTBColumns: [
        { name: 'id', label: '#' },
        { name: 'pid', label: 'الرقم' },
        { name: 'compound', label: 'المدينة', filter: 'combo', filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [] },
        { name: 'subscriber_name', label: 'اسم المشترك' },
        { name: 'address', label: 'العنوان' },
        { name: 'subscriber_phone', label: 'رقم هاتف الاشتراك' },
        { name: 'company_name', label: 'الشركة' },
        { name: 'subscription_type', label: 'نوع الاشتراك' },
        { name: 'price', label: 'المبلغ', sum: true, type: 'currency' },
        { name: 'internet_activation_date', label: 'تاريخ التفعيل', filter: 'date' },
        { name: 'internet_expire_date', label: 'تاريخ الانتهاء', filter: 'date' },
        { name: 'request_type', label: 'نوع الطلب' },
        { name: 'request_status', label: 'حالة الطلب' },
        { name: 'created_at', label: 'التاريخ', filter: 'date' },
      ],
      InternetRequestsTBSums: ref([]),
      InternetRequestsTBRowsCount: ref(0),
      InternetRequestsFromDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: GetServerPath(),

      // مراقبة قيمة التفعيل لضمان التحديث دائمًا
      ActivationWatchTimer: ref(null),
      LastActivationValue: ref(''),
    }
  },

  mounted() {
    this.InternetRequestsTB.LoadMTable()
    this.GetInternetProfilesData()

    // زر عرض البيانات
    document.getElementById('GetInternetRequestsBTN').addEventListener('click', () => {
      ShowLoading()
      this.InternetRequestsTB.ReLoadMTable()
      HideLoading()
    })

    // فتح المودال عند اختيار صف
    document.getElementById('InternetRequestsTB').addEventListener('ViewItem', data => {
      this.selectedRowData = data.detail.RowData

      this.InternetActivationDate.Clear()
      this.InternetExpireDate.Clear()

      document.getElementById('SubscriberName').querySelector('input').value = this.selectedRowData.subscriber_name
      document.getElementById('SubscriberPhone').querySelector('input').value = this.selectedRowData.subscriber_phone

      this.CompanyName.Set(this.selectedRowData.company_name, 'company_name')
      this.SubscriptionType.Set(this.selectedRowData.subscription_type, 'subscription_type')
      document.getElementById('Price').querySelector('input').value = 0

      // ضبط مبدئي لتواريخ التجديد
      if (this.selectedRowData.request_type == 'تجديد' && this.selectedRowData.request_status == 'قيد المراجعة') {
        this.SuppressExpireSync = true
        const now = new Date()
        this.InternetActivationDate.Set(this.formatDateLocal(now))
        const expire = new Date(now)
        expire.setDate(expire.getDate() + 30)
        this.InternetExpireDate.Set(this.formatDateLocal(expire))
        this.SuppressExpireSync = false
      }

      if (this.selectedRowData.request_type == 'تجديد' && this.selectedRowData.request_status == 'تم') {
        this.SuppressExpireSync = true
        this.InternetActivationDate.Set(this.selectedRowData.internet_activation_date)
        this.InternetExpireDate.Set(this.selectedRowData.internet_expire_date)
        this.SuppressExpireSync = false
      }

      if (this.selectedRowData.company_name && this.selectedRowData.company_name != '') {
        this.CompanyName.Set(this.selectedRowData.company_name, 'company_name')
        setTimeout(() => {
          this.SubscriptionType.Set(this.selectedRowData.subscription_type, 'subscription_type')
        }, 100)
      }

      if (this.selectedRowData.request_type == 'نصب') {
        this.IDImage = `https://www.app.deeratna.net/backend/public/storage/internet_images/id/${this.selectedRowData.id}.jpg`
        this.IDImageBack = `https://www.app.deeratna.net/backend/public/storage/internet_images/id_back/${this.selectedRowData.id}.jpg`
        this.HousingImage = `https://www.app.deeratna.net/backend/public/storage/internet_images/housing/${this.selectedRowData.id}.jpg`
        this.HousingImageBack = `https://www.app.deeratna.net/backend/public/storage/internet_images/housing_back/${this.selectedRowData.id}.jpg`
      }

      this.InternetRequestModal.Show()

      // بعد العرض: اربط باك-أب input/change + ابدأ المراقبة الدورية
      nextTick(() => {
        this.bindActivationInputListener()
        this.startActivationWatcher()
      })
    })

    // فتح مودال الرفض
    document.getElementById('RejectBTN').addEventListener('click', () => {
      this.InternetRequestRejectModal.Show()
    })

    // تحميل أنواع الاشتراكات عند تغيير اسم الشركة
    document.getElementById('CompanyName').addEventListener('MCBValueChange', () => {
      const companyname = this.CompanyName.Get()[0]['MCBIName']
      const CompanyProfiles = this.CompanyNameItems.filter(item => item.company_name == companyname)
      this.SubscriptionTypeItems = CompanyProfiles
    })

    // جلب السعر عند تغيير نوع الاشتراك
    document.getElementById('SubscriptionType').addEventListener('MCBValueChange', () => {
      document.getElementById('Price').querySelector('input').value = this.SubscriptionType.Get()[0]['price']
    })
  },

  beforeUnmount() {
    this.stopActivationWatcher()
  },

  methods: {
    /** يربط input/change على الحقل الداخلي لمكوّن MDate (باك-أب) */
    bindActivationInputListener() {
      try {
        const root = this.$refs.InternetActivationDate?.$el || document.getElementById('InternetActivationDate')
        if (!root) return
        const input = root.querySelector('input')
        if (!input) return

        if (!input._expireBinderAttached) {
          input.addEventListener('input', () => this.UpdateExpireFromActivation())
          input.addEventListener('change', () => this.UpdateExpireFromActivation())
          input.addEventListener('keyup', () => this.UpdateExpireFromActivation())
          input._expireBinderAttached = true
        }
      } catch (_) {
        /* ignore */
      }
    },

    /** يبدأ مراقبة دورية لقيمة تاريخ التفعيل لضمان التحديث حتى لو لم تُطلق أي أحداث */
    startActivationWatcher() {
      this.stopActivationWatcher()
      // خزّن القيمة الحالية كبداية
      this.LastActivationValue = (this.InternetActivationDate?.Get?.() || '') + ''
      this.ActivationWatchTimer = setInterval(() => {
        try {
          const current = (this.InternetActivationDate?.Get?.() || '') + ''
          if (current !== this.LastActivationValue) {
            this.LastActivationValue = current
            this.UpdateExpireFromActivation(current) // حدّث الانتهاء
          }
        } catch (_) {
          /* ignore */
        }
      }, 300)
    },

    stopActivationWatcher() {
      if (this.ActivationWatchTimer) {
        clearInterval(this.ActivationWatchTimer)
        this.ActivationWatchTimer = null
      }
    },

    GetInternetRequestsData(MTable) {
      api
        .get('GetInternetRequests', {
          params: {
            MTable,
            InternetRequestFrom: this.InternetRequestsFromDate.Get()[0],
            InternetRequestTo: this.InternetRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.InternetRequestsTBRowsCount = response.data.total
          this.InternetRequestsTBData = response.data.data
          this.InternetRequestsTBSums = response.data.sums
        })
        .catch(error => ShowMessage(error))
    },

    GetInternetProfilesData() {
      api
        .get('internetprofiles')
        .then(response => {
          this.CompanyNameItems = response.data.data
          const CompanysName = response.data.data.map(item => item.company_name)
          this.CompanyNamesItems = [...new Set(CompanysName)]
        })
        .catch(error => ShowMessage(error))
    },

    /** تنسيق تاريخ محلي بصيغة YYYY-MM-DD */
    formatDateLocal(d) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },

    /** إضافة 30 يومًا بطريقة آمنة (تعامل مع التاريخ كقيمة يومية) */
    plus30DaysString(raw) {
      // يقبل YYYY-MM-DD أو YYYY/MM/DD
      const parts = String(raw)
        .trim()
        .split(/[-/]/)
        .map(n => parseInt(n, 10))
      if (parts.length !== 3) return ''
      const [y, m, d] = parts
      if (!y || !m || !d) return ''

      // نحسب بالتوقيت UTC لتفادي مشاكل تغيّر الساعة
      const base = new Date(Date.UTC(y, m - 1, d))
      if (isNaN(base.getTime())) return ''
      base.setUTCDate(base.getUTCDate() + 30)
      const fy = base.getUTCFullYear()
      const fm = String(base.getUTCMonth() + 1).padStart(2, '0')
      const fd = String(base.getUTCDate()).padStart(2, '0')
      return `${fy}-${fm}-${fd}`
    },

    /** يحدّث الانتهاء تلقائيًا (+30 يوم) */
    UpdateExpireFromActivation(rawMaybe) {
      try {
        if (this.SuppressExpireSync) return
        if (this.selectedRowData.request_type != 'تجديد') return

        const raw = (rawMaybe ?? this.InternetActivationDate?.Get?.() ?? '') + ''
        if (!raw || raw.trim() === '') {
          this.InternetExpireDate.Clear()
          return
        }

        const newExpire = this.plus30DaysString(raw)
        if (!newExpire) return

        this.SuppressExpireSync = true
        this.InternetExpireDate.Set(newExpire)
        this.SuppressExpireSync = false
      } catch (_) {
        /* ignore */
      }
    },

    AcceptRequest() {
      ShowLoading()
      const Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('customer_id', this.selectedRowData.customer_id)
      Parameters.append('name', this.selectedRowData.name)
      Parameters.append('request_type', this.selectedRowData.request_type)

      if (this.selectedRowData.request_type == 'تجديد') {
        Parameters.append('request_status', 'تم')
        Parameters.append('internet_activation_date', this.InternetActivationDate.Get())
        Parameters.append('internet_expire_date', this.InternetExpireDate.Get())
      } else {
        Parameters.append('request_status', 'قيد العمل')
      }

      Parameters.append('subscriber_name', document.getElementById('SubscriberName').querySelector('input').value)
      Parameters.append('subscriber_phone', document.getElementById('SubscriberPhone').querySelector('input').value)
      Parameters.append('company_name', document.getElementById('CompanyName').querySelector('input').value)
      Parameters.append('subscription_type', document.getElementById('SubscriptionType').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)

      api
        .put(`internetrequests/${this.selectedRowData.id}`, Parameters)
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            this.InternetRequestsTB.LoadMTable()
            this.InternetRequestModal.Hide()
            this.stopActivationWatcher()
          } else {
            ShowMessage(response.data.message)
          }
        })
        .catch(error => {
          HideLoading()
          if (error.response && error.response.status === 422) {
            const firstError = Object.values(error.response.data.errors)[0][0]
            ShowMessage(firstError)
          } else ShowMessage('حدث خطأ غير متوقع')
        })
    },

    CloseRequest() {
      ShowLoading()
      const Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('pid', this.selectedRowData.pid)
      Parameters.append('customer_id', this.selectedRowData.customer_id)
      Parameters.append('name', this.selectedRowData.name)
      Parameters.append('request_status', 'تم')
      Parameters.append('subscriber_name', document.getElementById('SubscriberName').querySelector('input').value)
      Parameters.append('subscriber_phone', document.getElementById('SubscriberPhone').querySelector('input').value)
      Parameters.append('company_name', document.getElementById('CompanyName').querySelector('input').value)
      Parameters.append('subscription_type', document.getElementById('SubscriptionType').querySelector('input').value)
      Parameters.append('price', document.getElementById('Price').querySelector('input').value)

      if (this.selectedRowData.request_type == 'تجديد' && this.selectedRowData.request_status == 'تم') {
        Parameters.append('internet_activation_date', this.InternetActivationDate.Get())
        Parameters.append('internet_expire_date', this.InternetExpireDate.Get())
      }

      api
        .put(`internetrequests/${this.selectedRowData.id}`, Parameters)
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            this.InternetRequestsTB.LoadMTable()
            this.InternetRequestModal.Hide()
            this.stopActivationWatcher()
          } else {
            ShowMessage(response.data.message)
          }
        })
        .catch(error => {
          HideLoading()
          if (error.response && error.response.status === 422) {
            const firstError = Object.values(error.response.data.errors)[0][0]
            ShowMessage(firstError)
          } else ShowMessage('حدث خطأ غير متوقع')
        })
    },

    SaveRejectRequest() {
      ShowLoading()
      const Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('Reason', document.getElementById('RejectionReason').querySelector('input').value)

      api
        .post('RejectInternetRequests', Parameters, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.InternetRequestModal.Hide()
            this.InternetRequestRejectModal.Hide()
            this.InternetRequestsTB.LoadMTable()
            this.stopActivationWatcher()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },

    ShowImage(e) {
      const ImagePath = e.target.closest('.RequestImage').querySelector('img')?.getAttribute('src')
      if (ImagePath) window.open(ImagePath)
    },
  },
}
</script>

<style scoped>
#InternetRequestsFromDate {
  max-width: 400px;
}
#RejectBTN {
  background-color: red;
}
#RejectBTN:hover {
  color: red;
  background-color: var(--MButtonBG);
}
</style>

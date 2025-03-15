<template>
  <div class="ComponentWrapper">
    <!-- ===============  add subsc Model  ========= -->
    <MModal
      ref="AddSubscriberModal"
      :Name="'AddSubscriberModal'"
      :Title="'اضافة مشترك جديد'"
    >
      <MComboBox
        ref="Compounds"
        :Name="'Compounds'"
        :Label="' اسم المدينة *'"
        :Items="CompoundsItems"
      >
      </MComboBox>
      <div class="MField" id="Name">
        <input ref="Name" type="text" required />
        <label>اسم المالك *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="SubscriberName">
        <input ref="SubscriberName" type="text" required />
        <label>اسم المشترك *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Address">
        <input ref="Address" type="text" required />
        <label>العنوان *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Phone">
        <input ref="Phone" type="text" required />
        <label>هاتف المالك *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="SubscriberPhone">
        <input ref="SubscriberPhone" type="text" required />
        <label>هاتف المشترك *</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox
        ref="CompanyName"
        :Name="'CompanyName'"
        :Label="' اسم الشركة *'"
        :Items="CompanyNameItems"
        :ItemsName="'company_name'"
      >
      </MComboBox>
      <MComboBox
        ref="SubscriptionType"
        :Name="'SubscriptionType'"
        :Label="' نوع الاشتراك *'"
        :Items="SubscriptionTypeItems"
        :ItemsName="'subscription_type'"
      >
      </MComboBox>
      <div class="MField" id="Price" v-OnlyNumbers>
        <input ref="Price" type="text" required />
        <label>السعر</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Notes">
        <input ref="Notes" type="text" required />
        <label>الملاحظات *</label>
        <div class="MFieldBG"></div>
      </div>

      <div class="ModalButtons">
        <div class="MButton" id="SavePersonBTN" @click="SavePerson">حفـــظ</div>
      </div>
    </MModal>

    <div class="MButton" id="AddInternetSubscribersBTN">ادخال مشترك</div>
    <div class="MButton" id="GetInternetSubscribersBTN">عرض البيانات</div>
    <div class="MGroup">
      <MDate
        ref="InternetSubscribersFromDate"
        :Name="'InternetSubscribersFromDate'"
        :Label="'تاريخ من'"
      ></MDate>
      <MDate
        ref="InternetSubscribersToDate"
        :Name="'InternetSubscribersToDate'"
        :Label="'تاريخ الى'"
      ></MDate>
    </div>
    <MTable
      ref="InternetSubscribersTB"
      :Name="'InternetSubscribersTB'"
      :DataArray="InternetSubscribersTBData"
      :HeadersArray="InternetSubscribersTBHeaders"
      :TotalsArray="InternetSubscribersTBTotals"
      :DisplayColumnsArray="InternetSubscribersTBDisplayColumns"
      :GetDataFunction="GetInternetSubscribersData"
      :RowsCount="InternetSubscribersTBRowsCount"
      :RowsPerPage="10"
    >
      <template v-slot:options>
        <!-- View Videosdffhroif Option -->
        <div class="MTableOption" OptionEventName="EditItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path
                d="M500.2,249.6c124.1,1.1,233.2,42.7,328.2,122.1c39.6,33,72.3,72.7,106.8,110.6c9,9.9,8.7,25.5-0.8,36.4
  c-53.9,62.1-109.3,122.5-182.1,163.7c-66,37.4-136.2,60.8-212,66.4C399.6,759.2,276.4,716.6,169,626.3
  C130.9,594.3,99.2,556,66,519.3c-10-11-10.5-26-0.9-37.1c53.3-61.5,107.9-121.4,179.6-162.7c66.8-38.5,138-62.1,215.1-68.3
  C473.2,250.2,486.7,250.1,500.2,249.6z M504.7,308.1c-19.4,0.8-34.9,0.7-50.4,2.2c-61.5,6.1-119,24.8-173,54.6
  c-59.2,32.7-106.2,79.4-150.3,129.6c-4.1,4.7-3.1,8.1,0.7,12.1c21.3,22.2,40.9,45.9,63.9,66.5c86.2,77.3,186.4,118.2,302.7,118.9
  c68.3,0.4,133-14.2,194.7-43.2c70.8-33.3,126.2-85.4,176.6-143.7c4-4.6,2-7.9-1.3-11.3c-21.3-22.2-40.9-45.9-63.8-66.6
  C718.1,349.4,617.3,308.9,504.7,308.1z"
              />
              <path
                d="M392.3,499.7c0.2-59,49.3-108.3,108.1-107.4c60.6,0.9,107.4,47.4,107.2,108c-0.2,60.9-47.5,106.9-107.8,107.4
  C440.8,608.1,392.1,558.6,392.3,499.7z M500.2,556.5c30.5,0,56.4-25.9,56.4-56.4c0-30.6-25.7-56.5-56.2-56.6
  c-31-0.1-56.9,25.8-56.8,56.8C443.8,530.8,469.7,556.6,500.2,556.5z"
              />
            </svg>
          </div>
          <div class="MTableOptionName">تعديل</div>
        </div>
        <div class="MTableOption" OptionEventName="DeleteItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
              <path
                d="M500.2,249.6c124.1,1.1,233.2,42.7,328.2,122.1c39.6,33,72.3,72.7,106.8,110.6c9,9.9,8.7,25.5-0.8,36.4
  c-53.9,62.1-109.3,122.5-182.1,163.7c-66,37.4-136.2,60.8-212,66.4C399.6,759.2,276.4,716.6,169,626.3
  C130.9,594.3,99.2,556,66,519.3c-10-11-10.5-26-0.9-37.1c53.3-61.5,107.9-121.4,179.6-162.7c66.8-38.5,138-62.1,215.1-68.3
  C473.2,250.2,486.7,250.1,500.2,249.6z M504.7,308.1c-19.4,0.8-34.9,0.7-50.4,2.2c-61.5,6.1-119,24.8-173,54.6
  c-59.2,32.7-106.2,79.4-150.3,129.6c-4.1,4.7-3.1,8.1,0.7,12.1c21.3,22.2,40.9,45.9,63.9,66.5c86.2,77.3,186.4,118.2,302.7,118.9
  c68.3,0.4,133-14.2,194.7-43.2c70.8-33.3,126.2-85.4,176.6-143.7c4-4.6,2-7.9-1.3-11.3c-21.3-22.2-40.9-45.9-63.8-66.6
  C718.1,349.4,617.3,308.9,504.7,308.1z"
              />
              <path
                d="M392.3,499.7c0.2-59,49.3-108.3,108.1-107.4c60.6,0.9,107.4,47.4,107.2,108c-0.2,60.9-47.5,106.9-107.8,107.4
  C440.8,608.1,392.1,558.6,392.3,499.7z M500.2,556.5c30.5,0,56.4-25.9,56.4-56.4c0-30.6-25.7-56.5-56.2-56.6
  c-31-0.1-56.9,25.8-56.8,56.8C443.8,530.8,469.7,556.6,500.2,556.5z"
              />
            </svg>
          </div>
          <div class="MTableOptionName">حذف</div>
        </div>
      </template>
    </MTable>
    <div class="MGroup">
      <div class="MlabelText">مجموع المبالغ =</div>
      <div class="MlabelNumber" id="TotalSubscriptions"></div>
    </div>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue'
import { api, GetServerPath } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)

    return {
      hasPermission,
      Operation: ref(''),
      AddSubscriberModal: ref(null),
      ID: ref(''),
      GlobalsStore: ref(useGlobalsStore()),
      Compounds: ref(null),
      CompoundsItems: ref([]),
      CompanyName: ref(null),
      CompanyNameItems: ref([]),
      SubscriptionType: ref(null),
      SubscriptionTypeItems: ref([]),
      InternetSubscribersTB: ref(null),
      InternetSubscribersTBData: ref([]),
      InternetSubscribersTBHeaders: ref([
        '#',
        'المجمع',
        'اسم المستخدم',
        'اسم المشترك',
        'العنوان',
        'رقم هاتف المالك',
        'رقم هاتف الاشتراك',
        'الشركة',
        'نوع الاشتراك',
        'السعر',
        'تاريخ',
        'الملاحظات',
      ]),
      InternetSubscribersTBDisplayColumns: ref([
        'id',
        'compound',
        'name',
        'subscriber_name',
        'address',
        'phone',
        'subscriber_phone',
        'company_name',
        'subscription_type',
        'price',
        'created_at',
        'notes',
      ]),
      InternetSubscribersTBTotals: ref([
        'Count',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Sum',
        '',
        '',
      ]),
      InternetSubscribersTBRowsCount: ref(0),
      InternetSubscribersFromDate: ref(null),
      InternetSubscribersToDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.CompoundsItems = this.GlobalsStore.ComboBoxes['Compounds']
    this.GetInternetProfilesData()
    this.InternetSubscribersTB.LoadMTable()
    //ReLoad table
    document.getElementById('GetInternetSubscribersBTN').addEventListener(
      'click',
      function () {
        this.InternetSubscribersTB.LoadMTable()
      }.bind(this)
    )
    //Add new sub
    document.getElementById('AddInternetSubscribersBTN').addEventListener(
      'click',
      function () {
        this.AddSubscriberModal.Show()
        this.Operation = 1
        this.clearFields()
      }.bind(this)
    )

    document.getElementById('CompanyName').addEventListener(
      'MCBValueChange',
      function () {
        var companyname = this.CompanyName.Get()[0]['company_name']
        var CompanyProfiles = this.CompanyNameItems.filter(
          item => item.company_name == companyname
        )
        this.SubscriptionTypeItems = CompanyProfiles
      }.bind(this)
    )

    document.getElementById('SubscriptionType').addEventListener(
      'MCBValueChange',
      function () {
        document.getElementById('Price').querySelector('input').value =
          this.SubscriptionType.Get()[0]['price']
      }.bind(this)
    )
    // EditItem
    document.getElementById('InternetSubscribersTB').addEventListener(
      'EditItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.Operation = 2
        this.ID = this.selectedRowData.id
        this.Compounds.Set(this.selectedRowData.compound)
        document.getElementById('Name').querySelector('input').value =
          this.selectedRowData.name
        document.getElementById('SubscriberName').querySelector('input').value =
          this.selectedRowData.subscriber_name
        document.getElementById('Address').querySelector('input').value =
          this.selectedRowData.address
        document.getElementById('Phone').querySelector('input').value =
          this.selectedRowData.phone
        document
          .getElementById('SubscriberPhone')
          .querySelector('input').value = this.selectedRowData.subscriber_phone
        document.getElementById('Notes').querySelector('input').value =
          this.selectedRowData.notes
        this.CompanyName.Set(this.selectedRowData.company_name, 'company_name')
        setTimeout(() => {
          this.SubscriptionType.Set(
            this.selectedRowData.subscription_type,
            'subscription_type'
          )
        }, '100')
        this.AddSubscriberModal.Show()
      }.bind(this)
    )
    // DeleteItem
    document.getElementById('InternetSubscribersTB').addEventListener(
      'DeleteItem',
      function (data) {
        this.selectedRowData = data.detail.RowData
        this.ID = this.selectedRowData.id
        api
          .delete(`InternetSubscribers/` + this.ID)
          .then(response => {
            HideLoading()
            if (response.data.success) {
              ShowMessage(response.data.message)
              this.InternetSubscribersTB.LoadMTable()
            } else {
              ShowMessage(response.data.message)
            }
          })
          .catch(error => {
            HideLoading()
            if (error.response && error.response.status === 500) {
              ShowMessage(error.response.data.message || 'حدث خطأ غير متوقع')
            } else {
              ShowMessage('حدث خطأ غير متوقع')
            }
          })
      }.bind(this)
    )
  },
  methods: {
    GetInternetSubscribersData(PageNo = 1, FilterArray = {}, SortArray = {}) {
      api
        .get('InternetSubscribers', {
          params: {
            PageNo: PageNo,
            FilterArray: FilterArray,
            SortArray: SortArray,
            InternetRequestFrom: this.InternetSubscribersFromDate.Get(),
            InternetRequestTo: this.InternetSubscribersToDate.Get(),
          },
        })
        .then(response => {
          this.InternetSubscribersTBRowsCount =
            response.data.paginated_data.total
          this.InternetSubscribersTBData = response.data.paginated_data.data
          document.getElementById('TotalSubscriptions').innerHTML =
            new Intl.NumberFormat('en-US').format(
              response.data.total_payment_amount
            )
        })
        .catch(error => {
          ShowMessage(error)
        })
    },
    GetInternetProfilesData() {
      api
        .get('internetprofiles')
        .then(response => {
          this.CompanyNameItems = response.data.data
          const CompanysName = response.data.data.map(item => item.company_name) // Assuming '' is the relevant field
          this.CompanyNamesItems = [...new Set(CompanysName)] // Using Set to remove duplicates
        })
        .catch(error => {
          ShowMessage(error)
        })
    },
    //==============Save  person=========================
    SavePerson() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append(
        'compound',
        document.getElementById('Compounds').querySelector('input').value
      )
      Parameters.append(
        'name',
        document.getElementById('Name').querySelector('input').value
      )
      Parameters.append(
        'subscriber_name',
        document.getElementById('SubscriberName').querySelector('input').value
      )
      Parameters.append(
        'address',
        document.getElementById('Address').querySelector('input').value
      )
      Parameters.append(
        'phone',
        document.getElementById('Phone').querySelector('input').value
      )
      Parameters.append(
        'subscriber_phone',
        document.getElementById('SubscriberPhone').querySelector('input').value
      )
      Parameters.append(
        'company_name',
        document.getElementById('CompanyName').querySelector('input').value
      )
      Parameters.append(
        'subscription_type',
        document.getElementById('SubscriptionType').querySelector('input').value
      )
      Parameters.append(
        'price',
        document.getElementById('Price').querySelector('input').value
      )
      Parameters.append(
        'notes',
        document.getElementById('Notes').querySelector('input').value
      )

      //=========post ============
      if (this.Operation == 1) {
        api
          .post('InternetSubscribers', Parameters, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            HideLoading()
            if (response.data.message == 'تمت العملية بنجاح') {
              this.InternetSubscribersTB.LoadMTable()
              this.AddSubscriberModal.Hide()
              this.clearFields()
            } else {
              HideLoading()
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
        // if update
      } else if (this.Operation == 2) {
        api
          .put(`InternetSubscribers/` + this.ID, Parameters)
          .then(response => {
            HideLoading()
            if (response.data.message == 'تمت العملية بنجاح') {
              this.InternetSubscribersTB.LoadMTable()
              this.AddSubscriberModal.Hide()
              this.clearFields()
            } else {
              HideLoading()
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
      }
    },
    clearFields() {
      this.Compounds.Clear()
      this.CompanyName.Clear()
      this.SubscriptionType.Clear()
      Object.keys(this.$refs).forEach(ref => {
        const field = this.$refs[ref]
        // Check if the ref is an input field or a custom component
        if (field.tagName === 'INPUT') {
          field.value = ''
        } else if (typeof field.reset === 'function') {
          // If it's a custom component like MDate with a reset method
          field.reset()
        }
      })
    },
  },
}
</script>

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
          <!-- Shared Columns (Always Visible) -->

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
          <!-- Rejection Reason -->
          <tr v-if="selectedRowData.rejection_reason != ''">
            <td>سبب الرفض</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
          </tr>
        </tbody>
      </table>
      <div class="MField" id="SubscriberName">
        <input type="text" required />
        <label>اسم المشترك</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="SubscriberPhone" v-OnlyNumbers>
        <input type="text" required />
        <label>رقم هاتف الاشتراك</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox ref="CompanyName" :Name="'CompanyName'" :Label="' اسم الشركة *'" :Items="CompanyNamesItems" :ItemsName="'company_name'"></MComboBox>
      <MComboBox ref="SubscriptionType" :Name="'SubscriptionType'" :Label="' نوع الاشتراك *'" :Items="SubscriptionTypeItems" :ItemsName="'subscription_type'"></MComboBox>
      <div class="MField" id="Price">
        <input type="text" required disabled />
        <label>السعر</label>
        <div class="MFieldBG"></div>
      </div>
      <MDate :Disabled="!(selectedRowData.request_status == 'قيد المراجعة')" v-show="selectedRowData.request_type == 'تجديد'" ref="InternetActivationDate" :Name="'InternetActivationDate'" :Label="'تاريخ التفعيل'"></MDate>
      <MDate :Disabled="!(selectedRowData.request_status == 'قيد المراجعة')" v-show="selectedRowData.request_type == 'تجديد'" ref="InternetExpireDate" :Name="'InternetExpireDate'" :Label="'تاريخ الانتهاء'"></MDate>

      <!--========== The Images ==========-->
      <div v-show="selectedRowData.request_type != 'تجديد'" class="ImagesContainer">
        <div class="InformationRequestImage" v-if="selectedRowData.id_image != ''">
          <div class="InformationRequestImageTitle">بطاقة موحدة</div>
          <div class="InformationRequestImagePreview" @click="ShowImage">
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img :src="IDImage" />
          </div>
        </div>
        <div class="InformationRequestImage" v-if="selectedRowData.id_image_back != ''">
          <div class="InformationRequestImageTitle">ضهر البطاقة الموحدة</div>
          <div class="InformationRequestImagePreview" @click="ShowImage">
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img :src="IDImageBack" />
          </div>
        </div>
        <div class="InformationRequestImage" v-if="selectedRowData.housing_image != ''">
          <div class="InformationRequestImageTitle">بطاقة السكن</div>
          <div class="InformationRequestImagePreview" @click="ShowImage">
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img :src="HousingImage" />
          </div>
        </div>
        <div class="InformationRequestImage" v-if="selectedRowData.housing_image_back != ''">
          <div class="InformationRequestImageTitle">ضهر بطاقة السكن</div>
          <div class="InformationRequestImagePreview" @click="ShowImage">
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img :src="HousingImageBack" />
          </div>
        </div>
      </div>
      <div class="ModalButtons">
        <div v-show="(selectedRowData.request_type == 'نصب' && selectedRowData.request_status == 'قيد المراجعة') || (selectedRowData.request_type == 'تجديد' && selectedRowData.request_status != 'تم')" class="MButton" id="AcceptBTN" @click="AcceptRequest()">موافق</div>
        <div v-show="selectedRowData.request_status == 'قيد المراجعة'" class="MButton" id="RejectBTN" @click="RejectRequest">رفض</div>
        <div v-show="selectedRowData.request_type == 'نصب' || (selectedRowData.request_type == 'تجديد' && selectedRowData.request_status == 'قيد العمل')" class="MButton" id="CloseRequestBTN" @click="CloseRequest()">تحديث وغلق الطلب</div>
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
      <MDate ref="InternetRequestsFromDate" :Name="'InternetRequestsFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true"></MDate>
    </div>
    <MTable ref="InternetRequestsTB" :Name="'InternetRequestsTB'" :DataArray="InternetRequestsTBData" :Columns="InternetRequestsTBColumns" :Sums="InternetRequestsTBSums" :GetDataFunction="GetInternetRequestsData" :RowsCount="InternetRequestsTBRowsCount" :RowsPerPage="10">
      <template v-slot:options>
        <!-- View Videosdffhroif Option -->
        <div class="MTableOption" OptionEventName="ViewItem">
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
          <div class="MTableOptionName">عرض</div>
        </div>
      </template>
    </MTable>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue'
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
        {
          name: 'id',
          label: '#',
        },
        {
          name: 'pid',
          label: 'الرقم',
        },
        {
          name: 'compound',
          label: 'المدينة',
          filter: 'combo',
          filter_items: GlobalsStore.value.ComboBoxes?.Compounds || [],
        },
        {
          name: 'name',
          label: 'الاسم',
        },
        {
          name: 'subscriber_name',
          label: 'اسم المشترك',
        },
        {
          name: 'attributes',
          label: 'الصفة',
        },
        {
          name: 'address',
          label: 'العنوان',
        },
        {
          name: 'phone',
          label: 'رقم الهاتف',
        },
        {
          name: 'subscriber_phone',
          label: 'رقم هاتف الاشتراك',
        },
        {
          name: 'company_name',
          label: 'الشركة',
        },
        {
          name: 'subscription_type',
          label: 'نوع الاشتراك',
        },
        {
          name: 'price',
          label: 'المبلغ',
          sum: true,
          type: 'currency',
        },
        {
          name: 'request_type',
          label: 'نوع الطلب',
        },
        {
          name: 'request_status',
          label: 'حالة الطلب',
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
      ],
      InternetRequestsTBSums: ref([]),
      InternetRequestsTBRowsCount: ref(0),
      InternetRequestsFromDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.InternetRequestsTB.LoadMTable()
    this.GetInternetProfilesData()
    // display Data between two date
    document.getElementById('GetInternetRequestsBTN').addEventListener(
      'click',
      function () {
        ShowLoading()
        this.InternetRequestsTB.ReLoadMTable()
        HideLoading()
      }.bind(this)
    )
    // View Requist
    document.getElementById('InternetRequestsTB').addEventListener(
      'ViewItem',
      function (data) {
        this.selectedRowData = this.selectedRowData = data.detail.RowData

        this.InternetActivationDate.Clear()
        this.InternetExpireDate.Clear()
        document.getElementById('SubscriberName').querySelector('input').value = this.selectedRowData.subscriber_name
        document.getElementById('SubscriberPhone').querySelector('input').value = this.selectedRowData.subscriber_phone
        document.getElementById('Price').querySelector('input').value = 0

        if (this.selectedRowData.request_type == 'تجديد' && this.selectedRowData.request_status == 'قيد المراجعة') {
          const now = new Date()
          this.InternetActivationDate.Set(now.toISOString().split('T')[0])

          // إضافة شهر واحد على التاريخ الحالي
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
          this.InternetExpireDate.Set(nextMonth.toISOString().split('T')[0])
        } else {
          this.InternetActivationDate.Set(this.selectedRowData.label_issue)
          this.InternetExpireDate.Set(this.selectedRowData.label_expire)
        }

        if (this.selectedRowData.company_name && this.selectedRowData.company_name != '') {
          this.CompanyName.Set(this.selectedRowData.company_name, 'company_name')
          setTimeout(() => {
            this.SubscriptionType.Set(this.selectedRowData.subscription_type, 'subscription_type')
          }, '100')
        }

        if (this.selectedRowData.request_type == 'نصب') {
          this.IDImage = 'https://www.app.deeratna.net/backend/public/storage/internet_images/id/' + this.selectedRowData.id + '.jpg'
          this.IDImageBack = 'https://www.app.deeratna.net/backend/public/storage/internet_images/id_back/' + this.selectedRowData.id + '.jpg'
          this.HousingImage = 'https://www.app.deeratna.net/backend/public/storage/internet_images/housing/' + this.selectedRowData.id + '.jpg'
          this.HousingImageBack = 'https://www.app.deeratna.net/backend/public/storage/internet_images/housing_back/' + this.selectedRowData.id + '.jpg'
        }

        this.InternetRequestModal.Show()
      }.bind(this)
    )
    // RejectBTN
    document.getElementById('RejectBTN').addEventListener(
      'click',
      function () {
        this.InternetRequestRejectModal.Show()
      }.bind(this)
    )
    //load data to SubscriptionTypeItems
    document.getElementById('CompanyName').addEventListener(
      'MCBValueChange',
      function () {
        var companyname = this.CompanyName.Get()[0]['MCBIName']
        var CompanyProfiles = this.CompanyNameItems.filter(item => item.company_name == companyname)
        this.SubscriptionTypeItems = CompanyProfiles
      }.bind(this)
    )
    // get price
    document.getElementById('SubscriptionType').addEventListener(
      'MCBValueChange',
      function () {
        document.getElementById('Price').querySelector('input').value = this.SubscriptionType.Get()[0]['price']
      }.bind(this)
    )
  },
  methods: {
    GetInternetRequestsData(MTable) {
      api
        .get('GetInternetRequests', {
          params: {
            MTable: MTable,
            InternetRequestFrom: this.InternetRequestsFromDate.Get()[0],
            InternetRequestTo: this.InternetRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.InternetRequestsTBRowsCount = response.data.total
          this.InternetRequestsTBData = response.data.data
          this.InternetRequestsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },
    //load CompanyNameItems to combo
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
    AcceptRequest() {
      ShowLoading()
      var Parameters = new FormData()
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
        .put(`internetrequests/` + this.selectedRowData.id, Parameters)
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            this.InternetRequestsTB.LoadMTable()
            this.InternetRequestModal.Hide()
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
    },
    CloseRequest() {
      ShowLoading()
      var Parameters = new FormData()
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
      api
        .put(`internetrequests/` + this.selectedRowData.id, Parameters)
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            this.InternetRequestsTB.LoadMTable()
            this.InternetRequestModal.Hide()
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
    },
    SaveRejectRequest() {
      ShowLoading()

      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('Reason', document.getElementById('RejectionReason').querySelector('input').value)

      api
        .post('RejectInternetRequests', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.InternetRequestModal.Hide()
            this.InternetRequestRejectModal.Hide()
            this.InternetRequestsTB.LoadMTable()
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
      let ImagePath = e.target.closest('.InformationRequestImage').querySelector('img').getAttribute('src')
      window.open(ImagePath)
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

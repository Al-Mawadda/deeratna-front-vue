<template>
  <div class="ComponentWrapper">
    <MModal
      ref="AddPersonModal"
      :Name="'AddPersonModal'"
      :Title="'اضافة شخص جديد'"
    >
      <div class="MField" id="Name">
        <input ref="Name" type="text" required />
        <label>اسم المالك *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="motherName">
        <input ref="motherName" type="text" required />
        <label>اسم الام *</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox
        ref="Gender"
        :Name="'Gender'"
        :Label="' الجنس *'"
        :Items="GenderItems"
      >
      </MComboBox>
      <MDate ref="Birth" :Name="'Birth'" :Label="'المواليد'"></MDate>
      <div class="MField" id="identificationType">
        <input ref="identificationType" type="text" required />
        <label>نوع الهوية *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="identificationNumber" v-OnlyNumbers>
        <input ref="identificationNumber" type="text" required />
        <label>رقم الهوية *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="identificationRecord">
        <input ref="identificationRecord" type="text" required />
        <label>الصحيفة</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="identificationPage">
        <input ref="identificationPage" type="text" required />
        <label>السجل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="identificationIssuingAuthority">
        <input ref="identificationIssuingAuthority" type="text" required />
        <label>جهة الاصدار</label>
        <div class="MFieldBG"></div>
      </div>
      <MDate
        ref="identificationIssuingDate"
        :Name="'identificationIssuingDate'"
        :Label="'تاريخ الاصدار'"
      ></MDate>
      <div class="MField" id="Study">
        <input ref="Study" type="text" required />
        <label>التحصيل الدراسي</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox
        ref="workType"
        :Name="'workType'"
        :Label="' المهنة *'"
        :Items="workTypeItems"
      >
      </MComboBox>

      <div class="MField" id="workPlace">
        <input ref="workPlace" type="text" required />
        <label>مكان العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Phone" v-OnlyNumbers>
        <input ref="Phone" type="text" required />
        <label>الهاتف *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Email">
        <input ref="Email" type="text" required />
        <label>الايميل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Address">
        <input ref="Address" type="text" required />
        <label>العنوان *</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Notes">
        <input ref="Notes" type="text" required />
        <label>الملاحظات</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SavePersonBTN" @click="SavePerson">حفـــظ</div>
      </div>
    </MModal>
    <div class="MStepper" id="TheMStepper">
      <div class="MStepperContent">
        <!-- ------step 1------- -->

        <div class="MStepContent">
          <div class="MStepContentWrapper">
            <div class="MField" id="identificationNumberSearch" v-OnlyNumbers>
              <input ref="identificationNumberSearch" type="text" required />
              <label>بحث برقم الهوية</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="ModalButtons">
              <div class="MButton" id="AddPersonBTN" @click="AddPerson">+</div>
            </div>

            <MTable
              ref="PersonsTB"
              :Name="'PersonsTB'"
              :DataArray="PersonsTBData"
              :HeadersArray="PersonsTBHeaders"
              :TotalsArray="PersonsTBTotals"
              :DisplayColumnsArray="PersonsTBDisplayColumns"
              :GetDataFunction="GetPersonsData"
              :RowsCount="PersonsTBRowsCount"
              :RowsPerPage="10"
            >
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
        </div>

        <!-- ------step 2------- -->

        <div class="MStepContent">
          <div class="MStepContentWrapper">
            <div class="MField" id="cityName">
              <input ref="cityName" type="text" required />
              <label> اسم المدينة *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="realEstatesType">
              <input ref="realEstatesType" type="text" required />
              <label>نوع الوحدة السكنية *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="Zone">
              <input ref="Zone" type="text" required />
              <label> الـــزون *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="designType">
              <input ref="designType" type="text" required />
              <label> نوع تصميم العقار *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="realEstateNumber">
              <input ref="realEstateNumber" type="text" required />
              <label> عنوان المنزل *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="landArea" v-OnlyNumbers>
              <input ref="landArea" type="text" required />
              <label> مساحة الارض *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="buildingArea" v-OnlyNumbers>
              <input ref="buildingArea" type="text" required />
              <label> مساحة البناء *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="Map">
              <input ref="Map" type="text" required />
              <label>الخارطة</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="realEstatesTypeNotes">
              <input ref="realEstatesTypeNotes" type="text" required />
              <label>الملاحظات</label>
              <div class="MFieldBG"></div>
            </div>
          </div>
        </div>

        <!-- ------step 3------- -->

        <div class="MStepContent">
          <div class="MStepContentWrapper">
            <MDate
              ref="ContractDate"
              :Name="'ContractDate'"
              :Label="'تاريخ العقد'"
            ></MDate>
            <MDate
              ref="SaleDate"
              :Name="'SaleDate'"
              :Label="'تاريخ البيع'"
            ></MDate>
            <div class="MField" id="SaleMethod">
              <input ref="SaleMethod" type="text" required />
              <label> الية البيع *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="RealEstateCompany">
              <input ref="RealEstateCompany" type="text" required />
              <label>الشركة العقارية</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="PaymentMethod">
              <input ref="PaymentMethod" type="text" required />
              <label>نوع الدفع *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="PaymentDuration">
              <input ref="PaymentDuration" type="text" required />
              <label>مدة الدفع *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="DeliveryDuration" v-OnlyNumbers>
              <input ref="DeliveryDuration" type="text" required />
              <label>عدد اشهر تسليم الدار *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="Currency">
              <input ref="Currency" type="text" required />
              <label>نوع العملة</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="Price" v-OnlyNumbers>
              <input ref="Price" type="text" required />
              <label>سعر المنزل *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="HousingRequiredAmount" v-OnlyNumbers>
              <input ref="HousingRequiredAmount" type="text" required />
              <label>مبلغ شرط السكن *</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="MField" id="ContractNotes">
              <input ref="ContractNotes" type="text" required />
              <label>الملاحظات</label>
              <div class="MFieldBG"></div>
            </div>
            <div class="ModalButtons">
              <div class="MButton" id="SaveBTN" @click="Save">حفـــظ</div>
            </div>
          </div>
        </div>

        <!-- ------step 4------- -->

        <div class="MStepContent">
          <div class="MStepContentWrapper"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { MStepperBuild } from '../../MJS.js'
import { useGlobalsStore } from '../../stores/Globals.js'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'
var thecount = 1

export default {
  setup() {
    return {
      AddPersonModal: ref(null),
      GlobalsStore: ref(useGlobalsStore()),
      Gender: ref(null),
      GenderItems: ref([]),
      workType: ref(null),
      workTypeItems: ref([]),
      Birth: ref(null),
      identificationIssuingDate: ref(null),
      ContractDate: ref(null),
      SaleDate: ref(null),
      PersonsTB: ref(null),
      PersonsTBData: ref([]),
      PersonsTBHeaders: ref([
        '#',
        'اسم المالك',
        'اسم الام',
        'رقم الهوية',
        'رقم الهاتف',
      ]),
      PersonsTBDisplayColumns: ref([
        'id',
        'name',
        'mother_name',
        'identification_number',
        'phone',
      ]),
      PersonsTBTotals: ref(['Count', '', '', '', '', '', '']),
      PersonsTBRowsCount: ref(0),
    }
  },
  mounted() {
    this.GenderItems = this.GlobalsStore.ComboBoxes['Gender']
    this.workTypeItems = this.GlobalsStore.ComboBoxes['WorkType']
    var MStepHeaders = [
      'المعلومات الشخصية',
      'بيانات الوحدة السكنية',
      'بيانات العقد',
      'تعريف الدفعات',
    ]
    MStepperBuild(document.getElementById('TheMStepper'), MStepHeaders, true)

    document.getElementById('AddPersonBTN').addEventListener(
      'click',
      function () {
        this.AddPersonModal.Show()
      }.bind(this)
    )
  },
  methods: {
    //==============Save  person=========================
    SavePerson() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append(
        'name',
        document.getElementById('Name').querySelector('input').value
      )
      Parameters.append(
        'mother_name',
        document.getElementById('motherName').querySelector('input').value
      )
      Parameters.append(
        'gender',
        document.getElementById('Gender').querySelector('input').value
      )
      Parameters.append('birth', this.Birth.Get())
      Parameters.append(
        'identification_type',
        document.getElementById('identificationType').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_number',
        document.getElementById('identificationNumber').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_record',
        document.getElementById('identificationRecord').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_page',
        document.getElementById('identificationPage').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_issuing_authority',
        document
          .getElementById('identificationIssuingAuthority')
          .querySelector('input').value
      )
      Parameters.append(
        'identification_issuing_date',
        this.identificationIssuingDate.Get()
      )
      Parameters.append(
        'study',
        document.getElementById('Study').querySelector('input').value
      )
      Parameters.append(
        'work_type',
        document.getElementById('workType').querySelector('input').value
      )
      Parameters.append(
        'work_place',
        document.getElementById('workPlace').querySelector('input').value
      )
      Parameters.append(
        'phone',
        document.getElementById('Phone').querySelector('input').value
      )
      Parameters.append(
        'email',
        document.getElementById('Email').querySelector('input').value
      )
      Parameters.append(
        'address',
        document.getElementById('Address').querySelector('input').value
      )
      Parameters.append(
        'notes',
        document.getElementById('Notes').querySelector('input').value
      )

      //=========post ============
      api
        .post('persons', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data.message == 'تمت العملية بنجاح') {
            var PersonArray = {}
            PersonArray['count'] = thecount
            PersonArray['id'] = response.data.person_id
            PersonArray['name'] = document
              .getElementById('Name')
              .querySelector('input').value
            PersonArray['mother_name'] = document
              .getElementById('motherName')
              .querySelector('input').value
            PersonArray['identification_number'] = document
              .getElementById('identificationNumber')
              .querySelector('input').value
            PersonArray['phone'] = document
              .getElementById('Phone')
              .querySelector('input').value
            thecount = thecount + 1

            this.PersonsTBData.push(PersonArray)
            this.AddPersonModal.Hide()
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
    },

    //==============Save======================
    Save() {
      ShowLoading()

      var Parameters = new FormData()

      //=========step 2=============
      Parameters.append(
        'city_name',
        document.getElementById('cityName').querySelector('input').value
      )
      Parameters.append(
        'real_estates_type',
        document.getElementById('realEstatesType').querySelector('input').value
      )
      Parameters.append(
        'zone',
        document.getElementById('Zone').querySelector('input').value
      )
      Parameters.append(
        'design_type',
        document.getElementById('designType').querySelector('input').value
      )
      Parameters.append(
        'real_estate_number',
        document.getElementById('realEstateNumber').querySelector('input').value
      )
      Parameters.append(
        'land_area',
        document.getElementById('landArea').querySelector('input').value
      )
      Parameters.append(
        'building_area',
        document.getElementById('buildingArea').querySelector('input').value
      )
      Parameters.append(
        'real_estates_type_notes',
        document.getElementById('realEstatesTypeNotes').querySelector('input')
          .value
      )
      Parameters.append(
        'map',
        document.getElementById('Map').querySelector('input').value
      )

      //=========step 3=============
      Parameters.append('contract_date', this.ContractDate.Get())
      Parameters.append('sale_date', this.SaleDate.Get())
      Parameters.append(
        'sale_method',
        document.getElementById('SaleMethod').querySelector('input').value
      )
      Parameters.append(
        'real_estate_company',
        document.getElementById('RealEstateCompany').querySelector('input')
          .value
      )
      Parameters.append(
        'payment_method',
        document.getElementById('PaymentMethod').querySelector('input').value
      )
      Parameters.append(
        'payment_duration',
        document.getElementById('PaymentDuration').querySelector('input').value
      )
      Parameters.append(
        'delivery_duration',
        document.getElementById('DeliveryDuration').querySelector('input').value
      )
      Parameters.append(
        'currency',
        document.getElementById('Currency').querySelector('input').value
      )
      Parameters.append(
        'price',
        document.getElementById('Price').querySelector('input').value
      )
      Parameters.append(
        'housing_required_amount',
        document.getElementById('HousingRequiredAmount').querySelector('input')
          .value
      )
      Parameters.append(
        'contract_notes',
        document.getElementById('ContractNotes').querySelector('input').value
      )
      Parameters.append(
        'contract_notes',
        document.getElementById('ContractNotes').querySelector('input').value
      )
      Parameters.append(
        'PersonArray',
        JSON.stringify(this.PersonsTBData).replaceAll(null, '""')
      )
      console.log(this.PersonsTBData)
      //=========post ============
      api
        .post('contracts', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data.success == true) {
            ShowMessage('تمت عملية الخزن بنجاح')
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
    },

    clearFields() {
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
<style scoped>
.MField,
.MDate {
  min-width: 200px;
}
</style>

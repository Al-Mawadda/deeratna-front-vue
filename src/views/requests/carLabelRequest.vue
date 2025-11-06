<template>
  <div class="ComponentWrapper">
    <MModal ref="CarLabelRequestModal" :Name="'CarLabelRequestModal'"
      :Title="' طلب ' + selectedRowData.request_type + ' ملصق ' + selectedRowData.name">
      <table cellpadding="0" cellspacing="0" class="RequestsMTable" id="CarsLabelRequestsTable">
        <thead>
          <tr>
            <th>الحقل</th>
            <th>القيمة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>الرقم</td>
            <td>{{ selectedRowData.pid }}</td>
          </tr>
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
            <td>رقم العجلة</td>
            <td>{{ selectedRowData.car_number }}</td>
          </tr>
          <tr>
            <td>تفاصيل العجلة</td>
            <td>{{ selectedRowData.car_details }}</td>
          </tr>
          <tr>
            <td>نوع المستند</td>
            <td>{{ selectedRowData.car_document_type }}</td>
          </tr>
          <tr v-if="selectedRowData.request_type == 'ايقاف'">
            <td>سبب الايقاف</td>
            <td>{{ selectedRowData.label_suspension_reason }}</td>
          </tr>
          <tr v-if="selectedRowData.request_type == 'اضافة'">
            <td>اضافة مع ملصق</td>
            <td>{{ +selectedRowData.label_add ? 'نعم' : 'كلا' }}</td>
          </tr>
          <tr>
            <td>رقم الهاتف</td>
            <td>{{ selectedRowData.phone }}</td>
          </tr>
          <tr>
            <td>الصفة</td>
            <td>{{ selectedRowData.attributes }}</td>
          </tr>
          <tr v-show="selectedRowData.request_status == 'مرفوض'">
            <td>سبب الرفض</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
          </tr>
        </tbody>
      </table>
      <div class="MGroup ModalMGroup"
        v-show="selectedRowData.car_licence_image != '' || selectedRowData.car_licence_back_image != '' || selectedRowData.car_document_image != ''">
        <div class="ImagesContainer">
          <div class="RequestImage" v-if="selectedRowData.car_licence_image != ''">
            <div class="RequestImageTitle">السنوية</div>
            <div class="RequestImagePreview" @click="ShowImage(selectedRowData.car_licence_image)">
              <div class="RequestImagePreviewOverlay">
                <svg viewBox="0 0 1000 1000">
                  <path
                    d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                    fill="white" />
                </svg>
              </div>
              <img v-if="selectedRowData.car_licence_image" :src="ServerPath + '/storage/images/' + selectedRowData.car_licence_image
                " />
            </div>
          </div>
          <div class="RequestImage" v-if="selectedRowData.car_licence_back_image != ''">
            <div class="RequestImageTitle">ضهر السنوية</div>
            <div class="RequestImagePreview" @click="ShowImage(selectedRowData.car_licence_back_image)">
              <div class="RequestImagePreviewOverlay">
                <svg viewBox="0 0 1000 1000">
                  <path
                    d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                    fill="white" />
                </svg>
              </div>
              <img v-if="selectedRowData.car_licence_back_image"
                :src="ServerPath + '/storage/images/' + selectedRowData.car_licence_back_image" />
            </div>
          </div>
          <div class="RequestImage" v-if="selectedRowData.car_document_image != ''">
            <div class="RequestImageTitle">المستند</div>
            <div class="RequestImagePreview" @click="ShowImage(selectedRowData.car_document_image)">
              <div class="RequestImagePreviewOverlay">
                <svg viewBox="0 0 1000 1000">
                  <path
                    d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                    fill="white" />
                </svg>
              </div>
              <img v-if="selectedRowData.car_document_image" :src="ServerPath + '/storage/images/' + selectedRowData.car_document_image
                " />
            </div>
          </div>
        </div>
      </div>

      <div class="MGroup ModalMGroup"
        v-show="(((selectedRowData.request_type == 'اضافة' && selectedRowData.label_add == 1) && (selectedRowData.request_status == 'تم الدفع' || selectedRowData.request_status == 'تم')) || (selectedRowData.request_type == 'تمديد')) && (selectedRowData.department_id == 3 || UserData.department_id == 1)">
        <RFIDField ref="LabelCode"
          v-show="selectedRowData.request_type == 'اضافة' && (selectedRowData.request_status == 'تم الدفع' || selectedRowData.request_status == 'تم')"
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'LabelCode'" :Label="'رمز الملصق'" />
        <MDate
          v-show="(selectedRowData.request_type == 'اضافة' && (selectedRowData.request_status == 'تم الدفع' || selectedRowData.request_status == 'تم')) || selectedRowData.request_type == 'تمديد'"
          :Disabled="!(((selectedRowData.request_status == 'تم الدفع' && selectedRowData.request_type == 'اضافة') || (selectedRowData.request_status == 'قيد المراجعة' && selectedRowData.request_type == 'تمديد')) && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          ref="LabelExpire" :Name="'LabelExpire'" :Label="'تاريخ الانتهاء'"></MDate>
      </div>

      <div class="MGroup ModalMGroup" id="GatesMGroup"
        v-show="((selectedRowData.request_type == 'اضافة' && selectedRowData.label_add == 1) && (selectedRowData.request_status == 'تم الدفع' || selectedRowData.request_status == 'تم')) && (selectedRowData.department_id == 3 || UserData.department_id == 1)">
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal1-1Box'" :Label="'الامل 1-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal1-2Box'" :Label="'الامل 1-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal2-1Box'" :Label="'الامل 2-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal2-2Box'" :Label="'الامل 2-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amaal-1Box'" :Label="'الامال-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amaal-2Box'" :Label="'الامال-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'jawhara-1Box'" :Label="'جوهرة البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'jawhara-2Box'" :Label="'جوهرة البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'eye-1Box'" :Label="'عين البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'eye-2Box'" :Label="'عين البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'dura-1Box'" :Label="'درة البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'dura-2Box'" :Label="'درة البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'shruq-1Box'" :Label="'الشروق-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'shruq-2Box'" :Label="'الشروق-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'rafah-1Box'" :Label="'الرفاه-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'rafah-2Box'" :Label="'الرفاه-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'nasim-1Box'" :Label="'النسيم-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="true || !(selectedRowData.request_status == 'تم الدفع' && (UserData.department_id == 1 || (UserData.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'nasim-2Box'" :Label="'النسيم-البوابة 2'"></MCheckBox>
      </div>

      <div class="ModalButtons">
        <div v-show="GlobalsStore.CheckPermissions('car_label_requests_accept')">
          <div
            v-show="(selectedRowData.request_status == 'قيد المراجعة' || selectedRowData.request_status == 'تم الدفع') && (UserData.department_id == selectedRowData.department_id || UserData.department_id == 1)"
            class="MButton" id="AcceptBTN" @click="AcceptRequest">قبول</div>
        </div>
        <div v-show="GlobalsStore.CheckPermissions('car_label_requests_accept')">
          <div
            v-show="(selectedRowData.request_status == 'قيد المراجعة') && (UserData.department_id == selectedRowData.department_id || UserData.department_id == 1)"
            class="MButton" id="RejectBTN">رفض</div>
        </div>
      </div>
    </MModal>

    <!-- ========= Reject Model======== -->
    <MModal ref="CarLabelRequestRejectModal" :Name="'CarLabelRequestRejectModal'" :Title="'رفض الطلب'">
      <div class="MField" id="RejectionReason">
        <input type="text" required />
        <label>سبب الرفض</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SaveRejectRequest">حفظ</div>
      </div>
    </MModal>

    <div class="MButton" id="GetCarLabelRequestsBTN">عرض كافة البيانات</div>
    <div class="MButton" id="GetCarLabelRequestsUnderReviewBTN">عرض قيد المراجعة</div>
    <div class="MGroup">
      <MDate ref="CarLabelRequestsFromDate" :Name="'CarLabelRequestsFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true"></MDate>
    </div>

    <MTable ref="CarLabelRequestsTB" :Name="'CarLabelRequestsTB'" :DataArray="CarLabelRequestsTBData" :Columns="CarLabelRequestsTBColumns" :Sums="CarLabelRequestsTBSums" :GetDataFunction="GetCarLabelRequestsData" :RowsCount="CarLabelRequestsTBRowsCount" :RowsPerPage="10">
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
<script>
import { ref } from 'vue'
import { api, GetServerPath } from '../../axios'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'
import { useGlobalsStore } from '../../stores/Globals.js'
var RequestStatusData = 0

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore())
    const UserData = ref(useGlobalsStore().User)

    return {
      GlobalsStore,
      UserData,
      ServerPath: GetServerPath(),
      CarLabelRequestModal: ref(null),
      CarLabelRequestRejectModal: ref(null),
      CarLabelRequestsTB: ref(null),
      CarLabelRequestsTBData: ref([]),

      CarLabelRequestsTBColumns: [
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
          filter_items: UserData.value?.department_id == 1 ? GlobalsStore.value.ComboBoxes?.Compounds ?? [] : UserData.value?.compounds ?? [],
        },
        {
          name: 'name',
          label: 'الاسم',
        },
        {
          name: 'guardian_name',
          label: 'اسم الساكن',
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
          name: 'attributes',
          label: 'الصفة',
        },
        {
          name: 'request_type',
          label: 'العملية',
        },
        {
          name: 'request_status',
          label: 'حالة الطلب',
        },
        {
          name: 'department_name',
          label: 'القسم',
          filter: 'combo',
          filter_items: ['المختار', 'الادارة المحلية', 'المعلوماتية'],
        },
        {
          name: 'created_at',
          label: 'التاريخ',
          filter: 'date',
        },
      ],
      CarLabelRequestsTBSums: ref([]),

      CarLabelRequestsTBRowsCount: ref(0),
      CarLabelRequestsFromDate: ref(null),
      selectedRowData: ref([]),
      LabelCode: ref(''),
      LabelExpire: ref(null),
      Gates: ref(''),
    }
  },
  mounted() {
    let Instance = this;
    this.CarLabelRequestsTB.LoadMTable()
    document.getElementById('GetCarLabelRequestsBTN').addEventListener('click', function () {
      RequestStatusData = 1
      this.CarLabelRequestsTB.ReLoadMTable()
    }.bind(this))
    document.getElementById('GetCarLabelRequestsUnderReviewBTN').addEventListener('click', function () {
      RequestStatusData = 0
      this.CarLabelRequestsTB.ReLoadMTable()
    }.bind(this))
    document.getElementById('RejectBTN').addEventListener('click', function () {
      this.CarLabelRequestRejectModal.Show()
    }.bind(this))
    document.getElementById('CarLabelRequestsTB').addEventListener('ViewItem', function (data) {
      Instance.selectedRowData = data.detail.RowData
      Instance.LabelCode.Clear();
      Instance.LabelExpire.Clear();

      document.querySelectorAll('.MCheckBox input').forEach(function (e) {
        e.checked = false
      })

      Instance.LabelCode.Set(Instance.selectedRowData.label_code)

      if (this.selectedRowData.request_type == 'اضافة' && this.selectedRowData.request_status == 'قيد المراجعة') {
        const now = new Date()

        const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        this.LabelExpire.Set(nextYear.toISOString().split('T')[0])
      } else {
        this.LabelExpire.Set(this.selectedRowData.label_expire)
      }

      this.selectedRowData.label_gates.split('|').forEach(function (e) {
        document.querySelectorAll('.MCheckBox').forEach(function (d) {
          if (e == d.querySelector('.MCheckBoxText').innerHTML) {
            d.querySelector('input').checked = true
          }
        })
      })

      this.CarLabelRequestModal.Show()
    }.bind(this))
  },

  methods: {
    GetCarLabelRequestsData(MTable) {
      let APIName = 'GetCarsLabelRequestsUnderReviewDeeratna'
      if (RequestStatusData == 1) {
        APIName = 'GetCarsLabelRequests'
      }
      if (RequestStatusData == 0) {
        APIName = 'GetCarsLabelRequestsUnderReviewDeeratna'
      }
      api
        .get(APIName, {
          params: {
            MTable: MTable,
            carLabelRequestFrom: this.CarLabelRequestsFromDate.Get()[0],
            carLabelRequestTo: this.CarLabelRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.CarLabelRequestsTBRowsCount = response.data.total
          this.CarLabelRequestsTBData = response.data.data
          this.CarLabelRequestsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },

    AcceptRequest() {
      ShowLoading()
      var GatesCheckBoxes = document.getElementById('GatesMGroup').querySelectorAll('.MCheckBox')
      for (var i = 0; i < GatesCheckBoxes.length; i++) {
        if (GatesCheckBoxes[i].querySelector('input').checked) {
          if (i == 0) {
            this.Gates = GatesCheckBoxes[i].querySelector('.MCheckBoxText').innerHTML
          } else {
            this.Gates += '|' + GatesCheckBoxes[i].querySelector('.MCheckBoxText').innerHTML
          }
        }
      }
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('LabelCode', this.LabelCode.Get())
      Parameters.append('LabelExpire', this.LabelExpire.Get())
      Parameters.append('Gates', this.Gates)

      api
        .post('AcceptCarsLabelRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.CarLabelRequestModal.Hide()
            this.CarLabelRequestsTB.LoadMTable()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },

    //==============Save Reject Request =========================

    SaveRejectRequest() {
      ShowLoading()

      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append('Reason', document.getElementById('RejectionReason').querySelector('input').value)

      api
        .post('RejectCarsLabelRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.CarLabelRequestModal.Hide()
            this.CarLabelRequestRejectModal.Hide()
            this.CarLabelRequestsTB.LoadMTable()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },
    ShowImage(ImageName) {
      var ImagePath = this.ServerPath + '/storage/images/' + ImageName
      window.open(ImagePath)
    },
  },
}
</script>

<style scoped>
#CarLabelRequestsFromDate {
  max-width: 400px;
}

#RejectBTN {
  background-color: red;
}

#RejectBTN:hover {
  color: red;
  background-color: var(--MButtonBG);
}

#CarLabelRequestModal .Modal {
  max-width: 700px;
}

#GatesMGroup .MCheckBox {
  width: 50%;
}
</style>

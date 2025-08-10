<template>
  <div class="ComponentWrapper">
    <!-- ========= InformationRequest Model======== -->

    <MModal
      ref="InformationRequestModal"
      :Name="'InformationRequestModal'"
      :Title="
        ' طلب ' +
        selectedRowData.request_type +
        ' بيانات ' +
        selectedRowData.name
      "
    >
      <!-- ============= Add Table =============== -->
      <table
        v-if="selectedRowData.request_type == 'اضافة'"
        cellpadding="0"
        cellspacing="0"
        class="RequestsMTable"
      >
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
          <tr v-if="CheckAttributes(['مالك', 'مستاجر'])">
            <td>الجنس</td>
            <td>{{ selectedRowData.gender }}</td>
          </tr>
          <tr v-if="CheckAttributes(['مالك', 'مستاجر'])">
            <td>المواليد</td>
            <td>{{ selectedRowData.birth }}</td>
          </tr>
          <tr v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])">
            <td>نوع المستمسك</td>
            <td>{{ selectedRowData.identification_type }}</td>
          </tr>
          <tr v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])">
            <td>رقم المستمسك</td>
            <td>{{ selectedRowData.identification_number }}</td>
          </tr>
          <tr v-if="CheckAttributes(['مالك', 'مستاجر'])">
            <td>التحصيل الدراسي</td>
            <td>{{ selectedRowData.study }}</td>
          </tr>
          <tr v-if="CheckAttributes(['مالك', 'مستاجر'])">
            <td>المهنة</td>
            <td>{{ selectedRowData.work_type }}</td>
          </tr>
          <tr v-if="CheckAttributes(['مالك', 'مستاجر'])">
            <td>مكان العمل</td>
            <td>{{ selectedRowData.work_place }}</td>
          </tr>
          <tr v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])">
            <td>رقم العجلة</td>
            <td>{{ selectedRowData.car_number }}</td>
          </tr>
          <tr v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])">
            <td>تفاصيل العجلة</td>
            <td>{{ selectedRowData.car_details }}</td>
          </tr>
          <tr v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])">
            <td>العلاقة</td>
            <td>{{ selectedRowData.relation }}</td>
          </tr>
          <tr>
            <td>رقم الهاتف</td>
            <td>{{ selectedRowData.phone }}</td>
          </tr>
          <tr>
            <td>المدينة</td>
            <td>{{ selectedRowData.compound }}</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td>{{ selectedRowData.address }}</td>
          </tr>
          <tr v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])">
            <td>اسم صاحب العقار</td>
            <td>{{ selectedRowData.guardian_name }}</td>
          </tr>
          <tr v-if="selectedRowData.rejection_reason != ''">
            <td>سبب الرفض</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
          </tr>
        </tbody>
      </table>
      <!-- ============= Edit Table =============== -->
      <table
        v-if="selectedRowData.request_type == 'تعديل'"
        cellpadding="0"
        cellspacing="0"
        class="RequestsMTable"
      >
        <thead>
          <tr>
            <th>الحقل</th>
            <th>قبل التعديل</th>
            <th>بعد التعديل</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :style="
              selectedRowData.old_name != selectedRowData.name
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>الاسم</td>
            <td>{{ selectedRowData.old_name }}</td>
            <td>{{ selectedRowData.name }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_gender != selectedRowData.gender
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>الجنس</td>
            <td>{{ selectedRowData.old_gender }}</td>
            <td>{{ selectedRowData.gender }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_birth != selectedRowData.birth
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>المواليد</td>
            <td>{{ selectedRowData.old_birth }}</td>
            <td>{{ selectedRowData.birth }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_study != selectedRowData.study
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>التحصيل الدراسي</td>
            <td>{{ selectedRowData.old_study }}</td>
            <td>{{ selectedRowData.study }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_work_type != selectedRowData.work_type
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>المهنة</td>
            <td>{{ selectedRowData.old_work_type }}</td>
            <td>{{ selectedRowData.work_type }}</td>
          </tr>
          <tr
            v-ahow="CheckAttributes(['مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_work_place != selectedRowData.work_place
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>مكان العمل</td>
            <td>{{ selectedRowData.old_work_place }}</td>
            <td>{{ selectedRowData.work_place }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_car_number != selectedRowData.car_number
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>رقم العجلة</td>
            <td>{{ selectedRowData.old_car_number }}</td>
            <td>{{ selectedRowData.car_number }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_car_details != selectedRowData.car_details
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>تفاصيل العجلة</td>
            <td>{{ selectedRowData.old_car_details }}</td>
            <td>{{ selectedRowData.car_details }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_relation != selectedRowData.relation
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>العلاقة</td>
            <td>{{ selectedRowData.old_relation }}</td>
            <td>{{ selectedRowData.relation }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])"
            :style="
              selectedRowData.old_phone != selectedRowData.phone
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>رقم الهاتف</td>
            <td>{{ selectedRowData.old_phone }}</td>
            <td>{{ selectedRowData.phone }}</td>
          </tr>
          <tr
            v-if="CheckAttributes(['سائق', 'زائر'])"
            :style="
              selectedRowData.old_outside_address !=
              selectedRowData.outside_address
                ? { color: '#FFAA00' }
                : null
            "
          >
            <td>العنوان الخارجي</td>
            <td>{{ selectedRowData.old_outside_address }}</td>
            <td>{{ selectedRowData.outside_address }}</td>
          </tr>
          <tr>
            <td>المدينة</td>
            <td>{{ selectedRowData.compound }}</td>
            <td>{{ selectedRowData.compound }}</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td>{{ selectedRowData.address }}</td>
            <td>{{ selectedRowData.address }}</td>
          </tr>
          <tr v-if="CheckAttributes(['سائق', 'زائر', 'مالك', 'مستاجر'])">
            <td>اسم صاحب العقار</td>
            <td>{{ selectedRowData.guardian_name }}</td>
            <td>{{ selectedRowData.guardian_name }}</td>
          </tr>
          <tr v-if="selectedRowData.rejection_reason != ''">
            <td>سبب الرفض</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
          </tr>
        </tbody>
      </table>
      <!-- ============= Delete Table =============== -->
      <table
        v-if="selectedRowData.request_type == 'حذف'"
        cellpadding="0"
        cellspacing="0"
        class="RequestsMTable"
      >
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
            <td>مدينة</td>
            <td>{{ selectedRowData.compound }}</td>
          </tr>
          <tr>
            <td>عنوان</td>
            <td>{{ selectedRowData.address }}</td>
          </tr>
          <tr>
            <td>اسم صاحب العقار</td>
            <td>{{ selectedRowData.guardian_name }}</td>
          </tr>
          <tr>
            <td>سبب الحذف</td>
            <td>{{ selectedRowData.deletion_reason }}</td>
          </tr>
          <tr v-if="selectedRowData.rejection_reason != ''">
            <td>سبب الرفض</td>
            <td>{{ selectedRowData.rejection_reason }}</td>
          </tr>
        </tbody>
      </table>
      <!--========== The Images ==========-->
      <div class="ImagesContainer">
        <div
          class="InformationRequestImage"
          v-if="selectedRowData.personal_image != ''"
        >
          <div class="InformationRequestImageTitle">الصورة الشخصية</div>
          <div
            class="InformationRequestImagePreview"
            @click="ShowImage(selectedRowData.personal_image)"
          >
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              v-if="selectedRowData.personal_image"
              :src="
                ServerPath + '/storage/images/' + selectedRowData.personal_image
              "
            />
          </div>
        </div>
        <div
          class="InformationRequestImage"
          v-if="selectedRowData.id_image != ''"
        >
          <div class="InformationRequestImageTitle">بطاقة موحدة</div>
          <div
            class="InformationRequestImagePreview"
            @click="ShowImage(selectedRowData.id_image)"
          >
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              v-if="selectedRowData.id_image"
              :src="ServerPath + '/storage/images/' + selectedRowData.id_image"
            />
          </div>
        </div>
        <div
          class="InformationRequestImage"
          v-if="selectedRowData.id_image_back != ''"
        >
          <div class="InformationRequestImageTitle">ضهر البطاقة الموحدة</div>
          <div
            class="InformationRequestImagePreview"
            @click="ShowImage(selectedRowData.id_image_back)"
          >
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              v-if="selectedRowData.id_image_back"
              :src="
                ServerPath + '/storage/images/' + selectedRowData.id_image_back
              "
            />
          </div>
        </div>
        <div
          class="InformationRequestImage"
          v-if="selectedRowData.housing_image != ''"
        >
          <div class="InformationRequestImageTitle">بطاقة السكن</div>
          <div
            class="InformationRequestImagePreview"
            @click="ShowImage(selectedRowData.housing_image)"
          >
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              v-if="selectedRowData.housing_image"
              :src="
                ServerPath + '/storage/images/' + selectedRowData.housing_image
              "
            />
          </div>
        </div>
        <div
          class="InformationRequestImage"
          v-if="selectedRowData.housing_image_back != ''"
        >
          <div class="InformationRequestImageTitle">ضهر بطاقة السكن</div>
          <div
            class="InformationRequestImagePreview"
            @click="ShowImage(selectedRowData.housing_image_back)"
          >
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              v-if="selectedRowData.housing_image_back"
              :src="
                ServerPath +
                '/storage/images/' +
                selectedRowData.housing_image_back
              "
            />
          </div>
        </div>
        <div
          class="InformationRequestImage"
          v-if="selectedRowData.driver_licence_image != ''"
        >
          <div class="InformationRequestImageTitle">سنوية السائق</div>
          <div
            class="InformationRequestImagePreview"
            @click="ShowImage(selectedRowData.driver_licence_image)"
          >
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              v-if="selectedRowData.driver_licence_image"
              :src="
                ServerPath +
                '/storage/images/' +
                selectedRowData.driver_licence_image
              "
            />
          </div>
        </div>
        <div
          class="InformationRequestImage"
          v-if="selectedRowData.driver_licence_image_back != ''"
        >
          <div class="InformationRequestImageTitle">ضهر سنوية السائق</div>
          <div
            class="InformationRequestImagePreview"
            @click="ShowImage(selectedRowData.driver_licence_image_back)"
          >
            <div class="InformationRequestImagePreviewOverlay">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M450.2565,36.0294c18.6849,2.9482,37.5594,5.0146,56.0247,8.9843C653.55,76.6735,769.4424,197.507,794.0276,345.7818c18.3481,110.6581-7.8676,210.2677-77.061,298.56-1.47,1.8753-2.8516,3.8192-4.6057,6.1761q38.9827,40.554,77.7513,80.8829,70.1942,72.9948,140.3751,146.0021c20.5779,21.4581,20.7684,51.8715.7262,71.1147-20.2148,19.409-50.1806,18.0733-70.9443-3.48Q753.6258,834.3367,647.148,723.4766c-2.08-2.1635-3.9735-4.5069-6.357-7.2263-7.1169,4.4964-13.6031,8.6938-20.1838,12.7375C404.2984,861.8989,117.8611,741.5022,61.5828,494.0268A374.2062,374.2062,0,0,1,279.3051,66.0859,359.6555,359.6555,0,0,1,394.45,37.5392a50.3221,50.3221,0,0,0,6.9671-1.51ZM426.2127,686.3013c152.993-.5451,276.6613-124.73,275.9217-277.0737-.7433-153.105-124.6084-276.1761-277.355-275.5773-152.2376.5968-275.5054,124.7523-275.0328,277.0133C150.22,563.0212,274.4127,686.8422,426.2127,686.3013Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              v-if="selectedRowData.driver_licence_image_back"
              :src="
                ServerPath +
                '/storage/images/' +
                selectedRowData.driver_licence_image_back
              "
            />
          </div>
        </div>
      </div>
      <div class="ModalButtons">
        <div v-show="GlobalsStore.CheckPermissions('information_requests_accept')">
          <div
            v-show="selectedRowData.request_status == 'قيد المراجعة' && (UserData.department_id == selectedRowData.department_id || UserData.department_id == 1)"
            class="MButton" id="AcceptBTN" @click="AcceptRequest()">
            قبول
          </div>
        </div>

        <div v-show="GlobalsStore.CheckPermissions('information_requests_reject')">
          <div
            v-show="selectedRowData.request_status == 'قيد المراجعة' && (UserData.department_id == selectedRowData.department_id || UserData.department_id == 1)"
            class="MButton" id="RejectBTN" @click="RejectRequest">
            رفض
          </div>
        </div>
        <div v-show="selectedRowData.request_type == 'اضافة' &&
          selectedRowData.request_status == 'قيد المراجعة' && selectedRowData.department_id == 3 && (UserData.department_id == 3 || UserData.department_id == 1)
          " class="MButton" @click="ShowAddPersonRelationModal">
          اضافة كعلاقة
        </div>
      </div>
    </MModal>

    <!-- ========= Add Relation Model======== -->
    <MModal
      ref="AddPersonRelationModal"
      :Name="'AddPersonRelationModal'"
      :Title="'اضافة العلاقة'"
    >
      <div class="MField" id="PersonID">
        <input ref="PersonID" type="text" required />
        <label>رمز الشخص الموجود</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div
          class="MButton"
          id="SavePersonRelation"
          @click="AcceptRequestRelation()"
        >
          حفظ
        </div>
      </div>
    </MModal>

    <!-- ========= Reject Model======== -->
    <MModal
      ref="InformationRequestRejectModal"
      :Name="'InformationRequestRejectModal'"
      :Title="'رفض الطلب'"
    >
      <div class="MField" id="RejectionReason">
        <input type="text" required />
        <label>سبب الرفض</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SaveRejectRequest">حفظ</div>
      </div>
    </MModal>

    <div class="MButton" id="GetInformationRequestsBTN">عرض كافة البيانات</div>
    <div class="MButton" id="GetInformationRequestsUnderReviewBTN">
      عرض قيد المراجعة
    </div>

    <div class="MGroup">
      <MDate
        ref="InformationRequestsFromDate"
        :Name="'InformationRequestsFromDate'"
        :Label="'التاريخ'"
        :Range="true"
        :Clearable="true"
      ></MDate>
    </div>
    <MTable
      ref="InformationRequestsTB"
      :Name="'InformationRequestsTB'"
      :DataArray="InformationRequestsTBData"
      :Columns="InformationRequestsTBColumns"
      :Sums="InformationRequestsTBSums"
      :GetDataFunction="GetInformationRequestsData"
      :RowsCount="InformationRequestsTBRowsCount"
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
</template>

<!-- ======================================== -->
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
      InformationRequestModal: ref(null),
      InformationRequestRejectModal: ref(null),
      AddPersonRelationModal: ref(null),

      InformationRequestsTB: ref(null),
      InformationRequestsTBData: ref([]),
      InformationRequestsTBColumns: [
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
          filter_items: UserData.value?.department_id == 1 ? (GlobalsStore.value.ComboBoxes?.Compounds ?? []) : (UserData.value?.compounds ?? []),
        },
        {
          name: 'guardian_name',
          label: 'اسم الساكن',
        },
        {
          name: 'name',
          label: 'الاسم',
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
      InformationRequestsTBSums: ref(),
      InformationRequestsTBRowsCount: ref(0),

      InformationRequestsFromDate: ref(null),
      selectedRowData: ref([]),
      ServerPath: GetServerPath(),
    }
  },
  mounted() {
    this.InformationRequestsTB.LoadMTable()
    // load all data
    document.getElementById('GetInformationRequestsBTN').addEventListener(
      'click',
      function () {
        RequestStatusData = 1
        this.InformationRequestsTB.ReLoadMTable()
      }.bind(this)
    )
    // load under review data
    document
      .getElementById('GetInformationRequestsUnderReviewBTN')
      .addEventListener(
        'click',
        function () {
          RequestStatusData = 0
          this.InformationRequestsTB.ReLoadMTable()
        }.bind(this)
      )
    document.getElementById('InformationRequestsTB').addEventListener(
      'ViewItem',
      function (data) {
        this.selectedRowData = this.selectedRowData = data.detail.RowData
        this.InformationRequestModal.Show()
      }.bind(this)
    )
    document.getElementById('RejectBTN').addEventListener(
      'click',
      function () {
        this.InformationRequestRejectModal.Show()
      }.bind(this)
    )
  },
  methods: {
    GetInformationRequestsData(MTable) {
      let APIName = 'GetInformationRequestsUnderReviewDeeratna'
      if (RequestStatusData == 1) {
        APIName = 'GetInformationRequests'
      }
      api
        .get(APIName, {
          params: {
            MTable: MTable,
            InformationRequestFrom: this.InformationRequestsFromDate.Get()[0],
            InformationRequestTo: this.InformationRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.InformationRequestsTBData = response.data.data
          this.InformationRequestsTBRowsCount = response.data.total
          this.InformationRequestsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },
    AcceptRequest() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      api
        .post('AcceptInformationRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.InformationRequestModal.Hide()
            this.AddPersonRelationModal.Hide()
            this.InformationRequestsTB.LoadMTable()
            HideLoading()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },
    AcceptRequestRelation() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append(
        'pid',
        document.getElementById('PersonID').querySelector('input').value
      )

      api
        .post('AcceptInformationRequestRelation', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.InformationRequestModal.Hide()
            this.AddPersonRelationModal.Hide()
            this.InformationRequestsTB.LoadMTable()
            HideLoading()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },
    SaveRejectRequest() {
      ShowLoading()

      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append(
        'Reason',
        document.getElementById('RejectionReason').querySelector('input').value
      )

      api
        .post('RejectInformationRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.InformationRequestModal.Hide()
            this.InformationRequestRejectModal.Hide()
            this.InformationRequestsTB.LoadMTable()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },
    ShowAddPersonRelationModal() {
      this.AddPersonRelationModal.Show()
    },
    ShowImage(ImageName) {
      var ImagePath = this.ServerPath + '/storage/images/' + ImageName
      window.open(ImagePath)
    },
    CheckAttributes(values) {
      if (!this.selectedRowData.attributes) {
        return false
      }
      return this.selectedRowData.attributes
        .split(' | ')
        .some(value => values.includes(value))
    },
  },
}
</script>

<style scoped>
#InformationRequestsFromDate {
  max-width: 400px;
}
</style>

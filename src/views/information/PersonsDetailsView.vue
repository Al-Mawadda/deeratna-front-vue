<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div class="MField" id="ID" v-show="Operation == 'EDIT'">
        <input disabled type="text" required>
        <label>الرمز</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox ref='Attributes' :MultipleSelections="true" :Name="'Attributes'" :Label="'الصفة'"
        :Items="AttributesItems"></MComboBox>
      <div class="MField" id="Name">
        <input type="text" required>
        <label>الاسم</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox ref='Gender' :Name="'Gender'" :Label="'الجنس'" :Items="GenderItems"
        v-show="CheckAttributes(['مالك', 'مستاجر'])"></MComboBox>
      <MDate ref="BirthDate" :Name="'BirthDate'" :Label="'المواليد'" v-show="CheckAttributes(['مالك', 'مستاجر'])">
      </MDate>
      <div class="MField" id="Nationality" v-show="CheckAttributes(['متعهد'])">
        <input type="text" required>
        <label>الجنسية</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="MotherName" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required>
        <label>اسم الام</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox ref='IdentificationType' :Name="'IdentificationType'" :Label="'نوع المستمسك'"
        :Items="IdentificationTypeItems" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد'])"></MComboBox>
      <div class="MField" id="IdentificationNumber" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد'])">
        <input type="text" required>
        <label>رقم المستمسك</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="IdentificationRecord" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required>
        <label>السجل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="IdentificationPage" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required>
        <label>الصحيفة</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="IdentificationIssuingAuthority" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required>
        <label>جهة الاصدار</label>
        <div class="MFieldBG"></div>
      </div>
      <MDate ref="IdentificationIssuingDate" :Name="'IdentificationIssuingDate'" :Label="'تاريخ الاصدار'"
        v-show="CheckAttributes(['مالك', 'مستاجر'])"></MDate>
      <div class="MField" id="Phone" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد'])">
        <input type="text" required>
        <label>رقم الهاتف</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Study" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required />
        <label>التحصيل الدراسي</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="WorkType" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required />
        <label>نوع العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="WorkPlace" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد'])">
        <input type="text" required />
        <label>موقع العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Address" v-show="CheckAttributes(['متعهد'])">
        <input type="text" required />
        <label>العنوان</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="EMail" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required />
        <label>بريد الكتروني</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="ContractorContractNo" v-show="CheckAttributes(['متعهد'])">
        <input type="text" required />
        <label>رقم عقد العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="EntryPort" v-show="CheckAttributes(['متعهد'])">
        <input type="text" required />
        <label>منفذ الدخول</label>
        <div class="MFieldBG"></div>
      </div>
      <MDate ref="EntryDate" :Name="'EntryDate'" :Label="'تاريخ الدخول'" v-show="CheckAttributes(['متعهد'])"></MDate>
      <div class="MField" id="Notes">
        <input type="text" required />
        <label>الملاحظات</label>
        <div class="MFieldBG"></div>
      </div>
    </div>
    <div class="MGroup">
      <div class="MImage" required="true">
        <div class="MImagePreview">
          <img :src="ServerPath + '/storage/Placeholder/1.svg'" />
          <div class="MImageButtons">
            <div class="MImageBTN ShowMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M942,880.2c-1.8,4.5-3.3,9.1-5.4,13.5c-20.7,45-74.8,57.1-112.8,25.3c-3.5-2.9-6.7-6.2-10-9.4
	c-61.7-61.7-123.5-123.3-184.9-185.2c-6.1-6.1-10.2-6.4-17.2-1.8c-49.7,32.9-104.6,51.5-163.7,56.3c-74.4,6-144.4-9.3-209-47.5
	c-76.4-45.2-130.2-109.8-157.9-193.9c-34-103.4-23.9-203.5,33-296.9c57.8-95,142.9-151.6,252.6-168.4
	c95.7-14.6,183.7,7.9,261.7,65.3c78.8,57.9,126.4,136.1,141.6,232.6c13,82.2-2.2,159.9-43.9,232.1c-4.5,7.8-4.4,12.2,2.3,18.8
	c61.2,60.6,121.8,121.7,182.9,182.4c13.9,13.7,25.7,28.3,30.7,47.6C942,860.7,942,870.5,942,880.2z M656.9,424.3
	C658,295,552.1,185.7,419,185.4C288.9,185,179,288.9,179.4,424.5C179.8,559,286.1,662.8,417.9,663
	C553.9,663.3,657.6,553.1,656.9,424.3z" />
              </svg>
            </div>
            <div class="MImageBTN DeleteMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M610.6,500.4c0-13.9,8.5-22.4,14.7-28.6c20.1-20.1,40.2-40.2,60.3-60.3c56.6-56.6,115-115.2,172.8-172.5
	c15.3-15.2,23.8-28.8,27.3-43.8v-25.9c-5.5-21.4-16.3-36.2-34-46.4c-9.8-5.6-21.2-8.6-32.9-8.6h0h0c-16.4,0-32,5.7-43.9,15.9
	c-3.4,2.9-6.9,6.2-11.4,10.8C705.4,199,646.3,258.1,589.2,315.2l-60,60c-6.6,6.6-14.9,14.9-28.9,14.9c-13.9,0-22.2-8.2-28.8-14.9
	c-21-21-42.1-42.1-63.1-63.1C351.6,255.3,292.8,196.5,235,138.6c-16.5-16.5-33.9-24.2-54.7-24.2c-1,0-2,0-3,0.1
	c-15.1,0.5-30.8,7.8-43,20c-12.2,12.2-19.5,27.9-20,43c-0.7,22.2,6.9,40.5,24.2,57.7c57.5,57.2,115.8,115.6,172.1,172
	c21.3,21.3,42.6,42.6,63.9,64c6.8,6.8,15.3,15.3,15.3,29.5c0,14.1-8.5,22.6-15.4,29.4c-21,21-41.9,41.9-62.9,62.9
	C255,649.5,196.3,708.2,138.5,765.8c-16.6,16.6-24.3,33.6-24.1,53.6c0.3,30,20.5,56.5,49.1,64.6c2.1,0.6,4.2,1.2,6.2,1.7h25.4
	c15.1-3.6,28.7-12.1,43.8-27.3c57.4-57.8,115.9-116.3,172.5-172.8c20.1-20.1,40.2-40.2,60.3-60.3c6.2-6.2,14.7-14.7,28.6-14.7
	c13.9,0,22.4,8.5,28.6,14.7c20.1,20.1,40.2,40.2,60.4,60.3c56.6,56.5,115.1,115,172.5,172.8c15.1,15.2,28.7,23.8,43.8,27.3h26
	c21.4-5.4,36.2-16.3,46.6-34.2c3.3-5.6,5.4-12.8,7.6-20.4v-25.5c-3.6-15-12.1-28.7-27.3-43.8c-57.8-57.4-116.3-116-172.9-172.6
	c-20.1-20.1-40.1-40.2-60.2-60.2C619.1,522.8,610.6,514.3,610.6,500.4z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="MImagePicker">
          <label class="MButton" for="PersonalImage">صورة شخصية</label>
          <input id="PersonalImage" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="MImage" required="true">
        <div class="MImagePreview">
          <img :src="ServerPath + '/storage/Placeholder/1.svg'" />
          <div class="MImageButtons">
            <div class="MImageBTN ShowMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M942,880.2c-1.8,4.5-3.3,9.1-5.4,13.5c-20.7,45-74.8,57.1-112.8,25.3c-3.5-2.9-6.7-6.2-10-9.4
	c-61.7-61.7-123.5-123.3-184.9-185.2c-6.1-6.1-10.2-6.4-17.2-1.8c-49.7,32.9-104.6,51.5-163.7,56.3c-74.4,6-144.4-9.3-209-47.5
	c-76.4-45.2-130.2-109.8-157.9-193.9c-34-103.4-23.9-203.5,33-296.9c57.8-95,142.9-151.6,252.6-168.4
	c95.7-14.6,183.7,7.9,261.7,65.3c78.8,57.9,126.4,136.1,141.6,232.6c13,82.2-2.2,159.9-43.9,232.1c-4.5,7.8-4.4,12.2,2.3,18.8
	c61.2,60.6,121.8,121.7,182.9,182.4c13.9,13.7,25.7,28.3,30.7,47.6C942,860.7,942,870.5,942,880.2z M656.9,424.3
	C658,295,552.1,185.7,419,185.4C288.9,185,179,288.9,179.4,424.5C179.8,559,286.1,662.8,417.9,663
	C553.9,663.3,657.6,553.1,656.9,424.3z" />
              </svg>
            </div>
            <div class="MImageBTN DeleteMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M610.6,500.4c0-13.9,8.5-22.4,14.7-28.6c20.1-20.1,40.2-40.2,60.3-60.3c56.6-56.6,115-115.2,172.8-172.5
	c15.3-15.2,23.8-28.8,27.3-43.8v-25.9c-5.5-21.4-16.3-36.2-34-46.4c-9.8-5.6-21.2-8.6-32.9-8.6h0h0c-16.4,0-32,5.7-43.9,15.9
	c-3.4,2.9-6.9,6.2-11.4,10.8C705.4,199,646.3,258.1,589.2,315.2l-60,60c-6.6,6.6-14.9,14.9-28.9,14.9c-13.9,0-22.2-8.2-28.8-14.9
	c-21-21-42.1-42.1-63.1-63.1C351.6,255.3,292.8,196.5,235,138.6c-16.5-16.5-33.9-24.2-54.7-24.2c-1,0-2,0-3,0.1
	c-15.1,0.5-30.8,7.8-43,20c-12.2,12.2-19.5,27.9-20,43c-0.7,22.2,6.9,40.5,24.2,57.7c57.5,57.2,115.8,115.6,172.1,172
	c21.3,21.3,42.6,42.6,63.9,64c6.8,6.8,15.3,15.3,15.3,29.5c0,14.1-8.5,22.6-15.4,29.4c-21,21-41.9,41.9-62.9,62.9
	C255,649.5,196.3,708.2,138.5,765.8c-16.6,16.6-24.3,33.6-24.1,53.6c0.3,30,20.5,56.5,49.1,64.6c2.1,0.6,4.2,1.2,6.2,1.7h25.4
	c15.1-3.6,28.7-12.1,43.8-27.3c57.4-57.8,115.9-116.3,172.5-172.8c20.1-20.1,40.2-40.2,60.3-60.3c6.2-6.2,14.7-14.7,28.6-14.7
	c13.9,0,22.4,8.5,28.6,14.7c20.1,20.1,40.2,40.2,60.4,60.3c56.6,56.5,115.1,115,172.5,172.8c15.1,15.2,28.7,23.8,43.8,27.3h26
	c21.4-5.4,36.2-16.3,46.6-34.2c3.3-5.6,5.4-12.8,7.6-20.4v-25.5c-3.6-15-12.1-28.7-27.3-43.8c-57.8-57.4-116.3-116-172.9-172.6
	c-20.1-20.1-40.1-40.2-60.2-60.2C619.1,522.8,610.6,514.3,610.6,500.4z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="MImagePicker">
          <label class="MButton" for="IDImage">هويه او جواز</label>
          <input id="IDImage" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="MImage" required="true">
        <div class="MImagePreview">
          <img :src="ServerPath + '/storage/Placeholder/1.svg'" />
          <div class="MImageButtons">
            <div class="MImageBTN ShowMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M942,880.2c-1.8,4.5-3.3,9.1-5.4,13.5c-20.7,45-74.8,57.1-112.8,25.3c-3.5-2.9-6.7-6.2-10-9.4
	c-61.7-61.7-123.5-123.3-184.9-185.2c-6.1-6.1-10.2-6.4-17.2-1.8c-49.7,32.9-104.6,51.5-163.7,56.3c-74.4,6-144.4-9.3-209-47.5
	c-76.4-45.2-130.2-109.8-157.9-193.9c-34-103.4-23.9-203.5,33-296.9c57.8-95,142.9-151.6,252.6-168.4
	c95.7-14.6,183.7,7.9,261.7,65.3c78.8,57.9,126.4,136.1,141.6,232.6c13,82.2-2.2,159.9-43.9,232.1c-4.5,7.8-4.4,12.2,2.3,18.8
	c61.2,60.6,121.8,121.7,182.9,182.4c13.9,13.7,25.7,28.3,30.7,47.6C942,860.7,942,870.5,942,880.2z M656.9,424.3
	C658,295,552.1,185.7,419,185.4C288.9,185,179,288.9,179.4,424.5C179.8,559,286.1,662.8,417.9,663
	C553.9,663.3,657.6,553.1,656.9,424.3z" />
              </svg>
            </div>
            <div class="MImageBTN DeleteMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M610.6,500.4c0-13.9,8.5-22.4,14.7-28.6c20.1-20.1,40.2-40.2,60.3-60.3c56.6-56.6,115-115.2,172.8-172.5
	c15.3-15.2,23.8-28.8,27.3-43.8v-25.9c-5.5-21.4-16.3-36.2-34-46.4c-9.8-5.6-21.2-8.6-32.9-8.6h0h0c-16.4,0-32,5.7-43.9,15.9
	c-3.4,2.9-6.9,6.2-11.4,10.8C705.4,199,646.3,258.1,589.2,315.2l-60,60c-6.6,6.6-14.9,14.9-28.9,14.9c-13.9,0-22.2-8.2-28.8-14.9
	c-21-21-42.1-42.1-63.1-63.1C351.6,255.3,292.8,196.5,235,138.6c-16.5-16.5-33.9-24.2-54.7-24.2c-1,0-2,0-3,0.1
	c-15.1,0.5-30.8,7.8-43,20c-12.2,12.2-19.5,27.9-20,43c-0.7,22.2,6.9,40.5,24.2,57.7c57.5,57.2,115.8,115.6,172.1,172
	c21.3,21.3,42.6,42.6,63.9,64c6.8,6.8,15.3,15.3,15.3,29.5c0,14.1-8.5,22.6-15.4,29.4c-21,21-41.9,41.9-62.9,62.9
	C255,649.5,196.3,708.2,138.5,765.8c-16.6,16.6-24.3,33.6-24.1,53.6c0.3,30,20.5,56.5,49.1,64.6c2.1,0.6,4.2,1.2,6.2,1.7h25.4
	c15.1-3.6,28.7-12.1,43.8-27.3c57.4-57.8,115.9-116.3,172.5-172.8c20.1-20.1,40.2-40.2,60.3-60.3c6.2-6.2,14.7-14.7,28.6-14.7
	c13.9,0,22.4,8.5,28.6,14.7c20.1,20.1,40.2,40.2,60.4,60.3c56.6,56.5,115.1,115,172.5,172.8c15.1,15.2,28.7,23.8,43.8,27.3h26
	c21.4-5.4,36.2-16.3,46.6-34.2c3.3-5.6,5.4-12.8,7.6-20.4v-25.5c-3.6-15-12.1-28.7-27.3-43.8c-57.8-57.4-116.3-116-172.9-172.6
	c-20.1-20.1-40.1-40.2-60.2-60.2C619.1,522.8,610.6,514.3,610.6,500.4z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="MImagePicker">
          <label class="MButton" for="IDImageBack">ظهر الهوية او الجواز</label>
          <input id="IDImageBack" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="MImage">
        <div class="MImagePreview">
          <img :src="ServerPath + '/storage/Placeholder/1.svg'" />
          <div class="MImageButtons">
            <div class="MImageBTN ShowMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M942,880.2c-1.8,4.5-3.3,9.1-5.4,13.5c-20.7,45-74.8,57.1-112.8,25.3c-3.5-2.9-6.7-6.2-10-9.4
	c-61.7-61.7-123.5-123.3-184.9-185.2c-6.1-6.1-10.2-6.4-17.2-1.8c-49.7,32.9-104.6,51.5-163.7,56.3c-74.4,6-144.4-9.3-209-47.5
	c-76.4-45.2-130.2-109.8-157.9-193.9c-34-103.4-23.9-203.5,33-296.9c57.8-95,142.9-151.6,252.6-168.4
	c95.7-14.6,183.7,7.9,261.7,65.3c78.8,57.9,126.4,136.1,141.6,232.6c13,82.2-2.2,159.9-43.9,232.1c-4.5,7.8-4.4,12.2,2.3,18.8
	c61.2,60.6,121.8,121.7,182.9,182.4c13.9,13.7,25.7,28.3,30.7,47.6C942,860.7,942,870.5,942,880.2z M656.9,424.3
	C658,295,552.1,185.7,419,185.4C288.9,185,179,288.9,179.4,424.5C179.8,559,286.1,662.8,417.9,663
	C553.9,663.3,657.6,553.1,656.9,424.3z" />
              </svg>
            </div>
            <div class="MImageBTN DeleteMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M610.6,500.4c0-13.9,8.5-22.4,14.7-28.6c20.1-20.1,40.2-40.2,60.3-60.3c56.6-56.6,115-115.2,172.8-172.5
	c15.3-15.2,23.8-28.8,27.3-43.8v-25.9c-5.5-21.4-16.3-36.2-34-46.4c-9.8-5.6-21.2-8.6-32.9-8.6h0h0c-16.4,0-32,5.7-43.9,15.9
	c-3.4,2.9-6.9,6.2-11.4,10.8C705.4,199,646.3,258.1,589.2,315.2l-60,60c-6.6,6.6-14.9,14.9-28.9,14.9c-13.9,0-22.2-8.2-28.8-14.9
	c-21-21-42.1-42.1-63.1-63.1C351.6,255.3,292.8,196.5,235,138.6c-16.5-16.5-33.9-24.2-54.7-24.2c-1,0-2,0-3,0.1
	c-15.1,0.5-30.8,7.8-43,20c-12.2,12.2-19.5,27.9-20,43c-0.7,22.2,6.9,40.5,24.2,57.7c57.5,57.2,115.8,115.6,172.1,172
	c21.3,21.3,42.6,42.6,63.9,64c6.8,6.8,15.3,15.3,15.3,29.5c0,14.1-8.5,22.6-15.4,29.4c-21,21-41.9,41.9-62.9,62.9
	C255,649.5,196.3,708.2,138.5,765.8c-16.6,16.6-24.3,33.6-24.1,53.6c0.3,30,20.5,56.5,49.1,64.6c2.1,0.6,4.2,1.2,6.2,1.7h25.4
	c15.1-3.6,28.7-12.1,43.8-27.3c57.4-57.8,115.9-116.3,172.5-172.8c20.1-20.1,40.2-40.2,60.3-60.3c6.2-6.2,14.7-14.7,28.6-14.7
	c13.9,0,22.4,8.5,28.6,14.7c20.1,20.1,40.2,40.2,60.4,60.3c56.6,56.5,115.1,115,172.5,172.8c15.1,15.2,28.7,23.8,43.8,27.3h26
	c21.4-5.4,36.2-16.3,46.6-34.2c3.3-5.6,5.4-12.8,7.6-20.4v-25.5c-3.6-15-12.1-28.7-27.3-43.8c-57.8-57.4-116.3-116-172.9-172.6
	c-20.1-20.1-40.1-40.2-60.2-60.2C619.1,522.8,610.6,514.3,610.6,500.4z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="MImagePicker">
          <label class="MButton" for="HousingImage">بطاقة السكن</label>
          <input id="HousingImage" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="MImage">
        <div class="MImagePreview">
          <img :src="ServerPath + '/storage/Placeholder/1.svg'" />
          <div class="MImageButtons">
            <div class="MImageBTN ShowMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M942,880.2c-1.8,4.5-3.3,9.1-5.4,13.5c-20.7,45-74.8,57.1-112.8,25.3c-3.5-2.9-6.7-6.2-10-9.4
	c-61.7-61.7-123.5-123.3-184.9-185.2c-6.1-6.1-10.2-6.4-17.2-1.8c-49.7,32.9-104.6,51.5-163.7,56.3c-74.4,6-144.4-9.3-209-47.5
	c-76.4-45.2-130.2-109.8-157.9-193.9c-34-103.4-23.9-203.5,33-296.9c57.8-95,142.9-151.6,252.6-168.4
	c95.7-14.6,183.7,7.9,261.7,65.3c78.8,57.9,126.4,136.1,141.6,232.6c13,82.2-2.2,159.9-43.9,232.1c-4.5,7.8-4.4,12.2,2.3,18.8
	c61.2,60.6,121.8,121.7,182.9,182.4c13.9,13.7,25.7,28.3,30.7,47.6C942,860.7,942,870.5,942,880.2z M656.9,424.3
	C658,295,552.1,185.7,419,185.4C288.9,185,179,288.9,179.4,424.5C179.8,559,286.1,662.8,417.9,663
	C553.9,663.3,657.6,553.1,656.9,424.3z" />
              </svg>
            </div>
            <div class="MImageBTN DeleteMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M610.6,500.4c0-13.9,8.5-22.4,14.7-28.6c20.1-20.1,40.2-40.2,60.3-60.3c56.6-56.6,115-115.2,172.8-172.5
	c15.3-15.2,23.8-28.8,27.3-43.8v-25.9c-5.5-21.4-16.3-36.2-34-46.4c-9.8-5.6-21.2-8.6-32.9-8.6h0h0c-16.4,0-32,5.7-43.9,15.9
	c-3.4,2.9-6.9,6.2-11.4,10.8C705.4,199,646.3,258.1,589.2,315.2l-60,60c-6.6,6.6-14.9,14.9-28.9,14.9c-13.9,0-22.2-8.2-28.8-14.9
	c-21-21-42.1-42.1-63.1-63.1C351.6,255.3,292.8,196.5,235,138.6c-16.5-16.5-33.9-24.2-54.7-24.2c-1,0-2,0-3,0.1
	c-15.1,0.5-30.8,7.8-43,20c-12.2,12.2-19.5,27.9-20,43c-0.7,22.2,6.9,40.5,24.2,57.7c57.5,57.2,115.8,115.6,172.1,172
	c21.3,21.3,42.6,42.6,63.9,64c6.8,6.8,15.3,15.3,15.3,29.5c0,14.1-8.5,22.6-15.4,29.4c-21,21-41.9,41.9-62.9,62.9
	C255,649.5,196.3,708.2,138.5,765.8c-16.6,16.6-24.3,33.6-24.1,53.6c0.3,30,20.5,56.5,49.1,64.6c2.1,0.6,4.2,1.2,6.2,1.7h25.4
	c15.1-3.6,28.7-12.1,43.8-27.3c57.4-57.8,115.9-116.3,172.5-172.8c20.1-20.1,40.2-40.2,60.3-60.3c6.2-6.2,14.7-14.7,28.6-14.7
	c13.9,0,22.4,8.5,28.6,14.7c20.1,20.1,40.2,40.2,60.4,60.3c56.6,56.5,115.1,115,172.5,172.8c15.1,15.2,28.7,23.8,43.8,27.3h26
	c21.4-5.4,36.2-16.3,46.6-34.2c3.3-5.6,5.4-12.8,7.6-20.4v-25.5c-3.6-15-12.1-28.7-27.3-43.8c-57.8-57.4-116.3-116-172.9-172.6
	c-20.1-20.1-40.1-40.2-60.2-60.2C619.1,522.8,610.6,514.3,610.6,500.4z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="MImagePicker">
          <label class="MButton" for="HousingImageBack">ظهر بطاقة السكن</label>
          <input id="HousingImageBack" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="MImage">
        <div class="MImagePreview">
          <img :src="ServerPath + '/storage/Placeholder/1.svg'" />
          <div class="MImageButtons">
            <div class="MImageBTN ShowMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M942,880.2c-1.8,4.5-3.3,9.1-5.4,13.5c-20.7,45-74.8,57.1-112.8,25.3c-3.5-2.9-6.7-6.2-10-9.4
	c-61.7-61.7-123.5-123.3-184.9-185.2c-6.1-6.1-10.2-6.4-17.2-1.8c-49.7,32.9-104.6,51.5-163.7,56.3c-74.4,6-144.4-9.3-209-47.5
	c-76.4-45.2-130.2-109.8-157.9-193.9c-34-103.4-23.9-203.5,33-296.9c57.8-95,142.9-151.6,252.6-168.4
	c95.7-14.6,183.7,7.9,261.7,65.3c78.8,57.9,126.4,136.1,141.6,232.6c13,82.2-2.2,159.9-43.9,232.1c-4.5,7.8-4.4,12.2,2.3,18.8
	c61.2,60.6,121.8,121.7,182.9,182.4c13.9,13.7,25.7,28.3,30.7,47.6C942,860.7,942,870.5,942,880.2z M656.9,424.3
	C658,295,552.1,185.7,419,185.4C288.9,185,179,288.9,179.4,424.5C179.8,559,286.1,662.8,417.9,663
	C553.9,663.3,657.6,553.1,656.9,424.3z" />
              </svg>
            </div>
            <div class="MImageBTN DeleteMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M610.6,500.4c0-13.9,8.5-22.4,14.7-28.6c20.1-20.1,40.2-40.2,60.3-60.3c56.6-56.6,115-115.2,172.8-172.5
	c15.3-15.2,23.8-28.8,27.3-43.8v-25.9c-5.5-21.4-16.3-36.2-34-46.4c-9.8-5.6-21.2-8.6-32.9-8.6h0h0c-16.4,0-32,5.7-43.9,15.9
	c-3.4,2.9-6.9,6.2-11.4,10.8C705.4,199,646.3,258.1,589.2,315.2l-60,60c-6.6,6.6-14.9,14.9-28.9,14.9c-13.9,0-22.2-8.2-28.8-14.9
	c-21-21-42.1-42.1-63.1-63.1C351.6,255.3,292.8,196.5,235,138.6c-16.5-16.5-33.9-24.2-54.7-24.2c-1,0-2,0-3,0.1
	c-15.1,0.5-30.8,7.8-43,20c-12.2,12.2-19.5,27.9-20,43c-0.7,22.2,6.9,40.5,24.2,57.7c57.5,57.2,115.8,115.6,172.1,172
	c21.3,21.3,42.6,42.6,63.9,64c6.8,6.8,15.3,15.3,15.3,29.5c0,14.1-8.5,22.6-15.4,29.4c-21,21-41.9,41.9-62.9,62.9
	C255,649.5,196.3,708.2,138.5,765.8c-16.6,16.6-24.3,33.6-24.1,53.6c0.3,30,20.5,56.5,49.1,64.6c2.1,0.6,4.2,1.2,6.2,1.7h25.4
	c15.1-3.6,28.7-12.1,43.8-27.3c57.4-57.8,115.9-116.3,172.5-172.8c20.1-20.1,40.2-40.2,60.3-60.3c6.2-6.2,14.7-14.7,28.6-14.7
	c13.9,0,22.4,8.5,28.6,14.7c20.1,20.1,40.2,40.2,60.4,60.3c56.6,56.5,115.1,115,172.5,172.8c15.1,15.2,28.7,23.8,43.8,27.3h26
	c21.4-5.4,36.2-16.3,46.6-34.2c3.3-5.6,5.4-12.8,7.6-20.4v-25.5c-3.6-15-12.1-28.7-27.3-43.8c-57.8-57.4-116.3-116-172.9-172.6
	c-20.1-20.1-40.1-40.2-60.2-60.2C619.1,522.8,610.6,514.3,610.6,500.4z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="MImagePicker">
          <label class="MButton" for="DriverLicenceImage">اجازة السائق</label>
          <input id="DriverLicenceImage" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="MImage">
        <div class="MImagePreview">
          <img :src="ServerPath + '/storage/Placeholder/1.svg'" />
          <div class="MImageButtons">
            <div class="MImageBTN ShowMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M942,880.2c-1.8,4.5-3.3,9.1-5.4,13.5c-20.7,45-74.8,57.1-112.8,25.3c-3.5-2.9-6.7-6.2-10-9.4
	c-61.7-61.7-123.5-123.3-184.9-185.2c-6.1-6.1-10.2-6.4-17.2-1.8c-49.7,32.9-104.6,51.5-163.7,56.3c-74.4,6-144.4-9.3-209-47.5
	c-76.4-45.2-130.2-109.8-157.9-193.9c-34-103.4-23.9-203.5,33-296.9c57.8-95,142.9-151.6,252.6-168.4
	c95.7-14.6,183.7,7.9,261.7,65.3c78.8,57.9,126.4,136.1,141.6,232.6c13,82.2-2.2,159.9-43.9,232.1c-4.5,7.8-4.4,12.2,2.3,18.8
	c61.2,60.6,121.8,121.7,182.9,182.4c13.9,13.7,25.7,28.3,30.7,47.6C942,860.7,942,870.5,942,880.2z M656.9,424.3
	C658,295,552.1,185.7,419,185.4C288.9,185,179,288.9,179.4,424.5C179.8,559,286.1,662.8,417.9,663
	C553.9,663.3,657.6,553.1,656.9,424.3z" />
              </svg>
            </div>
            <div class="MImageBTN DeleteMImage">
              <svg viewBox="0 0 1000 1000">
                <path d="M610.6,500.4c0-13.9,8.5-22.4,14.7-28.6c20.1-20.1,40.2-40.2,60.3-60.3c56.6-56.6,115-115.2,172.8-172.5
	c15.3-15.2,23.8-28.8,27.3-43.8v-25.9c-5.5-21.4-16.3-36.2-34-46.4c-9.8-5.6-21.2-8.6-32.9-8.6h0h0c-16.4,0-32,5.7-43.9,15.9
	c-3.4,2.9-6.9,6.2-11.4,10.8C705.4,199,646.3,258.1,589.2,315.2l-60,60c-6.6,6.6-14.9,14.9-28.9,14.9c-13.9,0-22.2-8.2-28.8-14.9
	c-21-21-42.1-42.1-63.1-63.1C351.6,255.3,292.8,196.5,235,138.6c-16.5-16.5-33.9-24.2-54.7-24.2c-1,0-2,0-3,0.1
	c-15.1,0.5-30.8,7.8-43,20c-12.2,12.2-19.5,27.9-20,43c-0.7,22.2,6.9,40.5,24.2,57.7c57.5,57.2,115.8,115.6,172.1,172
	c21.3,21.3,42.6,42.6,63.9,64c6.8,6.8,15.3,15.3,15.3,29.5c0,14.1-8.5,22.6-15.4,29.4c-21,21-41.9,41.9-62.9,62.9
	C255,649.5,196.3,708.2,138.5,765.8c-16.6,16.6-24.3,33.6-24.1,53.6c0.3,30,20.5,56.5,49.1,64.6c2.1,0.6,4.2,1.2,6.2,1.7h25.4
	c15.1-3.6,28.7-12.1,43.8-27.3c57.4-57.8,115.9-116.3,172.5-172.8c20.1-20.1,40.2-40.2,60.3-60.3c6.2-6.2,14.7-14.7,28.6-14.7
	c13.9,0,22.4,8.5,28.6,14.7c20.1,20.1,40.2,40.2,60.4,60.3c56.6,56.5,115.1,115,172.5,172.8c15.1,15.2,28.7,23.8,43.8,27.3h26
	c21.4-5.4,36.2-16.3,46.6-34.2c3.3-5.6,5.4-12.8,7.6-20.4v-25.5c-3.6-15-12.1-28.7-27.3-43.8c-57.8-57.4-116.3-116-172.9-172.6
	c-20.1-20.1-40.1-40.2-60.2-60.2C619.1,522.8,610.6,514.3,610.6,500.4z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="MImagePicker">
          <label class="MButton" for="DriverLicenceImageBack">ظهر اجازة السائق</label>
          <input id="DriverLicenceImageBack" type="file" accept=".jpg" />
        </div>
      </div>
    </div>
    <div class="ComponentButtons">
      <div class="MButton" id="SaveBTN" @click="Save">حفظ</div>
      <div class="MButton" id="DeleteBTN" @click="Delete">حذف</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api, GetServerPath } from '../../axios.js';
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    return {
      GlobalsStore: ref(useGlobalsStore()),
      Operation: ref(''),
      Images: ref([]),
      ID: ref(0),
      ServerPath: ref(''),
      Attributes: ref(null),
      AttributesItems: ref([]),
      IdentificationType: ref(null),
      IdentificationTypeItems: ref([]),
      CampName: ref(null),
      CampNameItems: ref([]),
      EntryDate: ref(null),
      Camps: ref([]),
      CampCounter: ref(1),
      CampsTB: ref(null),
      CampsTBData: ref([]),
      CampsTBHeaders: ref(['اسم الكمب', 'رقم الغرفة']),
      CampsTBTotals: ref(['', '']),
      CampsTBDisplayColumns: ref(['camp_name', 'room_no']),
      Gender: ref(null),
      GenderItems: ref([]),
      BirthDate: ref(null),
      IdentificationIssuingDate: ref(null),
      SelectedAttributes: ref([]),
    };
  },
  mounted() {
    this.ServerPath = GetServerPath();
    this.GenderItems = this.GlobalsStore.ComboBoxes['Gender'];
    this.IdentificationTypeItems = this.GlobalsStore.ComboBoxes['IdentificationType'];
    this.AttributesItems = this.GlobalsStore.ComboBoxes['Attributes'];
    this.CampNameItems = this.GlobalsStore.ComboBoxes['Camps'];
    this.Operation = this.$route.meta.Operation;

    this.ComponentLoad();
    let Instance = this;

    document.getElementById('Attributes').addEventListener('MCBValueChange', function () {
      Instance.SelectedAttributes = Instance.Attributes.GetValue().split(' | ') ?? [];
    });

    document.querySelectorAll('.MImage').forEach(function (MImage) {
      MImage.querySelector('input').addEventListener('change', async function (e) {
        if (e.target.files.length != 0) {
          var Image = await Instance.CompressImage(e.target.files[0], 1500);
          var Name = e.target.getAttribute('id');
          var existingIndex = Instance.Images.findIndex(img => img.Name === Name);
          if (existingIndex !== -1) {
            Instance.Images[existingIndex].File = Image;
            Instance.Images[existingIndex].ActionType = "ADD";
          } else {
            Instance.Images.push({
              "File": Image,
              "Name": Name,
              "ActionType": "ADD",
            });
          }
          Instance.BuildImages();
          e.target.value = '';
        }
      });
      MImage.querySelector('.DeleteMImage').addEventListener('click', function () {
        if (!MImage.hasAttribute('required')) {
          var Name = MImage.querySelector('input').getAttribute('id');
          var existingIndex = Instance.Images.findIndex(img => img.Name === Name);
          if (existingIndex !== -1) {
            if (Instance.Images[existingIndex].ActionType == "ADD") {
              Instance.Images.splice(existingIndex, 1);
            } else {
              Instance.Images[existingIndex].File = "";
              Instance.Images[existingIndex].ActionType = "DELETE";
            }
          }
          Instance.BuildImages();
        }
      });
      MImage.querySelector('.ShowMImage').addEventListener('click', function () {
        var Image = MImage.querySelector('img').getAttribute('src');
        if (Image.startsWith("data:image")) {
          var byteCharacters = atob(Image.split(',')[1]);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray], { type: "image/png" });

          var blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl);
        } else {
          window.open(Image);
        }
      });
    });
  },
  methods: {
    ComponentLoad() {
      this.Images = []
      this.Camps = []
      document.querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      if (this.$route.meta.Operation == 'ADD') {
        document.getElementById('ID').style.display = 'none';
        document.getElementById('DeleteBTN').style.display = 'none';
        this.BuildImages();
      }
      if (this.$route.meta.Operation == 'EDIT') {
        this.ID = this.GlobalsStore.MArray['id'];
        document.getElementById('ID').style.display = 'flex';
        document.getElementById('DeleteBTN').style.display = 'flex';
        document.getElementById('ID').querySelector('input').value = this.GlobalsStore.MArray['id'];
        this.Attributes.Set(this.GlobalsStore.MArray['attributes'], 'attribute');
        document.getElementById('Name').querySelector('input').value = this.GlobalsStore.MArray['name'];
        document.getElementById('Nationality').querySelector('input').value = this.GlobalsStore.MArray['nationality'];
        document.getElementById('MotherName').querySelector('input').value = this.GlobalsStore.MArray['mother_name'];
        document.getElementById('IdentificationNumber').querySelector('input').value = this.GlobalsStore.MArray['identification_number'];
        document.getElementById('IdentificationRecord').querySelector('input').value = this.GlobalsStore.MArray['identification_record'];
        document.getElementById('IdentificationPage').querySelector('input').value = this.GlobalsStore.MArray['identification_page'];
        document.getElementById('IdentificationIssuingAuthority').querySelector('input').value = this.GlobalsStore.MArray['identification_issuing_authority'];
        document.getElementById('Phone').querySelector('input').value = this.GlobalsStore.MArray['phone'];
        document.getElementById('Study').querySelector('input').value = this.GlobalsStore.MArray['study'];
        document.getElementById('WorkType').querySelector('input').value = this.GlobalsStore.MArray['work_type'];
        document.getElementById('WorkPlace').querySelector('input').value = this.GlobalsStore.MArray['work_place'];
        document.getElementById('Address').querySelector('input').value = this.GlobalsStore.MArray['address'];
        document.getElementById('EMail').querySelector('input').value = this.GlobalsStore.MArray['email'];
        document.getElementById('ContractorContractNo').querySelector('input').value = this.GlobalsStore.MArray['contractor_contract_no'];
        document.getElementById('EntryPort').querySelector('input').value = this.GlobalsStore.MArray['entry_port'];
        document.getElementById('Notes').querySelector('input').value = this.GlobalsStore.MArray['notes'];

        this.Gender.Set(this.GlobalsStore.MArray['gender']);
        this.BirthDate.Set(this.GlobalsStore.MArray['birth']);
        this.IdentificationType.Set(this.GlobalsStore.MArray['identification_type']);
        this.IdentificationIssuingDate.Set(this.GlobalsStore.MArray['identification_issuing_date']);
        this.EntryDate.Set(this.GlobalsStore.MArray['entry_date']);
        setTimeout(function () {
          this.SelectedAttributes = this.Attributes.GetValue().split(' | ') ?? [];
        }.bind(this), 100);

        this.Images = this.GlobalsStore.MArray['images'];
        this.BuildImages();
      }
    },
    Save() {
      window.ShowLoading();
      var Parameters = new FormData();

      Parameters.append('id', this.ID);
      Parameters.append('name', document.getElementById('Name').querySelector('input').value);
      Parameters.append('gender', this.Gender.GetValue());
      Parameters.append('birth', this.BirthDate.Get());
      Parameters.append('nationality', document.getElementById('Nationality').querySelector('input').value);
      Parameters.append('mother_name', document.getElementById('MotherName').querySelector('input').value);
      Parameters.append('identification_type', this.IdentificationType.GetValue());
      Parameters.append('identification_number', document.getElementById('IdentificationNumber').querySelector('input').value);
      Parameters.append('identification_record', document.getElementById('IdentificationRecord').querySelector('input').value);
      Parameters.append('identification_page', document.getElementById('IdentificationPage').querySelector('input').value);
      Parameters.append('identification_issuing_authority', document.getElementById('IdentificationIssuingAuthority').querySelector('input').value);
      Parameters.append('identification_issuing_date', this.IdentificationIssuingDate.Get());
      Parameters.append('phone', document.getElementById('Phone').querySelector('input').value);
      Parameters.append('study', document.getElementById('Study').querySelector('input').value);
      Parameters.append('work_type', document.getElementById('WorkType').querySelector('input').value);
      Parameters.append('work_place', document.getElementById('WorkPlace').querySelector('input').value);
      Parameters.append('address', document.getElementById('Address').querySelector('input').value);
      Parameters.append('email', document.getElementById('EMail').querySelector('input').value);
      Parameters.append('contractor_contract_no', document.getElementById('ContractorContractNo').querySelector('input').value);
      Parameters.append('entry_port', document.getElementById('EntryPort').querySelector('input').value);
      Parameters.append('entry_date', this.EntryDate.Get());
      Parameters.append('notes', document.getElementById('Notes').querySelector('input').value);

      Parameters.append('Attributes', JSON.stringify(this.Attributes.GetValue().split(' | ')));
      Parameters.append('Images', JSON.stringify(this.Images));

      if (this.Operation == 'ADD') {
        api.post('AddPerson', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            window.HideLoading();
            this.$router.push({ name: 'Persons' });
          } else {
            window.HideLoading();
            window.ShowMessage(response.data)
          }
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }

      if (this.Operation == 'EDIT') {
        api.post('EditPerson', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            window.HideLoading();
            this.$router.push({ name: 'CampsConractors' });
          } else {
            window.HideLoading();
            window.ShowMessage(response.data);
          }
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }
    },
    Delete() {
      var YesFunction = function () {
        window.ShowLoading();
        api.post("DeleteContractor", null, {
          params: {
            id: this.ID,
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            this.$router.push({ name: 'CampsConractors' });
            window.HideChoose();
          } else {
            window.HideChoose();
            window.ShowMessage(response.data);
          }
          window.HideLoading();
        }).catch(error => {
          window.HideChoose();
          window.HideLoading();
          window.ShowMessage(error);
        });
      }.bind(this);
      var NoFunction = function () {
        window.HideChoose();
      }
      window.ShowChoose('هل انت متاكد من عملية الحذف؟', YesFunction, NoFunction);
    },
    BuildImages() {
      let Instance = this;
      //Empty All MImages
      document.querySelectorAll('.MImage').forEach(function (MImage) {
        MImage.setAttribute('NoImage', true);
        MImage.querySelector('img').setAttribute('src', Instance.ServerPath + '/storage/Placeholder/1.svg')
      });

      for (var i = 0; i < Instance.Images.length; i++) {
        let Image = Instance.Images[i]['File'];
        let Name = Instance.Images[i]['Name'];
        document.querySelectorAll('.MImage').forEach(function (MImage) {
          if (Name == MImage.querySelector('input').getAttribute('id')) {
            if (Instance.Images[i]['ActionType'] != 'DELETE') {
              MImage.removeAttribute('NoImage');
              setTimeout(function () {
                MImage.querySelector('img').setAttribute('src', Image);
              }, 10);
            }
          }
        });
      }
    },
    async CompressImage(ImageFile, MaxSize) {
      // Wrap FileReader in a Promise to read the file as a Data URL
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(ImageFile);
      });

      // Create a new image and wait for it to load
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = dataUrl;
      });

      // Perform image resizing and compression
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // Resize the image to maintain aspect ratio within MaxSize limits
      if (width > height) {
        if (width > MaxSize) {
          height *= MaxSize / width;
          width = MaxSize;
        }
      } else {
        if (height > MaxSize) {
          width *= MaxSize / height;
          height = MaxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Return the compressed image as a base64 data URL
      return canvas.toDataURL("image/jpeg", 0.7); // Adjust quality if needed
    },
    CheckAttributes(values) {
      return this.SelectedAttributes.some(value => values.includes(value));
    }
  }
}
</script>


<style scoped>
#AddAttachmentInput {
  display: none;
}

#DeleteBTN {
  background-color: red;
}

#SaveCamp,
#CancelCamp {
  display: none;
}

#DeleteBTN:hover {
  background-color: var(--MButtonBG);
  color: red;
}
</style>

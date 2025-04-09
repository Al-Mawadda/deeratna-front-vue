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
      <div class="MField" id="Nationality" v-show="CheckAttributes(['متعهد', 'عامل'])">
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
        :Items="IdentificationTypeItems" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد', 'عامل'])"></MComboBox>
      <div class="MField" id="IdentificationNumber" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد', 'عامل'])">
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
      <div class="MField" id="Phone" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد', 'كادر'])">
        <input type="text" required>
        <label>رقم الهاتف</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Study" v-show="CheckAttributes(['مالك', 'مستاجر'])">
        <input type="text" required />
        <label>التحصيل الدراسي</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="WorkType" v-show="CheckAttributes(['مالك', 'مستاجر', 'كادر'])">
        <input type="text" required />
        <label>نوع العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="WorkPlace" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد', 'كادر'])">
        <input type="text" required />
        <label>موقع العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Address" v-show="CheckAttributes(['متعهد', 'كادر', 'عامل'])">
        <input type="text" required />
        <label>العنوان</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="CarNumber" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد', 'كادر'])">
        <input type="text" required>
        <label>رقم العجلة</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="CarDetails" v-show="CheckAttributes(['مالك', 'مستاجر', 'متعهد', 'كادر'])">
        <input type="text" required>
        <label>تفاصيل العجلة</label>
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
      <div class="MField" id="EntryPort" v-show="CheckAttributes(['متعهد', 'عامل'])">
        <input type="text" required />
        <label>منفذ الدخول</label>
        <div class="MFieldBG"></div>
      </div>
      <MDate ref="EntryDate" :Name="'EntryDate'" :Label="'تاريخ الدخول'" v-show="CheckAttributes(['متعهد', 'عامل'])"></MDate>
      <div class="MField" id="Notes">
        <input type="text" required />
        <label>الملاحظات</label>
        <div class="MFieldBG"></div>
      </div>
    </div>
    <div class="MGroup" id="NFCCardGroup">
      <div class="MGroupTitle">بطاقة الدخول</div>
      <div class="MField" id="NFCID">
        <input type="text" disabled v-model="NFCID" required>
        <label>رمز البطاقة</label>
        <div class="MFieldBG"></div>
        <div v-show="NFCID" class="MButton MFieldBTN">
          <svg viewBox="0 0 1000 1000">
            <path d="M922.1,147.7c0.5,14.9-10.1,31.1-24.9,45.8C800.4,290,703.8,386.8,607.1,483.5c-16.5,16.5-16.5,16.5,0.5,33.4
		c97,97,194,194.1,291.1,291c17.4,17.3,27.2,36.8,22.7,61.9c-8.5,47.1-63.2,68.5-101.3,39.4c-5.5-4.2-10.5-9.3-15.4-14.2
		c-97.8-97.7-195.6-195.3-293-293.4c-9.4-9.5-14-9.2-23.2,0.1C389.7,701.1,290.3,800,191.3,899.3c-19.7,19.8-42.3,28.4-69.5,20
		c-41.1-12.7-57.5-63.1-32.2-97.9c4.1-5.6,9.2-10.6,14.1-15.5c97.3-97.4,194.7-194.8,292.1-292.2c13.8-13.8,13.8-13.8-0.5-28.1
		C297.3,387.5,199.3,289.3,101,191.4c-20.2-20.1-29.1-43-19.9-70.8c15-45.2,70.8-57.9,106.2-23.7c33.9,32.7,66.7,66.4,100,99.7
		c67.3,67.3,134.7,134.4,201.6,202c8.7,8.8,13.2,9.2,22.1,0.2c98.9-99.4,198.4-198.2,297.5-297.4c13.6-13.7,28.8-23,48.6-23.3
		C893.3,77.6,921.6,104.9,922.1,147.7z" />
          </svg>
        </div>
      </div>
      <MDate ref="CardExpire" :Name="'CardExpire'" :Label="'صلاحية البطاقة'"></MDate>
      <MComboBox ref='CardStatus' :Name="'CardStatus'" :Label="'حالة البطاقة'" :Items="CardStatusItems"></MComboBox>
      <div class="MField" id="CardNotes">
        <input type="text" required>
        <label>ملاحظات البطاقة</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MGroupTitle" id="GatesTitle">البوابات</div>
      <div id="Gates">
        <MCheckBox :Name="'Amal1-1'" :Label="'الامل 1 - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'Amal1-2'" :Label="'الامل 1 - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'Amal2-1'" :Label="'الامل 2 - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'Amal2-2'" :Label="'الامل 2 - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'Amaal-1'" :Label="'الامال - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'Amaal-2'" :Label="'الامال - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'jawhara-1'" :Label="'جوهرة البصرة - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'jawhara-2'" :Label="'جوهرة البصرة - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'eye-1'" :Label="'عين البصرة - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'eye-2'" :Label="'عين البصرة - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'dura-1'" :Label="'درة البصرة - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'dura-2'" :Label="'درة البصرة - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'shuruq-1'" :Label="'الشروق - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'shuruq-2'" :Label="'الشروق - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'rafah-1'" :Label="'الرفاه - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'rafah-2'" :Label="'الرفاه - البوابة 2'"></MCheckBox>
        <MCheckBox :Name="'nassem-1'" :Label="'النسيم - البوابة 1'"></MCheckBox>
        <MCheckBox :Name="'nassem-2'" :Label="'النسيم - البوابة 2'"></MCheckBox>
      </div>
      <div class="MGroupSeperator"></div>
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
          <label class="MButton" for="CertificateImage">التاييد</label>
          <input id="CertificateImage" type="file" accept=".jpg" />
        </div>
      </div>
    </div>
    <div class="MGroup">
      <div class="MGroupTitle">المستمسكات</div>
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
    <div class="MGroup" id="AttacmentsGroup">
      <div class="MGroupTitle">المرفقات</div>
      <div class="MGroupButtons">
        <div id="AddAttachment">
          <label class="MButton" for="AddAttachmentInput">اضافة مرفق</label>
          <input id="AddAttachmentInput" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="Attachments"></div>
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
      CardExpire: ref(null),
      CardStatus: ref(null),
      CardStatusItems: ref([]),
      NFCID: ref(''),
      Gates: ref(''),
      Attachments: ref([]),
    };
  },
  mounted() {
    this.ServerPath = GetServerPath();
    this.GenderItems = this.GlobalsStore.ComboBoxes['Gender'];
    this.IdentificationTypeItems = this.GlobalsStore.ComboBoxes['IdentificationType'];
    this.AttributesItems = this.GlobalsStore.ComboBoxes['Attributes'];
    this.CampNameItems = this.GlobalsStore.ComboBoxes['Camps'];
    this.CardStatusItems = this.GlobalsStore.ComboBoxes['NFCCardStatus'];
    this.Operation = this.$route.meta.Operation;

    this.ComponentLoad();
    this.NFCCardsDetection();
    let Instance = this;

    document.getElementById('NFCID').querySelector('.MFieldBTN').addEventListener('click', function () {
      Instance.NFCID = '';
    });

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

    document.getElementById('AddAttachmentInput').addEventListener('change', async function (e) {
      if (e.target.files.length != 0) {
        var AttachmentFile = e.target.files[0];
        var FileExtension = AttachmentFile.name.split('.').pop().toLowerCase();
        var FileName = AttachmentFile.name.replace(/\.[^/.]+$/, "");

        if (['jpg', 'jpeg'].includes(FileExtension)) {
          AttachmentFile = await this.CompressImage(AttachmentFile, 1500);
          FileExtension = 'jpg';
        } else {
          window.ShowMessage('صيغة الملف غير مدعومة');
          e.target.value = '';
          return;
        }

        var DuplicateAttachment = 0;
        this.Attachments.forEach(function (e) {
          if (FileName === e['OriginalName'] || FileName === e['CurrentName']) {
            DuplicateAttachment++;
          }
        });

        if (DuplicateAttachment === 0) {
          this.Attachments.push({
            "File": AttachmentFile,
            "OriginalName": FileName,
            "CurrentName": FileName,
            "ActionType": 'ADD',
          });
          this.BuildAttachments();
        } else {
          window.ShowMessage('اسم المرفق مكرر');
        }
        e.target.value = '';
      }
    }.bind(this));
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
        document.getElementById('CarNumber').querySelector('input').value = this.GlobalsStore.MArray['car_number'];
        document.getElementById('CarDetails').querySelector('input').value = this.GlobalsStore.MArray['car_details'];
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

        //NFC Cards
        if (this.GlobalsStore.MArray['nfccard']) {
          this.NFCID = this.GlobalsStore.MArray['nfccard']['nfcid'];
          this.CardExpire.Set(this.GlobalsStore.MArray['nfccard']['cardexpire']);
          this.CardStatus.Set(this.GlobalsStore.MArray['nfccard']['cardstatus']);
          document.getElementById('CardNotes').querySelector('input').value = this.GlobalsStore.MArray['nfccard']['cardnotes'];
          // Populate Gates
          let TheGates = this.GlobalsStore.MArray['nfccard']['gates'].split('|');
          let GatesCheckBoxes = document.getElementById('Gates').querySelectorAll('.MCheckBox');
          for (let i = 0; i < TheGates.length; i++) {
            let GateName = TheGates[i].replaceAll('-', ' - ');
            for (let j = 0; j < GatesCheckBoxes.length; j++) {
              if (GateName == GatesCheckBoxes[j].querySelector('.MCheckBoxText').innerHTML) {
                GatesCheckBoxes[j].querySelector('input').checked = true
              }
            }
          }
        }

        //Images
        this.Images = this.GlobalsStore.MArray['images'];

        //Attachments
        this.Attachments = this.GlobalsStore.MArray['attachments'];

        this.BuildImages();
        this.BuildAttachments();
      }
    },
    Save() {
      window.ShowLoading();

      this.Gates = ''
      var GatesCheckBoxes = document.getElementById('Gates').querySelectorAll('.MCheckBox');
      for (var i = 0; i < GatesCheckBoxes.length; i++) {
        if (GatesCheckBoxes[i].querySelector('input').checked) {
          const gateText = GatesCheckBoxes[i].querySelector('.MCheckBoxText').innerHTML.replaceAll(' - ', '-')
          this.Gates += this.Gates ? '|' + gateText : gateText
        }
      }

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
      Parameters.append('car_number', document.getElementById('CarNumber').querySelector('input').value);
      Parameters.append('car_details', document.getElementById('CarDetails').querySelector('input').value);
      Parameters.append('email', document.getElementById('EMail').querySelector('input').value);
      Parameters.append('contractor_contract_no', document.getElementById('ContractorContractNo').querySelector('input').value);
      Parameters.append('entry_port', document.getElementById('EntryPort').querySelector('input').value);
      Parameters.append('entry_date', this.EntryDate.Get());
      Parameters.append('notes', document.getElementById('Notes').querySelector('input').value);

      Parameters.append('Attributes', JSON.stringify(this.Attributes.GetValue().split(' | ')));


      //NFC Card
      Parameters.append('nfccard', JSON.stringify({
        nfcid: this.NFCID,
        cardexpire: this.CardExpire.Get(),
        cardstatus: this.CardStatus.GetValue(),
        cardnotes: document.getElementById('CardNotes').querySelector('input').value,
        gates: this.Gates,
      }));

      //Images
      Parameters.append('Images', JSON.stringify(this.Images));

      //Attachments
      this.Attachments.forEach((file, index) => {
        Parameters.append(`Attachments[${index}][File]`, file['File']);
        Parameters.append(`Attachments[${index}][OriginalName]`, file['OriginalName']);
        Parameters.append(`Attachments[${index}][CurrentName]`, file['CurrentName']);
        Parameters.append(`Attachments[${index}][ActionType]`, file['ActionType']);
      });


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
            this.$router.push({ name: 'Persons' });
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
        api.post("DeletePerson", null, {
          params: {
            id: this.ID,
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            this.$router.push({ name: 'Persons' });
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
    BuildAttachments() {
      var Element = document.querySelector('.Attachments');
      var Instance = this;
      Element.innerHTML = '';
      this.Attachments.forEach(function (e) {
        if (e['ActionType'] != 'DELETE') {
          Element.innerHTML += `
                    <div class="Attachment" AttachmentName="` + e['OriginalName'] + `">
                    <div class="AttachmentContainer">
                        <div class="AttachmentImage"><img src="` + e['File'] + `"/></div>
                        <div class="AttachmentButtons">
                            <div class="MButton ViewAttachment">
                                <svg viewBox="0 0 1000 1000">
                                    <path d="M500,395.2C500,395.2,500,395.2,500,395.2C500,395.2,500,395.2,500,395.2c-58.6,0-105,46.7-104.9,105.4
	c0.1,57.7,46.7,104.2,104.7,104.2c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0c58,0,104.7-46.4,104.7-104.2
	C605,441.9,558.6,395.2,500,395.2z" />
                                    <path d="M986.9,512.7c1.6-8.7,1.5-17,0-24.8c0-1,0-2.1,0-3.1c-2-6.5-4.7-12.5-8-18.1c-2.5-4.5-5.6-8.9-9.1-13.3
	c-4.7-6-9.8-11.7-15.1-17.3c-31.9-35.7-65.5-69.7-102.1-100.7c-63.9-54-133.4-98.9-212.9-126.6c-45.5-15.9-92.1-25.1-139.8-25
	c-47.7-0.1-94.2,9.1-139.8,25c-79.5,27.8-149,72.6-212.9,126.6c-36.6,31-70.2,64.9-102.1,100.7c-5.2,5.6-10.4,11.3-15.1,17.3
	c-3.5,4.3-6.5,8.7-9.1,13.3c-3.3,5.6-6,11.6-8,18.1c0,1,0,2.1,0,3.1c-1.5,7.8-1.6,16.1,0,24.8c0,0.8,0,1.7,0,2.5c0.6,2,1.3,4,2,5.9
	c2.2,7.2,5.7,13.9,10.6,19.7c1.5,1.8,3.1,3.7,4.6,5.5c1.8,2.3,3.8,4.6,5.7,6.8c5.2,6,10.4,11.9,15.7,17.7
	c53.1,59.2,111.4,112.1,177.6,155.1c20.6,13.5,41.9,25.9,63.9,37.1c4.4,2.3,8.9,4.5,13.4,6.7c43,20.9,88.1,35.4,135.3,42.2
	c2.5,0.4,5,0.7,7.5,1c0.3,0,0.6,0.1,0.9,0.1c3.2,0.4,6.4,0.8,9.6,1.1c0,0,0.1,0,0.1,0c0.2,0,0.4,0,0.6,0.1c1.7,0.2,3.5,0.3,5.2,0.5
	c0.7,0.1,1.3,0.1,2,0.2c1.3,0.1,2.7,0.2,4.1,0.3c0.9,0.1,1.8,0.1,2.7,0.2c1.1,0.1,2.3,0.1,3.4,0.2c1,0.1,2.1,0.1,3.1,0.2
	c1,0,2.1,0.1,3.1,0.1c1.1,0,2.2,0.1,3.2,0.1c1,0,2,0.1,3,0.1c1.1,0,2.2,0,3.2,0.1c1,0,2,0,3.1,0c1.1,0,2.1,0,3.2,0
	c1.1,0,2.1,0,3.2,0c1,0,2,0,3.1,0c1.1,0,2.2,0,3.2-0.1c1,0,2-0.1,3-0.1c1.1,0,2.2-0.1,3.2-0.1c1,0,2.1-0.1,3.1-0.1
	c1,0,2.1-0.1,3.1-0.2c1.1-0.1,2.3-0.1,3.4-0.2c0.9-0.1,1.8-0.1,2.7-0.2c1.4-0.1,2.7-0.2,4.1-0.3c0.7-0.1,1.3-0.1,2-0.2
	c1.7-0.2,3.5-0.3,5.2-0.5c0.2,0,0.4,0,0.6-0.1c0,0,0.1,0,0.1,0c3.2-0.3,6.4-0.7,9.6-1.1c0.3,0,0.6-0.1,0.9-0.1c2.5-0.3,5-0.7,7.5-1
	c47.2-6.8,92.2-21.3,135.3-42.2c4.5-2.2,8.9-4.4,13.4-6.7c22.1-11.1,43.4-23.6,63.9-37.1c66.2-43,124.6-95.9,177.6-155.1
	c5.3-5.9,10.5-11.7,15.7-17.7c2-2.3,3.9-4.5,5.7-6.8c1.6-1.8,3.1-3.6,4.6-5.5c4.9-5.8,8.4-12.5,10.6-19.7c0.7-1.9,1.4-3.9,2-5.9
	C986.9,514.4,986.9,513.6,986.9,512.7z M291.5,500.3c0-115.3,93.2-208.6,208.5-209c115.4,0.4,208.6,93.7,208.5,209
	c0,114.8-93.5,208.2-208.5,208.4C385,708.5,291.5,615.2,291.5,500.3z" />
                                </svg>
                            </div>
                            <div class="MButton DeleteAttachment">
                                <svg viewBox="0 0 1000 1000">
                                    <path d="M320.9,945.7c-26.7-6.3-48.7-19.5-64-42.9c-10.5-16-14.8-33.8-16.3-52.5c-4.1-48.4-8.2-96.9-12.1-145.3
		c-3.7-45.3-7.1-90.6-10.9-135.8c-4.3-51.9-9-103.8-13.4-155.6c-1.8-20.5-3.3-40.9-5.1-61.4c-0.4-4.7,1.1-7.3,6.1-7.1
		c2.3,0.1,4.6,0,7,0c191.9,0,383.8,0,575.8,0c13.4,0,13.2,0,12.1,13.1c-3.1,38.4-5.9,76.7-9.1,115.1c-3.8,45-7.9,89.9-11.7,134.9
		c-2.6,31.1-4.8,62.3-7.4,93.5c-3.2,38.3-6.6,76.7-10,115c-1.5,17-1.4,34.3-4.8,51c-8.4,41-33.7,66.9-74.5,77.2
		c-1.1,0.3-2.2,0.7-3.3,1.1C559.8,945.7,440.4,945.7,320.9,945.7z M474.6,631.7c0,55.6,0,111.3,0,166.9c0,5.6,0.4,11,2.2,16.3
		c3.3,9.6,13.3,16.7,23.3,16.7c9.9,0,20-7.1,23.3-16.7c1.7-5,2.3-10.1,2.3-15.4c-0.1-111.3-0.1-222.5,0-333.8
		c0-5.3-0.6-10.4-2.3-15.4c-3.3-9.6-13.3-16.8-23.3-16.8c-10,0-20,7.1-23.3,16.8c-1.8,5.2-2.2,10.7-2.2,16.3
		C474.7,521.5,474.6,576.6,474.6,631.7z M386.1,811.9c-1.3-21.5-2.1-36.8-3.3-52.1c-3.8-49.9-8-99.7-11.7-149.6
		c-3.2-42.7-5.7-85.4-9.3-128c-0.9-10.3,0-20.9-3.3-31c-3.7-11.3-15.2-19.1-26-17.5c-13.4,1.9-23.3,12.7-22.7,25.5
		c0.7,15.3,2,30.6,3.2,45.9c3.9,49.9,8,99.7,11.7,149.6c3.2,42.7,5.7,85.4,9.3,128c0.8,10,0.1,20.3,3,30.2
		c3.6,11.9,15,19.9,26.2,18.4C376.6,829.4,386.1,818.7,386.1,811.9z M690.4,459.8c0.4-13.4-10.4-25.3-24-26.3
		c-13-0.9-24.5,9.7-26.3,24.9c-1.1,9.5-1.4,19-2.1,28.5c-1.9,26.8-3.7,53.7-5.7,80.5c-3.2,42.1-6.7,84.1-9.9,126.2
		c-2.8,36.6-5.3,73.2-8.1,109.9c-0.9,11.8,5.9,22.7,17,26.4c16.8,5.6,32.1-6.2,33.3-25.9c0.8-12.4,1.4-24.8,2.3-37.2
		c2.7-36,5.5-72.1,8.2-108.1c2-25.9,3.7-51.9,5.7-77.9C684.1,540.5,687.3,500.1,690.4,459.8z" />
                                    <path d="M499.9,293.9c-102.9,0-205.8,0-308.8,0c-21.2,0-31.1-9.6-30.8-30.6c0.2-13-1.5-26.1,1.4-39c8.5-37.3,39.3-62,77.6-62
		c34.2,0,68.4-0.2,102.6,0.2c7.8,0.1,9.9-2.4,9.8-10c-0.1-12.1-1.5-24.3,1.3-36.4c8.5-36.8,39.4-61.6,77.1-61.7
		c47,0,93.9-0.1,140.9,0c42.7,0.1,77.2,34.7,77.4,77.5c0,6.4,0.5,12.8-0.1,19.1c-0.9,8.6,1.9,11.6,11,11.4
		c34.2-0.5,68.4-0.3,102.6-0.2c43.3,0.1,77.7,34.5,77.9,77.9c0,8.4,0,16.8,0,25.2c-0.1,18.1-10.5,28.5-28.6,28.5
		C707.5,293.9,603.7,293.9,499.9,293.9z M499.2,162.2c29.2,0,58.5,0,87.7,0c3.7,0,8.2,0.7,8.1-5.1c0-8.7,0.6-17.5-0.7-26
		c-2.2-14.8-11.6-23.1-26.9-23.2c-44.9-0.4-89.8-0.4-134.6,0c-17.1,0.2-27,10.9-27.7,28.2c-0.2,5.8,0.3,11.6-0.2,17.4
		c-0.6,7.2,2.5,8.8,9.1,8.8C442.4,162.1,470.8,162.2,499.2,162.2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="AttachmentName"><input type="text" value="` + e['CurrentName'] + `" /></div>
                    </div>
                    </div>`;
        }
      });

      Element.querySelectorAll('.Attachment').forEach(function (e) {
        e.querySelector('.ViewAttachment').removeEventListener('click', null);
        e.querySelector('.ViewAttachment').addEventListener('click', function () {
          let Attachment = Instance.Attachments[Instance.Attachments.findIndex(item => item['OriginalName'] == e.getAttribute('AttachmentName'))]['File'];

          if (Attachment.startsWith("data:image")) {
            var byteCharacters = atob(Attachment.split(',')[1]);
            var byteNumbers = new Array(byteCharacters.length);
            for (let j = 0; j < byteCharacters.length; j++) {
              byteNumbers[j] = byteCharacters.charCodeAt(j);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: "image/png" });

            var blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl);
          } else {
            window.open(Attachment);
          }
        }.bind(this));

        e.querySelector('.DeleteAttachment').removeEventListener('click', null);
        e.querySelector('.DeleteAttachment').addEventListener('click', function () {
          var i = this.Attachments.findIndex(item => item['OriginalName'] == e.getAttribute('AttachmentName'));

          if (this.Attachments[i]['ActionType'] == 'ADD') {
            this.Attachments.splice(i, 1);
          } else {
            this.Attachments[i]['ActionType'] = 'DELETE';
          }

          this.BuildAttachments();
        }.bind(this));

        e.querySelector('input').removeEventListener('change', null);
        e.querySelector('input').addEventListener('change', function (event) {

          event.target.value = event.target.value.replaceAll('\\', '');
          event.target.value = event.target.value.replaceAll('/', '');
          event.target.value = event.target.value.replaceAll(':', '');
          event.target.value = event.target.value.replaceAll('*', '');
          event.target.value = event.target.value.replaceAll('?', '');
          event.target.value = event.target.value.replaceAll('"', '');
          event.target.value = event.target.value.replaceAll('<', '');
          event.target.value = event.target.value.replaceAll('>', '');
          event.target.value = event.target.value.replaceAll('|', '');

          var i = this.Attachments.findIndex(item => item['OriginalName'] == e.getAttribute('AttachmentName'));

          if (i !== -1) {
            if (this.Attachments[i]['ActionType'] == 'ADD') {
              this.Attachments[i]['CurrentName'] = event.target.value;
              this.Attachments[i]['OriginalName'] = event.target.value;
              e.closest('.Attachment').setAttribute('AttachmentName', event.target.value);
            } else {
              this.Attachments[i]['ActionType'] = 'RENAME';
              this.Attachments[i]['CurrentName'] = event.target.value;
            }
          }


        }.bind(this));
      }.bind(this));
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
    },
    async NFCCardsDetection() {
      let Instance = this;
      /* eslint-disable */
      try {
        const ndef = new NDEFReader();
        await ndef.scan();

        ndef.addEventListener("reading", function ({ serialNumber }) {
          if (!Instance.NFCID || Instance.NFCID == "") {
            Instance.NFCID = serialNumber;
          }
        });
      }
      catch {
        ufRequest("ReaderOpen", function () { });
        setInterval(function () {
          ufRequest("GetCardIdEx", function () {
            var serialNumber = ufResponse().CardUid;
            if (typeof serialNumber != 'undefined') {
              serialNumber = parseInt(ufResponse().CardUid).toString(16).match(/.{1,2}/g).join(':').toLowerCase();
              if (!Instance.NFCID || Instance.NFCID == "") {
                Instance.NFCID = serialNumber;
              }
            }
          });
        }, 1000);
      }
      /* eslint-enable */
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

#GatesTitle {
  margin-top: 10px;
  margin-bottom: 5px;
  justify-content: flex-start;
}

#Gates {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  margin: 0 7px;
}

#Gates .MCheckBox {
  display: flex;
  width: 50%;
  margin: 3px 0;
}
</style>

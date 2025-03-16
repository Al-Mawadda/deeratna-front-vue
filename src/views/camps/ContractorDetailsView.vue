<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div class="MField" id="ID">
        <input disabled type="text" required>
        <label>الرمز</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Name">
        <input type="text" required>
        <label>الاسم</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Nationality">
        <input type="text" required>
        <label>الجنسية</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox ref='IdentificationType' :Name="'IdentificationType'" :Label="'نوع المستمسك'"
        :Items="IdentificationTypeItems"></MComboBox>
      <div class="MField" id="IdentificationNumber">
        <input type="text" required>
        <label>رقم المستمسك</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Phone">
        <input type="text" required>
        <label>رقم الهاتف</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="WorkPlace">
        <input type="text" required />
        <label>موقع العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Address">
        <input type="text" required />
        <label>العنوان</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="ContractorContractNo">
        <input type="text" required />
        <label>رقم عقد العمل</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="WorkersCount">
        <input disabled type="text" required>
        <label>عدد العمال</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="EntryPort">
        <input type="text" required />
        <label>منفذ الدخول</label>
        <div class="MFieldBG"></div>
      </div>
      <MDate ref="EntryDate" :Name="'EntryDate'" :Label="'تاريخ الدخول'"></MDate>
    </div>
    <div class="MGroup" id="CampsGroup">
      <div class="MGroupTitle">الكمبات</div>
      <MComboBox ref='CampName' :Name="'CampName'" :Label="'اسم الكمب'" :Items="CampNameItems"></MComboBox>
      <div class="MField" id="RoomNo">
        <input type="text" required>
        <label>رقم الغرفة</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MGroupButtons">
        <div class="MButton" id="AddCamp">اضافة</div>
        <div class="MButton" id="SaveCamp">حفظ</div>
        <div class="MButton" id="CancelCamp">الغاء</div>
      </div>
      <MTable ref="CampsTB" :Name="'CampsTB'" :DataArray="CampsTBData" :HeadersArray="CampsTBHeaders"
        :TotalsArray="CampsTBTotals" :DisplayColumnsArray="CampsTBDisplayColumns" :ShowFilterRow="false"
        :RowsPerPage="999">
        <template v-slot:options>
          <div class="MTableOption" OptionEventName="EditItem">
            <div class="MTableOptionIcon"><svg viewBox="0 0 1000 1000">
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
              </svg></div>
            <div class="MTableOptionName">تعديل</div>
          </div>
          <div class="MTableOption" OptionEventName="DeleteItem">
            <div class="MTableOptionIcon"><svg viewBox="0 0 1000 1000">

                <path
                  d="M906.1,242.4c-4.5-16.8-18.9-26-40.5-26c-89.9,0-179.8,0-269.8,0l-103.4,0v-0.2l-70.2,0c-65.9,0-131.8,0-197.8,0
	c-6.8,0-13.5,0-20.3,0c-24.2,0-49.1,0-73.7,0.3c-12.9,0.2-24.3,5.5-31.2,14.5c-6.3,8.3-8.3,18.8-5.5,29.6
	c4.1,16,18.4,26.1,37.3,26.4c14.2,0.2,28.7,0.1,42.7,0.1c5.9,0,11.9,0,17.8,0c0.8,0,1.6,0,2.5,0c8.9,0,14.2,0,18.3,4.2
	c4,4.1,4,9.5,4,18.4l0,149.7c0,103.7,0,207.3,0,311c0,13,0.4,23.9,1.2,34.2c6.4,79,75.7,143.7,154.5,144.2
	c68.3,0.4,137.8,0.3,205,0.2c17,0,34-0.1,51-0.1c15.5,0,31.3-2.8,46.9-8.3c67-23.6,108.6-82.9,108.7-154.7
	c0.1-108.3,0.1-218.5,0.1-325c0-51,0-102.1,0-153.1c0-7.7,0-12.8,3.8-16.7c3.8-3.9,8.9-3.9,16.6-3.9c7.3,0,14.8,0,22,0.1
	c14.4,0.1,29.3,0.1,43.8-0.2c12.9-0.3,24.2-5.7,31-14.8C907.1,263.7,909,253.1,906.1,242.4z M686.4,852.8
	c-17.2,17.3-40.4,26.5-67.2,26.5c0,0,0,0,0,0c-23.8,0-47.6,0-71.5,0c-22.7,0-45.7,0-68.9,0c-32.7,0-65.6,0-98.2-0.1
	c-46.8-0.1-82.1-27.4-92.1-71.2c-1.7-7.4-1.6-14.6-1.6-21.5c0-1.1,0-2.2,0-3.3c0-60.2,0-120.3,0-180.5l0-51.2l0-58.7
	c0-61.5,0-123.1,0-184.6c0-7.9,0-13.1,3.9-17c3.9-3.9,8.8-3.9,17-3.9c128,0,256,0,383.9,0c8.2,0,13.2,0,17,3.8
	c3.9,3.9,3.9,9.1,3.9,17c0,44.2,0,89.1-0.1,132.6c-0.1,112.9-0.2,229.6,0.5,344.4C713.5,810.7,703.7,835.4,686.4,852.8z" />
                <path class="st1" d="M712.8,440.7c0-43.4,0.1-88.4,0.1-132.6c0-7.9,0-13.1-3.9-17c-3.9-3.8-8.8-3.8-17-3.8c-128,0-256,0-383.9,0
	c-8.2,0-13.1,0-17,3.9c-3.9,3.9-3.9,9.1-3.9,17c0,61.5,0,123.1,0,184.6l0,58.7l0,51.2c0,60.2,0,120.3,0,180.5c0,1.1,0,2.2,0,3.3
	c0,6.9-0.1,14.1,1.6,21.5c10,43.8,45.2,71.1,92.1,71.2c32.6,0.1,65.5,0.1,98.2,0.1c23.2,0,46.2,0,68.9,0c23.8,0,47.6,0,71.5,0
	c0,0,0,0,0,0c26.8,0,50-9.1,67.2-26.5c17.3-17.4,27.1-42.1,26.9-67.8C712.6,670.3,712.7,553.5,712.8,440.7z M619.3,864.3
	c-23.8,0-47.6,0-71.5,0c-54.7,0-111.3,0.1-167-0.1c-40.1-0.1-69-22.4-77.5-59.5c-1.3-5.7-1.3-11.7-1.2-18.1c0-1.1,0-2.3,0-3.4
	c0-60.2,0-120.3,0-180.5l0-51.2l0-58.7c0-61.5,0-123.1,0-184.6c0-2,0-4.2,0.1-5.8c1.6-0.1,3.8-0.1,5.9-0.1c128,0,256,0,383.9,0
	c2.1,0,4.3,0,5.9,0.1c0.1,1.5,0.1,3.7,0.1,5.7c0,44.2,0,89.1-0.1,132.5c-0.1,112.9-0.2,229.7,0.5,344.5c0.1,21.7-8.1,42.5-22.5,57.1
	C661.5,856.6,641.9,864.3,619.3,864.3z" />
                <path d="M382.7,86.6c0.1,19.9,14.7,33.9,35.5,34c18.8,0.1,38,0.1,56.5,0c8.3,0,16.6,0,24.9,0c8.1,0,16.3,0,24.4,0c18.7,0,38,0,57,0
	c21.6-0.1,36.2-13.8,36.2-34.2c0.1-20.4-14.9-35.2-35.5-35.3C553.9,51,526.4,51,499.4,51c-27.8,0-55,0.1-81.4,0.2
	c-10,0-19.1,3.6-25.5,10.1C386.1,67.7,382.6,76.7,382.7,86.6z" />
                <path d="M535.3,423.2c0-4.8-0.5-9.4-1.4-13.8c-3.5-16-17.1-26.7-33.9-26.7c0,0,0,0-0.1,0c-16.9,0-30.2,10.6-33.9,27
	c-1.2,5.4-1.4,10.9-1.4,15.7c0,40.2,0,80.4,0,120.6l0,70.1c0,40.4,0,82.2,0.1,123.3c0,5.8,0.4,10.7,1.2,15c3,16,14.4,26.5,31.4,28.8
	c12.7,1.7,27.5-6.7,33.8-19.1c3-5.9,4.3-12.7,4.3-22l0-84.7C535.4,580.7,535.4,501.3,535.3,423.2z" />
              </svg></div>
            <div class="MTableOptionName">حذف</div>
          </div>
        </template>
      </MTable>
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
      Images: ref([]),
      ID: ref(0),
      ServerPath: ref(''),
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
    };
  },
  mounted() {
    this.ServerPath = GetServerPath();
    this.IdentificationTypeItems = this.GlobalsStore.ComboBoxes['IdentificationType'];
    this.CampNameItems = this.GlobalsStore.ComboBoxes['Camps'];

    this.ComponentLoad();
    let Instance = this;

    document.getElementById('AddCamp').addEventListener('click', function () {
      let CampData = {};

      CampData['id'] = 'A' + Instance.CampCounter;
      CampData['contractor_id'] = Instance.ID;
      CampData['camp_name'] = Instance.CampName.Get()[0]['MCBIName'];
      CampData['room_no'] = document.getElementById('RoomNo').querySelector('input').value;
      CampData['ActionType'] = 'ADD';

      Instance.Camps.push(CampData);
      Instance.CampCounter++;

      document.getElementById('CampsGroup').querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      Instance.CampName.Clear();
      Instance.CampsTBData = Instance.Camps.filter(camp => camp.ActionType !== "DELETE");
    });

    document.getElementById('SaveCamp').addEventListener('click', function () {
      document.getElementById('AddCamp').style.display = 'flex';
      document.getElementById('SaveCamp').style.display = 'none';
      document.getElementById('CancelCamp').style.display = 'none';

      Instance.Camps.forEach(camp => {
        if (camp.id == document.getElementById('CampsGroup').getAttribute('RowID')) {
          camp.camp_name = Instance.CampName.Get()[0]['MCBIName'];
          camp.room_no = document.getElementById('RoomNo').querySelector('input').value;
          if (camp.ActionType != 'ADD') {
            camp.ActionType = 'EDIT';
          }
        }
      });

      document.getElementById('CampsGroup').querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      Instance.CampName.Clear();
      Instance.CampsTBData = Instance.Camps.filter(camp => camp.ActionType !== "DELETE");
      document.getElementById('CampsGroup').removeAttribute('RowID')
    }.bind(this));

    document.getElementById('CancelCamp').addEventListener('click', function () {
      document.getElementById('AddCamp').style.display = 'flex';
      document.getElementById('SaveCamp').style.display = 'none';
      document.getElementById('CancelCamp').style.display = 'none';

      document.getElementById('CampsGroup').removeAttribute('RowID');
      document.getElementById('CampsGroup').querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      Instance.CampName.Clear();
    }.bind(this));

    document.getElementById('CampsTB').addEventListener('EditItem', function (data) {
      let CampData = data.detail.RowData;

      document.getElementById('AddCamp').style.display = 'none';
      document.getElementById('SaveCamp').style.display = 'flex';
      document.getElementById('CancelCamp').style.display = 'flex';

      document.getElementById('CampsGroup').setAttribute('RowID', CampData['id']);
      Instance.CampName.Set(CampData['camp_name']);
      document.getElementById('RoomNo').querySelector('input').value = CampData['room_no'];
    }.bind(this));

    document.getElementById('CampsTB').addEventListener('DeleteItem', function (data) {
      let CampData = data.detail.RowData;

      Instance.Camps.forEach((camp, index) => {
        if (camp.id == CampData['id']) {
          if (camp.ActionType == 'ADD') {
            Instance.Camps.splice(index, 1);
          } else {
            camp.ActionType = 'DELETE';
          }
        }
      });

      document.getElementById('CampsGroup').querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      Instance.CampName.Clear();
      Instance.CampsTBData = Instance.Camps.filter(camp => camp.ActionType !== "DELETE");
    }.bind(this));

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
        document.getElementById('WorkersCount').style.display = 'none';
        document.getElementById('DeleteBTN').style.display = 'none';
        this.BuildImages();
      }
      if (this.$route.meta.Operation == 'EDIT') {
        this.ID = this.GlobalsStore.MArray['id'];
        document.getElementById('ID').style.display = 'flex';
        document.getElementById('WorkersCount').style.display = 'flex';
        document.getElementById('DeleteBTN').style.display = 'flex';

        document.getElementById('ID').querySelector('input').value = this.GlobalsStore.MArray['id'];
        document.getElementById('Name').querySelector('input').value = this.GlobalsStore.MArray['name'];
        document.getElementById('Nationality').querySelector('input').value = this.GlobalsStore.MArray['nationality'];
        this.IdentificationType.Set(this.GlobalsStore.MArray['identification_type'])
        document.getElementById('IdentificationNumber').querySelector('input').value = this.GlobalsStore.MArray['identification_number'];
        document.getElementById('Phone').querySelector('input').value = this.GlobalsStore.MArray['phone'];
        document.getElementById('WorkPlace').querySelector('input').value = this.GlobalsStore.MArray['work_place'];
        document.getElementById('Address').querySelector('input').value = this.GlobalsStore.MArray['address'];
        document.getElementById('ContractorContractNo').querySelector('input').value = this.GlobalsStore.MArray['contractor_contract_no'];
        document.getElementById('WorkersCount').querySelector('input').value = this.GlobalsStore.MArray['workers_count'];
        document.getElementById('EntryPort').querySelector('input').value = this.GlobalsStore.MArray['entry_port'];
        this.EntryDate.Set(this.GlobalsStore.MArray['entry_date'])

        this.Images = this.GlobalsStore.MArray['images'];
        this.Camps = this.GlobalsStore.MArray['camps'];
        this.CampsTBData = this.GlobalsStore.MArray['camps'];
        this.BuildImages();
      }
    },
    Save() {
      window.ShowLoading();

      var Operation = this.$route.meta.Operation;

      var Parameters = new FormData();

      Parameters.append('id', this.ID);
      Parameters.append('name', document.getElementById('Name').querySelector('input').value);
      Parameters.append('nationality', document.getElementById('Nationality').querySelector('input').value);
      Parameters.append('identification_type', this.IdentificationType.GetValue());
      Parameters.append('identification_number', document.getElementById('IdentificationNumber').querySelector('input').value);
      Parameters.append('phone', document.getElementById('Phone').querySelector('input').value);
      Parameters.append('work_place', document.getElementById('WorkPlace').querySelector('input').value);
      Parameters.append('address', document.getElementById('Address').querySelector('input').value);
      Parameters.append('contractor_contract_no', document.getElementById('ContractorContractNo').querySelector('input').value);
      Parameters.append('entry_port', document.getElementById('EntryPort').querySelector('input').value);
      Parameters.append('entry_date', this.EntryDate.Get());

      Parameters.append('Images', JSON.stringify(this.Images));
      Parameters.append('Camps', JSON.stringify(this.Camps));

      if (Operation == 'ADD') {
        api.post('AddContractor', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            window.HideLoading();
            this.$router.push({ name: 'CampsConractors' });
          } else {
            window.HideLoading();
            window.ShowMessage(response.data)
          }
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }

      if (Operation == 'EDIT') {
        api.post('EditContractor', Parameters, {
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

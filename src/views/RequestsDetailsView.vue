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
      <div class="MField" id="KnownPerson">
        <input type="text" required>
        <label>المعرف</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="AboutPerson">
        <input type="text" required>
        <label>نبذة عن الشخص</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Subject">
        <textarea type="text" rows="4" required></textarea>
        <label>الموضوع</label>
        <div class="MFieldBG"></div>
      </div>
    </div>
    <div class="MGroup">
      <div class="MGroupButtons">
        <div id="AddAttachment">
          <label class="MButton" for="AddAttachmentInput">اضافة مرفق</label>
          <input id="AddAttachmentInput" type="file" accept=".jpg" />
        </div>
      </div>
      <div class="Attachments"></div>
    </div>
    <div class="ComponentButtons">
      <div class="MButton" id="SaveRequestBTN" @click="Save">حفظ الطلب</div>
      <div class="MButton" id="DeleteRequestBTN" @click="Delete">حذف الطلب</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from '../axios.js';
import { ShowMessage, ShowLoading, HideLoading, HideModal, ShowChooseModal } from '@/MJS.js';
import { useGlobalsStore } from '../stores/Globals.js';

export default {
  setup() {
    return {
      GlobalsStore: ref(useGlobalsStore()),

      Attachments: ref([]),
      ID: ref(0),
    };
  },
  mounted() {
    //MComboBoxBuild(document.getElementById('MComboBox2'), this.MyArray, 'name', 'id', 'حالة المستخدم', '', true, false, 5, true);

    this.ComponentLoad();
    document.getElementById('AddAttachmentInput').addEventListener('change', async function (e) {
      if (e.target.files.length != 0) {
        var AttachmentFile = await this.CompressImage(e.target.files[0], 1500);
        var FileName = e.target.files[0]['name'].replace(/\.[^/.]+$/, ""); // Remove the file extension

        var DuplicateAttachment = 0;
        this.Attachments.forEach(function (e) {
          if (FileName == e['OriginalName'] || FileName == e['CurrentName']) {
            DuplicateAttachment++;
          }
        });

        if (DuplicateAttachment == 0) {
          this.Attachments.push({
            "File": AttachmentFile,
            "OriginalName": FileName,
            "CurrentName": FileName,
            "ActionType": 'ADD',
          });
          this.BuildAttachments();
        } else {
          ShowMessage('اسم المرفق مكرر');
        }
        e.target.value = '';
      }
    }.bind(this));

  },
  methods: {
    ComponentLoad() {
      document.querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      if (this.$route.meta.Operation == 'ADD') {
        document.getElementById('ID').style.display = 'none';
        document.getElementById('DeleteRequestBTN').style.display = 'none';
      }
      if (this.$route.meta.Operation == 'EDIT') {
        this.ID = this.GlobalsStore.MArray['id'];

        document.getElementById('ID').style.display = 'flex';
        document.getElementById('DeleteRequestBTN').style.display = 'flex';

        document.getElementById('ID').querySelector('input').value = this.GlobalsStore.MArray['id'];
        document.getElementById('Name').querySelector('input').value = this.GlobalsStore.MArray['name'];
        document.getElementById('KnownPerson').querySelector('input').value = this.GlobalsStore.MArray['known_person'];
        document.getElementById('Subject').querySelector('textarea').value = this.GlobalsStore.MArray['subject'];
        document.getElementById('AboutPerson').querySelector('input').value = this.GlobalsStore.MArray['about_person'];
        this.Attachments = this.GlobalsStore.MArray['attachments'];
        this.BuildAttachments();
      }
    },
    Save() {
      ShowLoading();

      var Operation = this.$route.meta.Operation;

      var Parameters = new FormData();

      Parameters.append('id', this.ID);
      Parameters.append('name', document.getElementById('Name').querySelector('input').value);
      Parameters.append('known_person', document.getElementById('KnownPerson').querySelector('input').value);
      Parameters.append('subject', document.getElementById('Subject').querySelector('textarea').value);
      Parameters.append('about_person', document.getElementById('AboutPerson').querySelector('input').value);
      Parameters.append('Attachments', JSON.stringify(this.Attachments));

      if (Operation == 'ADD') {
        axios.post('/api/AddRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            HideLoading();
            this.$router.push({ name: 'Requests' });
          } else {
            HideLoading();
            ShowMessage(response.data);
          }
        }).catch(error => {
          HideLoading();
          ShowMessage(error);
        });
      }

      if (Operation == 'EDIT') {
        axios.post('/api/EditRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            HideLoading();
            this.$router.push({ name: 'Requests' });
          } else {
            HideLoading();
            ShowMessage(response.data);
          }
        }).catch(error => {
          HideLoading();
          ShowMessage(error);
        });
      }
    },
    Delete() {
      var YesFunction = function () {
        axios.post("/api/DeleteRequest", null, {
          params: {
            id: this.ID,
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            this.$router.push({ name: 'Requests' });
            HideModal(document.getElementById('ChooseModal'));
          } else {
            HideModal(document.getElementById('ChooseModal'));
            ShowMessage(response.data);
          }
        }).catch(error => {
          HideModal(document.getElementById('ChooseModal'));
          ShowMessage(error);
        });
      }.bind(this);
      var NoFunction = function () {
        HideModal(document.getElementById('ChooseModal'));
      }
      ShowChooseModal('هل انت متاكد من عملية الحذف؟', YesFunction, NoFunction);
    },
    BuildAttachments() {
      var Element = document.querySelector('.Attachments');
      Element.innerHTML = '';
      this.Attachments.forEach(function (e) {
        if (e['ActionType'] != 'DELETE') {
          Element.innerHTML += `
                    <div class="Attachment" AttachmentName="` + e['OriginalName'] + `">
                    <div class="AttachmentContainer">
                        <div class="AttachmentImage"><img src="` + e['File'] + `" /></div>
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
          var i = this.Attachments.findIndex(item => item['OriginalName'] == e.getAttribute('AttachmentName'));

          var MyWindow = window.open();
          var iFrame = document.createElement('iframe');

          iFrame.style.border = 'none';
          iFrame.style.width = '100vw';
          iFrame.style.height = '100vh';
          MyWindow.document.body.style.margin = 0;
          MyWindow.document.title = 'View';

          iFrame.src = this.Attachments[i]['File'];

          MyWindow.document.body.appendChild(iFrame);
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
    }
  }
}
</script>


<style scoped>
#AddAttachmentInput {
  display: none;
}

#DeleteRequestBTN {
  background-color: red;
}

#DeleteRequestBTN:hover {
  background-color: var(--MButtonBG);
  color: red;
}

#Subject {
  min-width: calc(100% - 10px);
}

#Subject textarea {
  resize: none;
}
</style>

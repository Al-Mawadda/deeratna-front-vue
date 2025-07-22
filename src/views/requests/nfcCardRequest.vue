<template>
  <div class="ComponentWrapper">
    <MModal ref="NfcCardRequestModal" :Name="'NfcCardRequestModal'" :Title="' طلب ' +
      selectedRowData.request_type +
      ' بطاقة ' +
      selectedRowData.name
      ">
      <table cellpadding="0" cellspacing="0" class="RequestsMTable" id="NfcCardRequestsTable">
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
            <td>رقم الهاتف</td>
            <td>{{ selectedRowData.phone }}</td>
          </tr>
          <tr v-show="selectedRowData.request_type == 'اضافة' && selectedRowData.attributes.includes('سائق')">
            <td>وقت السماح من</td>
            <td>{{ selectedRowData.allowed_time_from }}</td>
          </tr>
          <tr v-show="selectedRowData.request_type == 'اضافة' && selectedRowData.attributes.includes('سائق')">
            <td>وقت السماح الى</td>
            <td>{{ selectedRowData.allowed_time_to }}</td>
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
      <div class="MGroup ModalMGroup" v-show="selectedRowData.department_id == 3 || UserData.user.department_id == 1">
        <div class="MField" id="NFCID">
          <input disabled type="text" required />
          <label>رمز البطاقة</label>
          <div class="MFieldBG"></div>
        </div>

        <MDate
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          v-show="selectedRowData.request_type == 'اضافة' || selectedRowData.request_type == 'تمديد'" ref="CardExpire"
          :Name="'CardExpire'" :Label="'تاريخ الانتهاء'"></MDate>
      </div>

      <div class="MGroup ModalMGroup" id="GatesMGroup"
        v-show="selectedRowData.request_type == 'اضافة' && selectedRowData.department_id == 3 || UserData.user.department_id == 1">
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal1-1Box'" :Label="'الامل 1-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal1-2Box'" :Label="'الامل 1-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal2-1Box'" :Label="'الامل 2-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amal2-2Box'" :Label="'الامل 2-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amaal-1Box'" :Label="'الامال-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'Amaal-2Box'" :Label="'الامال-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'jawhara-1Box'" :Label="'جوهرة البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'jawhara-2Box'" :Label="'جوهرة البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'eye-1Box'" :Label="'عين البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'eye-2Box'" :Label="'عين البصرة-البوابة 2'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'dura-1Box'" :Label="'درة البصرة-البوابة 1'"></MCheckBox>
        <MCheckBox
          :Disabled="!(selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == 1 || (UserData.user.department_id == 3 && selectedRowData.department_id == 3)))"
          :Name="'dura-2Box'" :Label="'درة البصرة-البوابة 2'"></MCheckBox>
      </div>

      <div class="ModalButtons">
        <div v-id="hasPermission('entry_card_accept')">
          <div
            v-show="selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == selectedRowData.department_id || UserData.user.department_id == 1)"
            class="MButton" id="AcceptBTN" @click="AcceptRequest">
            قبول
          </div>
        </div>
        <div v-id="hasPermission('entry_card_reject')">
          <div
            v-show="selectedRowData.request_status == 'قيد المراجعة' && (UserData.user.department_id == selectedRowData.department_id || UserData.user.department_id == 1)"
            class="MButton" id="RejectBTN" @click="RejectRequest">
            رفض
          </div>
        </div>
      </div>
    </MModal>

    <!-- ========= Reject Model======== -->
    <MModal ref="NfcCardRequestRejectModal" :Name="'NfcCardRequestRejectModal'" :Title="'رفض الطلب'">
      <div class="MField" id="RejectionReason">
        <input type="text" required />
        <label>سبب الرفض</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="ModalButtons">
        <div class="MButton" id="SaveBTN" @click="SaveRejectRequest">حفظ</div>
      </div>
    </MModal>

    <div class="MButton" id="GetNfcCardRequestsBTN">عرض البيانات</div>
    <div class="MGroup">
      <MDate ref="NfcCardRequestsFromDate" :Name="'NfcCardRequestsFromDate'" :Label="'التاريخ'" :Range="true"
        :Clearable="true"></MDate>
    </div>

    <MTable ref="NfcCardRequestsTB" :Name="'NfcCardRequestsTB'" :DataArray="NfcCardRequestsTBData"
      :Columns="NfcCardRequestsTBColumns" :Sums="NfcCardRequestsTBSums" :GetDataFunction="GetNfcCardRequestsData"
      :RowsCount="NfcCardRequestsTBRowsCount" :RowsPerPage="10">
      <template v-slot:options>
        <!-- View Videosdffhroif Option -->
        <div class="MTableOption" OptionEventName="ViewItem">
          <div class="MTableOptionIcon">
            <svg viewBox="0 0 1000 1000">
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
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'
import { useGlobalsStore } from '../../stores/Globals.js'

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)
    const GlobalsStore = ref(useGlobalsStore())

    return {
      hasPermission,
      NfcCardRequestModal: ref(null),
      NfcCardRequestRejectModal: ref(null),
      NfcCardRequestsTB: ref(null),
      NfcCardRequestsTBData: ref([]),

      NfcCardRequestsTBColumns: [
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
          name: 'old_card_expire',
          label: 'تاريخ الانتهاء',
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
      NfcCardRequestsTBSums: ref([]),

      NfcCardRequestsTBRowsCount: ref(0),
      NfcCardRequestsFromDate: ref(null),
      selectedRowData: ref([]),
      NFCID: ref(''),
      CardExpire: ref(null),
      Gates: ref(''),
      UserData: ref(useAuthStore()),
    }
  },
  mounted() {
    this.NFCCardsDetection();
    this.NfcCardRequestsTB.LoadMTable();
    document.getElementById('GetNfcCardRequestsBTN').addEventListener(
      'click',
      function () {
        this.NfcCardRequestsTB.ReLoadMTable()
      }.bind(this)
    )
    document.getElementById('RejectBTN').addEventListener(
      'click',
      function () {
        document
          .getElementById('RejectionReason')
          .querySelector('input').value = ''
        this.NfcCardRequestRejectModal.Show()
      }.bind(this)
    )
    document.getElementById('NfcCardRequestsTB').addEventListener('ViewItem', function (data) {
      this.selectedRowData = data.detail.RowData
      document.getElementById('NFCID').querySelector('input').value = ''
      this.CardExpire.Clear()
      document.querySelectorAll('.MCheckBox input').forEach(function (e) {
        e.checked = false
      })

      document.getElementById('NFCID').querySelector('input').value = this.selectedRowData.nfc_id

      if (this.selectedRowData.request_type == 'اضافة' && this.selectedRowData.request_status == 'قيد المراجعة') {
        const now = new Date()
        const nextYear = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        )
        this.CardExpire.Set(nextYear.toISOString().split('T')[0]) // assuming Set() takes a string in YYYY-MM-DD format
      } else {
        this.CardExpire.Set(this.selectedRowData.card_expire)
      }

      if (this.selectedRowData.request_type == 'تمديد' && this.selectedRowData.request_status == 'قيد المراجعة') {
        // Parse old_CardExpire and add 1 year
        const oldDate = new Date(this.selectedRowData.old_card_expire)
        const nextYear = new Date(
          oldDate.getFullYear() + 1,
          oldDate.getMonth(),
          oldDate.getDate()
        )

        this.CardExpire.Set(nextYear.toISOString().split('T')[0]) // Format as YYYY-MM-DD
      } else {
        this.CardExpire.Set(this.selectedRowData.card_expire)
      }
      this.selectedRowData.gates.split('|').forEach(function (e) {
        document.querySelectorAll('.MCheckBox').forEach(function (d) {
          if (e == d.querySelector('.MCheckBoxText').innerHTML) {
            d.querySelector('input').checked = true
          }
        })
      })
      this.NfcCardRequestModal.Show()
    }.bind(this)
    )
  },

  methods: {
    GetNfcCardRequestsData(MTable) {
      api
        .get('GetNFCCardRequests', {
          params: {
            MTable: MTable,
            nfcCardRequestFrom: this.NfcCardRequestsFromDate.Get()[0],
            nfcCardRequestTo: this.NfcCardRequestsFromDate.Get()[1],
          },
        })
        .then(response => {
          this.NfcCardRequestsTBRowsCount = response.data.total
          this.NfcCardRequestsTBData = response.data.data
          this.NfcCardRequestsTBSums = response.data.sums
        })
        .catch(error => {
          ShowMessage(error)
        })
    },
    AcceptRequest() {
      ShowLoading()
      var GatesCheckBoxes = document
        .getElementById('GatesMGroup')
        .querySelectorAll('.MCheckBox')

      this.Gates = ''
      for (var i = 0; i < GatesCheckBoxes.length; i++) {
        if (GatesCheckBoxes[i].querySelector('input').checked) {
          const gateText =
            GatesCheckBoxes[i].querySelector('.MCheckBoxText').innerHTML

          // Add the gate text with a separator only if this.Gates is not empty
          this.Gates += this.Gates ? '|' + gateText : gateText
        }
      }

      var Parameters = new FormData()
      Parameters.append('RequestID', this.selectedRowData.id)
      Parameters.append(
        'NFCCardID',
        document.getElementById('NFCID').querySelector('input').value
      )
      Parameters.append('NFCCardExpire', this.CardExpire.Get())
      Parameters.append('Gates', this.Gates)

      api
        .post('AcceptNFCCardRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.NfcCardRequestModal.Hide()
            this.NfcCardRequestsTB.LoadMTable()
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
        .post('RejectNFCCardRequest', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data == 'تمت العملية بنجاح') {
            this.NfcCardRequestModal.Hide()
            this.NfcCardRequestRejectModal.Hide()
            this.NfcCardRequestsTB.LoadMTable()
          } else {
            ShowMessage(response.data)
          }
        })
        .catch(error => {
          HideLoading()
          ShowMessage(error)
        })
    },
    async NFCCardsDetection() {
      let Instance = this;
      /* eslint-disable */
      try {
        const ndef = new NDEFReader();
        await ndef.scan();

        ndef.addEventListener("reading", function ({ serialNumber }) {
          if (document.getElementById('NfcCardRequestModal').classList.contains('MModalActive')) {
            if (Instance.selectedRowData.request_status == 'قيد المراجعة' && Instance.selectedRowData.request_type == 'اضافة' && (Instance.UserData.user.department_id == 1 || (Instance.UserData.user.department_id == 3 && Instance.selectedRowData.department_id == 3))) {
              document.getElementById('NFCID').querySelector('input').value = serialNumber;
            }
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
              if (document.getElementById('NfcCardRequestModal').classList.contains('MModalActive')) {
                if (Instance.selectedRowData.request_status == 'قيد المراجعة' && Instance.selectedRowData.request_type == 'اضافة' && (Instance.UserData.user.department_id == 1 || (Instance.UserData.user.department_id == 3 && Instance.selectedRowData.department_id == 3))) {
                  document.getElementById('NFCID').querySelector('input').value = serialNumber;
                }
              }
            }
          });
        }, 1000);
      }
      /* eslint-enable */
    },
  },
}
</script>

<style scoped>
#NfcCardRequestsFromDate {
  max-width: 400px;
}

#RejectBTN {
  background-color: red;
}

#RejectBTN:hover {
  color: red;
  background-color: var(--MButtonBG);
}

#NfcCardRequestModal .Modal {
  max-width: 700px;
}

#GatesMGroup .MCheckBox {
  width: 50%;
}
</style>

<template>
  <div class="page-container">
    <!--========== Dialogs ==========-->
    <!-- Request Details Dialog -->
    <div v-if="RequestDetailsDialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <button class="close-btn" @click="RequestDetailsDialog = false">×</button>
          <h3>
            <span v-if="selectedRowData.request_type === 'اضافة'">طلب اضافة بطاقة</span>
            <span v-if="selectedRowData.request_type === 'ايقاف'">طلب ايقاف بطاقة {{ selectedRowData.name }}</span>
            <span v-if="selectedRowData.request_type === 'تفعيل'">طلب تفعيل بطاقة {{ selectedRowData.name }}</span>
            <span v-if="selectedRowData.request_type === 'تمديد'">طلب تمديد صلاحية بطاقة {{ selectedRowData.name }}</span>
          </h3>
        </div>
        <div class="dialog-body">
          <table class="details-table">
            <thead>
              <tr>
                <th>الحقل</th>
                <th>القيمة</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>الرقم</td><td>{{ selectedRowData.pid }}</td></tr>
              <tr><td>الاسم</td><td>{{ selectedRowData.name }}</td></tr>
              <tr><td>الصفة</td><td>{{ selectedRowData.person_type }}</td></tr>
              <tr v-if="selectedRowData.person_type === 'زائر' || selectedRowData.person_type === 'سائق'">
                <td>رقم الكفيل</td><td>{{ selectedRowData.guarantorid }}</td>
              </tr>
              <tr v-if="selectedRowData.person_type === 'زائر' || selectedRowData.person_type === 'سائق'">
                <td>اسم الكفيل</td><td>{{ selectedRowData.guarantorname }}</td>
              </tr>
              <tr v-if="selectedRowData.request_status === 'مرفوض'">
                <td>سبب الرفض</td><td>{{ selectedRowData.rejection_reason }}</td>
              </tr>
            </tbody>
          </table>
          <div class="dialog-inputs">
            <input
              v-model="NFCCardID"
              type="text"
              class="input"
              placeholder="رمز البطاقة"
              :disabled="selectedRowData.request_status !== 'قيد المراجعة' || selectedRowData.request_type !== 'اضافة'"
            />
            <input
              v-model="NFCCardExpire"
              type="date"
              class="input"
              placeholder="تاريخ الصلاحية"
              :disabled="selectedRowData.request_status !== 'قيد المراجعة'"
              v-if="selectedRowData.request_type === 'اضافة' || selectedRowData.request_type === 'تمديد'"
            />
            <div class="checkbox-group" v-if="selectedRowData.request_type === 'اضافة'">
              <label v-for="option in GatesOptions" :key="option.value">
                <input
                  type="checkbox"
                  :value="option.value"
                  v-model="Gates"
                  :disabled="selectedRowData.request_status !== 'قيد المراجعة'"
                />
                {{ option.label }}
              </label>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button
            v-if="hasPermission('entry_card_reject') && selectedRowData.request_status === 'قيد المراجعة'"
            class="btn btn-danger"
            @click="RejectionReasonDialog = true"
          >
            رفض الطلب
          </button>
          <button
            v-if="hasPermission('entry_card_accept') && selectedRowData.request_status === 'قيد المراجعة'"
            class="btn btn-primary"
            @click="AcceptRequest"
          >
            الموافقة على الطلب
          </button>
        </div>
      </div>
    </div>

    <!-- Rejection Reason Dialog -->
    <div v-if="RejectionReasonDialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <button class="close-btn" @click="RejectionReasonDialog = false">×</button>
          <h3>سبب رفض الطلب</h3>
        </div>
        <div class="dialog-body">
          <textarea
            v-model="RejectionReasonValue"
            class="textarea"
            placeholder="سبب الرفض"
          ></textarea>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-primary" @click="RejectRequest">موافق</button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الرقم</th>
            <th>الاسم</th>
            <th>الصفة</th>
            <th>العملية</th>
            <th>حالة الطلب</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in RequestsTableData" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.pid }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.person_type }}</td>
            <td>{{ row.request_type }}</td>
            <td>{{ row.request_status }}</td>
            <td>
              <button
                class="btn btn-info"
                v-if="hasPermission('entry_card_view')"
                @click="ShowRequestDetails(row.id)"
              >
                عرض
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { api } from '../../axios';
import { useAuthStore } from '../../stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    const hasPermission = (permission) =>
      authStore.user && authStore.user.permissions.includes(permission);

    const RequestsTableData = ref([]);
    const RequestDetailsDialog = ref(false);
    const RejectionReasonDialog = ref(false);
    const selectedRowData = ref(null);
    const RejectionReasonValue = ref('');
    const NFCCardID = ref('');
    const NFCCardExpire = ref('');
    const Gates = ref([]);
    const GatesOptions = [
      { label: 'الامل 1 - البوابة 1', value: 'الامل 1-البوابة 1' },
      { label: 'الامل 1 - البوابة 2', value: 'الامل 1-البوابة 2' },
      { label: 'النسيم - البوابة 1', value: 'النسيم-البوابة 1' },
      { label: 'النسيم - البوابة 2', value: 'النسيم-البوابة 2' },
    ];

    const GetRequestsData = () => {
      api.get('/GetNFCCardRequests').then((response) => {
        RequestsTableData.value = response.data.data;
      });
    };

    const ShowRequestDetails = (id) => {
      selectedRowData.value = RequestsTableData.value.find((row) => row.id === id);
      RequestDetailsDialog.value = true;
    };

    const AcceptRequest = () => {
      const params = {
        RequestID: selectedRowData.value.id,
        NFCCardID: NFCCardID.value,
        NFCCardExpire: NFCCardExpire.value,
        Gates: Gates.value.join('|'),
      };
      api.post('/AcceptNFCCardRequest', params).then(() => {
        RequestDetailsDialog.value = false;
        GetRequestsData();
      });
    };

    const RejectRequest = () => {
      const params = {
        RequestID: selectedRowData.value.id,
        Reason: RejectionReasonValue.value,
      };
      api.post('/RejectNFCCardRequest', params).then(() => {
        RejectionReasonDialog.value = false;
        GetRequestsData();
      });
    };

    return {
      hasPermission,
      RequestsTableData,
      RequestDetailsDialog,
      RejectionReasonDialog,
      selectedRowData,
      RejectionReasonValue,
      NFCCardID,
      NFCCardExpire,
      Gates,
      GatesOptions,
      GetRequestsData,
      ShowRequestDetails,
      AcceptRequest,
      RejectRequest,
    };
  },
  mounted() {
    this.GetRequestsData();
  },
};
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.data-table th, .data-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
}
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.dialog-header h3 {
  margin: 0;
}
.dialog-body {
  margin-bottom: 20px;
}
.input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-info {
  background-color: #17a2b8;
  color: white;
}
</style>

<template>
  <div class="ComponentWrapper">
    <div class="form-page">
      <!-- Request Details Dialog -->
      <div v-if="RequestDetailsDialog" class="dialog">
        <div class="dialog-content">
          <div class="dialog-header">
            <button class="dialog-close-btn" @click="RequestDetailsDialog = false">×</button>
            <h3 class="dialog-title">
              <span v-if="selectedRowData.person_type === 'مالك' && selectedRowData.request_type === 'اضافة'">
                طلب اضافة مالك
              </span>
              <span v-if="selectedRowData.person_type === 'مالك' && selectedRowData.request_type === 'تعديل'">
                طلب تعديل المالك {{ selectedRowData.old_name }}
              </span>
              <span v-if="selectedRowData.person_type === 'مالك' && selectedRowData.request_type === 'حذف'">
                طلب حذف المالك {{ selectedRowData.name }}
              </span>
            </h3>
          </div>
          <div class="dialog-body">
            <table class="details-table" v-if="selectedRowData.person_type === 'مالك'">
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
                  <td>الجنس</td>
                  <td>{{ selectedRowData.gender }}</td>
                </tr>
                <tr>
                  <td>المواليد</td>
                  <td>{{ selectedRowData.birth }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dialog-footer">
            <button class="btn btn-primary" v-if="hasPermission('info_accept')" @click="AcceptRequest()">
              الموافقة على الطلب
            </button>
            <button class="btn btn-danger" v-if="hasPermission('info_reject')" @click="RejectionReasonDialog = true">
              رفض الطلب
            </button>
          </div>
        </div>
      </div>

      <!-- Rejection Reason Dialog -->
      <div v-if="RejectionReasonDialog" class="dialog">
        <div class="dialog-content">
          <div class="dialog-header">
            <button class="dialog-close-btn" @click="RejectionReasonDialog = false">×</button>
            <h3 class="dialog-title">سبب رفض الطلب</h3>
          </div>
          <div class="dialog-body">
            <textarea v-model="RejectionReasonValue" placeholder="سبب الرفض" class="input-field"></textarea>
          </div>
          <div class="dialog-footer">
            <button class="btn btn-primary" @click="RejectRequest()">موافق</button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>المدينة</th>
              <th>العنوان</th>
              <th>رقم الهاتف</th>
              <th>الصفة</th>
              <th>العملية</th>
              <th>حالة الطلب</th>
              <th>الاجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in RequestsTableData" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.compound }}</td>
              <td>{{ row.address }}</td>
              <td>{{ row.phone }}</td>
              <td>{{ row.person_type }}</td>
              <td>{{ row.request_type }}</td>
              <td>{{ row.request_status }}</td>
              <td>
                <button class="btn btn-info" @click="ShowRequestDetails(row.id)">عرض</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { api } from '../../axios';
import { useAuthStore } from '../../stores/auth';
import { useGlobalsStore } from '../../stores/Globals.js';
import MTable from '../../components/MTable.vue';
import { ShowMessage, HideModal, ShowChooseModal } from '@/MJS.js';

export default {
  components: {
    MTable,
  },
  setup() {
    const authStore = useAuthStore();

    const hasPermission = (permission) => {
      return authStore.user && authStore.user.permissions.includes(permission);
    };

    const RequestsTableData = ref([]);
    const RequestDetailsDialog = ref(false);
    const RejectionReasonDialog = ref(false);
    const selectedRowData = ref({});
    const RejectionReasonValue = ref('');
    const TableLoading = ref(false);

    const GetRequestsData = () => {
      TableLoading.value = true;
      api.get('/GetInformationRequests')
        .then((response) => {
          RequestsTableData.value = response.data.data;
          TableLoading.value = false;
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          TableLoading.value = false;
        });
    };

    const ShowRequestDetails = (id) => {
      selectedRowData.value = RequestsTableData.value.find((row) => row.id === id);
      RequestDetailsDialog.value = true;
    };

    const AcceptRequest = () => {
      api.post('/AcceptInformationRequest', { id: selectedRowData.value.id })
        .then(() => {
          GetRequestsData();
          RequestDetailsDialog.value = false;
        })
        .catch((error) => ShowMessage('Error accepting request:', error));
    };

    const RejectRequest = () => {
      api.post('/RejectInformationRequest', {
        id: selectedRowData.value.id,
        reason: RejectionReasonValue.value,
      })
        .then(() => {
          GetRequestsData();
          RejectionReasonDialog.value = false;
        })
        .catch((error) => console.error('Error rejecting request:', error));
    };

    return {
      RequestsTableData,
      RequestDetailsDialog,
      RejectionReasonDialog,
      selectedRowData,
      RejectionReasonValue,
      TableLoading,
      GetRequestsData,
      ShowRequestDetails,
      AcceptRequest,
      RejectRequest,
      hasPermission,
    };
  },

  mounted() {
    this.GetRequestsData();
  },
};
</script>



<style scoped>
.form-page {
  padding: 20px;
}

.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.data-table th,
.data-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dialog-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.dialog-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
}

.dialog-body {
  margin-bottom: 10px;
}

.dialog-footer {
  text-align: center;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-info {
  background-color: #17a2b8;
  color: #fff;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}
</style>

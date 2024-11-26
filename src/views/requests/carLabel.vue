<template>
  <div class="form-page">
    <!--========== Dialogs ==========-->
    <div v-if="RequestDetailsDialog" class="dialog">
      <div class="dialog-content">
        <!--========== The Header ==========-->
        <div class="dialog-header">
          <button class="dialog-close-btn" @click="RequestDetailsDialog = false">×</button>
          <h3 class="dialog-title">
            <span v-if="selectedRowData.request_type === 'اضافة'">طلب اضافة ملصق</span>
            <span v-if="selectedRowData.request_type === 'ايقاف'">طلب ايقاف ملصق {{ selectedRowData.name }}</span>
            <span v-if="selectedRowData.request_type === 'تفعيل'">طلب تفعيل ملصق {{ selectedRowData.name }}</span>
            <span v-if="selectedRowData.request_type === 'تمديد'">طلب تمديد صلاحية ملصق {{ selectedRowData.name }}</span>
          </h3>
        </div>

        <!--========== The Content ==========-->
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
              <tr><td>المدينة</td><td>{{ selectedRowData.compound }}</td></tr>
              <tr><td>العنوان</td><td>{{ selectedRowData.address }}</td></tr>
              <tr><td>رقم العجلة</td><td>{{ selectedRowData.car_no }}</td></tr>
              <tr><td>تفاصيل العجلة</td><td>{{ selectedRowData.car_details }}</td></tr>
              <tr><td>رقم الهاتف</td><td>{{ selectedRowData.phone }}</td></tr>
              <tr><td>الصفة</td><td>{{ selectedRowData.person_type }}</td></tr>
              <tr v-if="selectedRowData.request_status === 'مرفوض'">
                <td>سبب الرفض</td>
                <td>{{ selectedRowData.rejection_reason }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Dialog Inputs -->
          <div class="dialog-inputs">
            <input
              type="text"
              class="input-field"
              :disabled="selectedRowData.request_status !== 'قيد المراجعة' || selectedRowData.request_type !== 'اضافة'"
              v-model="LabelCode"
              placeholder="رمز الملصق"
            />
            <input
              type="date"
              class="input-field"
              :disabled="selectedRowData.request_status !== 'قيد المراجعة'"
              v-model="LabelIssue"
              v-if="selectedRowData.request_type === 'اضافة'"
            />
            <input
              type="date"
              class="input-field"
              :disabled="selectedRowData.request_status !== 'قيد المراجعة'"
              v-model="LabelExpire"
              v-if="selectedRowData.request_type === 'اضافة' || selectedRowData.request_type === 'تمديد'"
            />
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="dialog-footer">
          <button
            v-if="hasPermission('car_label_reject') && selectedRowData.request_status === 'قيد المراجعة'"
            class="btn btn-danger"
            @click="RejectionReasonDialog = true"
          >
            رفض الطلب
          </button>
          <button
            v-if="hasPermission('car_label_accept') && selectedRowData.request_status === 'قيد المراجعة'"
            class="btn btn-primary"
            @click="AcceptRequest"
          >
            الموافقة على الطلب
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
          <textarea class="input-field" v-model="RejectionReasonValue" placeholder="سبب الرفض"></textarea>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-primary" @click="RejectRequest">موافق</button>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الرقم</th>
            <th>الاسم</th>
            <th>المدينة</th>
            <th>العنوان</th>
            <th>الهاتف</th>
            <th>الصفة</th>
            <th>العملية</th>
            <th>حالة الطلب</th>
            <th>الاجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in RequestsTableData" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.pid }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.compound }}</td>
            <td>{{ row.address }}</td>
            <td>{{ row.phone }}</td>
            <td>{{ row.person_type }}</td>
            <td>{{ row.request_type }}</td>
            <td>{{ row.request_status }}</td>
            <td>
              <button
                v-if="hasPermission('car_label_view')"
                class="btn btn-info"
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

    const hasPermission = (permission) => {
      return authStore.user && authStore.user.permissions.includes(permission);
    };

    const RequestsTableData = ref([]);
    const RequestDetailsDialog = ref(false);
    const RejectionReasonDialog = ref(false);
    const selectedRowData = ref(null);
    const RejectionReasonValue = ref('');
    const LabelCode = ref('');
    const LabelIssue = ref('');
    const LabelExpire = ref('');
    const TableLoading = ref(false);

    const GetRequestsData = () => {
      TableLoading.value = true;
      api.get('/GetCarsLabelRequests').then((response) => {
        RequestsTableData.value = response.data.data;
        TableLoading.value = false;
      }).catch((error) => {
        console.error('Error fetching data:', error);
        TableLoading.value = false;
      });
    };

    const ShowRequestDetails = (id) => {
      selectedRowData.value = RequestsTableData.value.find((row) => row.id === id);
      RequestDetailsDialog.value = true;
    };

    const AcceptRequest = () => {
      const params = {
        RequestID: selectedRowData.value.id,
        LabelCode: LabelCode.value,
        LabelIssue: LabelIssue.value,
        LabelExpire: LabelExpire.value,
      };
      api.post('/AcceptCarsLabelRequest', params).then(() => {
        GetRequestsData();
        RequestDetailsDialog.value = false;
      }).catch((error) => console.error('Error accepting request:', error));
    };

    const RejectRequest = () => {
      const params = { RequestID: selectedRowData.value.id, Reason: RejectionReasonValue.value };
      api.post('/RejectCarsLabelRequest', params).then(() => {
        GetRequestsData();
        RejectionReasonDialog.value = false;
      }).catch((error) => console.error('Error rejecting request:', error));
    };

    return {
      hasPermission,
      RequestsTableData,
      RequestDetailsDialog,
      RejectionReasonDialog,
      selectedRowData,
      RejectionReasonValue,
      LabelCode,
      LabelIssue,
      LabelExpire,
      TableLoading,
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
.form-page {
  padding: 20px;
}

.table-container {
  margin-top: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.data-table th, .data-table td {
  padding: 8px;
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
</style>

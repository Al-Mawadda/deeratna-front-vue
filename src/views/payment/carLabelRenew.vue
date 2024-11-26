<template>
  <div class="page-container">
    <!-- Request Details Dialog -->
    <div v-if="RequestDetailsDialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <button class="close-btn" @click="RequestDetailsDialog = false">×</button>
          <h3>معلومات الدفع</h3>
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
              <tr><td>المجمع</td><td>{{ selectedRowData.compound }}</td></tr>
              <tr><td>العنوان</td><td>{{ selectedRowData.address }}</td></tr>
              <tr><td>الخدمة</td><td>{{ selectedRowData.payment_name }}</td></tr>
              <tr><td>المبلغ</td><td>{{ selectedRowData.payment_amount }}</td></tr>
              <tr><td>اسم المستخدم</td><td>{{ selectedRowData.cus.username }}</td></tr>
              <tr><td>رقم الهاتف</td><td>{{ selectedRowData.cus.phone }}</td></tr>
              <tr><td>الية الدفع</td><td>{{ selectedRowData.payment_method }}</td></tr>
              <tr><td>معرف المعاملة</td><td>{{ selectedRowData.transaction_id }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>المجمع</th>
            <th>العنوان</th>
            <th>الخدمة</th>
            <th>المبلغ</th>
            <th>اسم المستخدم</th>
            <th>رقم الهاتف</th>
            <th>الية الدفع</th>
            <th>معرف المعاملة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in RequestsTableData" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.compound }}</td>
            <td>{{ row.address }}</td>
            <td>{{ row.payment_name }}</td>
            <td>{{ row.payment_amount }}</td>
            <td>{{ row.cus.username }}</td>
            <td>{{ row.cus.phone }}</td>
            <td>{{ row.payment_method }}</td>
            <td>{{ row.transaction_id }}</td>
            <td>
              <button
                class="btn btn-info"
                v-if="hasPermission('on_pay_ser')"
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
    const selectedRowData = ref({});
    const TableLoading = ref(false);

    const GetRequestsData = async () => {
      TableLoading.value = true;
      try {
        const response = await api.get('/payment-type/Car Label Renew', {
          params: {
            page: 1, // Assuming static pagination for now
            per_page: 9999999,
          },
        });

        if (response.data.success) {
          RequestsTableData.value = response.data.data.map((item) => {
            const addressInfo = item.transaction_information.find(
              (info) => info.name === 'address'
            );
            const compoundInfo = item.transaction_information.find(
              (info) => info.name === 'compound'
            );
            return {
              ...item,
              address: addressInfo ? addressInfo.value : 'N/A',
              compound: compoundInfo ? compoundInfo.value : 'N/A',
            };
          });
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        TableLoading.value = false;
      }
    };

    const ShowRequestDetails = (id) => {
      const row = RequestsTableData.value.find((item) => item.id === id);

      if (row) {
        const addressInfo = row.transaction_information.find((info) => info.name === 'address');
        const compoundInfo = row.transaction_information.find((info) => info.name === 'compound');
        selectedRowData.value = {
          ...row,
          address: addressInfo ? addressInfo.value : 'N/A',
          compound: compoundInfo ? compoundInfo.value : 'N/A',
        };
        RequestDetailsDialog.value = true;
      }
    };

    return {
      hasPermission,
      RequestsTableData,
      RequestDetailsDialog,
      selectedRowData,
      TableLoading,
      GetRequestsData,
      ShowRequestDetails,
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
  margin: 20px 0;
}
.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: 10px;
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
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
.details-table {
  width: 100%;
  border-collapse: collapse;
}
.details-table th,
.details-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-info {
  background-color: #007bff;
  color: white;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>


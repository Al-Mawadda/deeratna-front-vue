<template>
  <div class="page-container">
    <!-- Request Details Dialog -->
    <q-dialog v-model="RequestDetailsDialog" class="dialog">
      <q-card>
        <!-- Dialog Header -->
        <q-card-section class="dialog-header">
          <div>
            <q-btn flat dense icon="close" @click="RequestDetailsDialog = false" />
            <span>معلومات الدفع</span>
          </div>
        </q-card-section>

        <!-- Dialog Content -->
        <q-card-section>
          <table class="details-table">
            <thead>
              <tr>
                <th>الحقل</th>
                <th>القيمة</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in detailFields" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Main Table -->
    <div>
      <q-grid
        :loading="TableLoading"
        :data="RequestsTableData"
        :columns="RequestsTableColumns"
        :columns_filter="true"
        :draggable="true"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="column in RequestsTableColumns" :key="column.name">
              {{ getColumnValue(props.row, column) }}
            </q-td>
            <q-td>
              <q-btn
                flat
                color="primary"
                dense
                icon="info"
                v-if="hasPermission('on_pay_ser')"
                @click="ShowRequestDetails(props.row.id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-grid>
    </div>
  </div>
</template>


<script>
import { ref, computed } from "vue";
import { api } from '../../axios';
import { useAuthStore } from '../../stores/auth'; 

export default {
  setup() {
    const authStore = useAuthStore();

    const RequestsTableData = ref([]);
    const RequestsTableColumns = ref([
      { name: "id", label: "#", align: "center", field: "id", sortable: true },
      { name: "compound", label: "المجمع", align: "center", field: "compound", sortable: true },
      { name: "address", label: "العنوان", align: "center", field: "address", sortable: true },
      { name: "payment_name", label: "الخدمة", align: "center", field: "payment_name", sortable: true },
      { name: "payment_amount", label: "المبلغ", align: "center", field: "payment_amount", sortable: true },
      { name: "username", label: "اسم المستخدم", align: "center", field: "cus.username", sortable: true },
      { name: "phone", label: "رقم الهاتف", align: "center", field: "cus.phone", sortable: true },
      { name: "payment_method", label: "الية الدفع", align: "center", field: "payment_method", sortable: true },
      { name: "transaction_id", label: "معرف المعاملة", align: "center", field: "transaction_id", sortable: true },
    ]);

    const RequestDetailsDialog = ref(false);
    const selectedRowData = ref(null);
    const TableLoading = ref(false);

    const hasPermission = (permission) =>
      authStore.user && authStore.user.permissions.includes(permission);

    const detailFields = computed(() => {
      if (!selectedRowData.value) return {};
      return {
        المجمع: selectedRowData.value.compound || "N/A",
        العنوان: selectedRowData.value.address || "N/A",
        الخدمة: selectedRowData.value.payment_name || "N/A",
        المبلغ: selectedRowData.value.payment_amount || "N/A",
        "اسم المستخدم": selectedRowData.value.cus?.username || "N/A",
        "رقم الهاتف": selectedRowData.value.cus?.phone || "N/A",
        "الية الدفع": selectedRowData.value.payment_method || "N/A",
        "معرف المعاملة": selectedRowData.value.transaction_id || "N/A",
      };
    });

    const getColumnValue = (row, column) => {
      if (typeof column.field === "function") {
        return column.field(row);
      }
      if (column.field.includes(".")) {
        return column.field.split(".").reduce((acc, key) => acc[key] || "N/A", row);
      }
      return row[column.field] || "N/A";
    };

    const GetRequestsData = async () => {
      TableLoading.value = true;
      try {
        const { data } = await api.get("/payment-type/services", {
          params: { page: 1, per_page: 9999999 },
        });
        if (data.success) {
          RequestsTableData.value = data.data.map((item) => ({
            ...item,
            address: item.transaction_information.find((info) => info.name === "address")?.value || "N/A",
            compound: item.transaction_information.find((info) => info.name === "compound")?.value || "N/A",
          }));
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch requests data:", error);
      } finally {
        TableLoading.value = false;
      }
    };

    const ShowRequestDetails = (id) => {
      const row = RequestsTableData.value.find((item) => item.id === id);
      if (row) {
        selectedRowData.value = row;
        RequestDetailsDialog.value = true;
      }
    };

    return {
      hasPermission,
      RequestsTableData,
      RequestsTableColumns,
      RequestDetailsDialog,
      detailFields,
      TableLoading,
      GetRequestsData,
      ShowRequestDetails,
      getColumnValue,
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
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.details-table {
  width: 100%;
  border-collapse: collapse;
}
.details-table th,
.details-table td {
  border: 1px solid #ddd;
  padding: 10px;
}
.details-table th {
  background-color: #f4f4f4;
}
</style>

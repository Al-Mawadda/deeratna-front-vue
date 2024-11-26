<template>
  <div class="form-page">
    <div class="form-card">
      <!-- Title Section -->
      <div class="form-title">
        <h5>فيديوات المدن</h5>
      </div>

      <!-- Form Section -->
      <div v-if="hasPermission('ads_video_create')" class="form-section">
        <form @submit.prevent="postSliderAd" class="form">
          <div class="form-group">
            <label for="name">اسم الفيديو</label>
            <input
              v-model="formData.name"
              id="name"
              type="text"
              placeholder="Enter Name"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="compound">المجمع</label>
            <input
              v-model="formData.compound"
              id="compound"
              type="text"
              placeholder="Enter Compound"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="image">الفيديو</label>
            <input
              v-v-on:change="formData.image"
              id="image"
              type="file"
              class="form-control"
            />
          </div>
          <div class="form-submit">
            <button type="submit" class="btn btn-primary">ارسال</button>
          </div>
        </form>
      </div>

      <!-- Table Section -->
      <div class="table-section">
        <hr />
        <div v-if="hasPermission('ads_video_view')">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>اسم الفيديو</th>
                <th>المجمع</th>
                <th>الفيديو</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.id">
                <td>{{ row.name }}</td>
                <td>{{ row.compound }}</td>
                <td>
                  <video :src="row.video" controls style="width: 200px; height: 180px;"></video>
                </td>
                <td>
                  <button
                    v-if="hasPermission('ads_video_delete')"
                    class="btn btn-danger"
                    @click="deleteRow(row)"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { api } from '../../axios';
import { useAuthStore } from '../../stores/auth'; 

export default {
  name: 'PostSliderAd',
  setup() {
    const authStore = useAuthStore();

    // Check permission
    const hasPermission = (permission) => {
      return authStore.user && authStore.user.permissions.includes(permission);
    };

    // Form data
    const formData = ref({
      name: '',
      compound: '',
      image: null,
    });

    // Table data
    const tableData = ref([]);

    // Fetch table data
    const fetchTableData = async () => {
      try {
        const response = await api.get('/main-slider-ads-get'); // Replace with your API endpoint
        if (response.data.success) {
          tableData.value = response.data.data.map((item) => ({
            id: item.id,
            name: item.name,
            compound: item.compound,
            video: item.images.length > 0 ? item.images[0].path : null,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch slider ads.', error);
      }
    };

    // Post new slider ad
    const postSliderAd = async () => {
      try {
        const formDataObj = new FormData();
        formDataObj.append('name', formData.value.name);
        formDataObj.append('compound', formData.value.compound);
        if (formData.value.image) {
          formDataObj.append('image', formData.value.image);
        }

        await api.post('/main-slider-ads-post', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        fetchTableData();

        formData.value = { name: '', compound: '', image: null };
      } catch (error) {
        console.error('Failed to post slider ad.', error);
      }
    };

    // Delete a row
    const deleteRow = async (row) => {
      try {
        await api.delete(`/main-slider-ads-delete/${row.id}`);
        fetchTableData();
      } catch (error) {
        console.error('Failed to delete slider ad.', error);
      }
    };

    // Fetch data on mounted
    onMounted(fetchTableData);

    return {
      hasPermission,
      formData,
      tableData,
      postSliderAd,
      deleteRow,
    };
  },
};
</script>
<style scoped>
.form-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.form-card {
  max-width: 600px;
  width: 100%;
  padding: 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-control {
  width: 100%;
  padding: 8px;
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
  color: #fff;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.table-section {
  margin-top: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

table th {
  background-color: #f4f4f4;
}
</style>

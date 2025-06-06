<template>
  <div class="ComponentWrapper">
    <div v-if="hasPermission('ads_ser_view')" class="MGroup">
      <form @submit.prevent="postSliderAd" class="MGroup">
        <div class="MField">
          <input v-model="formData.name" type="text" id="name" required />
          <label>اسم الفيديو</label>
          <div class="MFieldBG"></div>
        </div>

        <div class="MButton">
          <label for="image"
            >تحميل الفديو
            <input
              v-on:change="formData.image"
              id="image"
              @change="handleFileUpload"
              type="file"
              class="form-control"
            />
          </label>
        </div>
        <div>
          <button class="MButton" type="submit">ارسال</button>
        </div>
      </form>
      <!-- Table Section -->

      <table v-if="hasPermission('ads_main_view')" class="table table-bordered">
        <thead>
          <tr>
            <th>اسم الاعلان</th>
            <th>الصورة</th>
            <th>الاجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td>{{ row.name }}</td>
            <td>
              <div v-if="row.images[0]?.path">
                <video
                  :src="row.images[0]?.path"
                  controls
                  style="width: 100px; height: auto"
                ></video>
              </div>
            </td>
            <td>
              <button
                v-if="hasPermission('ads_main_delete')"
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
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { ShowLoading, HideLoading } from '@/MJS.js'

export default {
  name: 'PostSliderAd',
  setup() {
    const authStore = useAuthStore()

    // Check permission
    const hasPermission = permission => {
      return authStore.user && authStore.user.permissions.includes(permission)
    }

    // Form data
    const formData = ref({
      name: '',
      image: null,
    })

    // Handle file upload
    const handleFileUpload = event => {
      formData.value.image = event.target.files[0]
      event.target.value = ''
    }

    // Table data
    const tableData = ref([])

    // Fetch table data
    const fetchTableData = async () => {
      try {
        const response = await api.get('ads-get/secondVideo')
        if (response.data.success) {
          tableData.value = response.data.data
        }
      } catch (error) {
        console.error('Failed to fetch ads.', error)
      }
    }

    // Post new ad
    const postSliderAd = async () => {
      ShowLoading()
      try {
        const formDataObj = new FormData()
        formDataObj.append('name', formData.value.name)
        formDataObj.append('type', 'secondVideo')
        if (formData.value.image) {
          formDataObj.append('image', formData.value.image)
        }

        await api.post('/ads-post', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        fetchTableData()
        HideLoading()
        formData.value = { name: '', image: null }
      } catch (error) {
        HideLoading()
        console.error('Failed to post ad.', error)
      }
    }

    // Delete an ad
    const deleteRow = async row => {
      ShowLoading()
      try {
        await api.delete(`ads-delete/${row.id}`)
        fetchTableData()
        HideLoading()
      } catch (error) {
        HideLoading()
        console.error('Failed to delete ad.', error)
      }
    }

    // Fetch data on mounted
    onMounted(fetchTableData)

    return {
      hasPermission,
      formData,
      tableData,
      handleFileUpload,
      postSliderAd,
      deleteRow,
    }
  },
}
</script>

<style scoped>
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

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}
</style>

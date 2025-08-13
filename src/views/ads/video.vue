<template>
  <div class="ComponentWrapper">
    <div v-if="GlobalsStore.CheckPermissions('compounds_ads_videos_add')" class="MGroup">
      <form @submit.prevent="postSliderAd" class="MGroup">
        <div class="MField" id="name">
          <input v-model="formData.name" type="text" required />
          <label>اسم الفيديو</label>
          <div class="MFieldBG"></div>
        </div>

        <div class="MField" id="compound">
          <input v-model="formData.compound" type="text" required />
          <label>اسم المجمع</label>
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

      <table
        v-if="GlobalsStore.CheckPermissions('compounds_ads_videos')"
        class="table table-bordered"
      >
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
              <video
                :src="row.video"
                controls
                style="width: 200px; height: 180px"
              ></video>
            </td>
            <td>
              <button
                v-if="GlobalsStore.CheckPermissions('compounds_ads_videos_delete')"
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

    <!-- Form Section -->
    <div v-if="GlobalsStore.CheckPermissions('compounds_ads_videos_add')" class="form-section"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from '../../axios'
import { ShowLoading, HideLoading } from '@/MJS.js'
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  name: 'PostSliderAd',
  setup() {
    const GlobalsStore = ref(useGlobalsStore())
    const formData = ref({
      name: '',
      compound: '',
      image: null,
    })

    // Table data
    const tableData = ref([])

    // Fetch table data
    const fetchTableData = async () => {
      try {
        const response = await api.get('/main-slider-ads-get') // Replace with your API endpoint
        if (response.data.success) {
          tableData.value = response.data.data.map(item => ({
            id: item.id,
            name: item.name,
            compound: item.compound,
            video: item.images.length > 0 ? item.images[0].path : null,
          }))
        }
      } catch (error) {
        console.error('Failed to fetch slider ads.', error)
      }
    }

    // Post new slider ad
    const postSliderAd = async () => {
      ShowLoading()
      try {
        const formDataObj = new FormData()
        formDataObj.append('name', formData.value.name)
        formDataObj.append('compound', formData.value.compound)
        //console.log(formData.value.image)
        if (formData.value.image) {
          formDataObj.append('image', formData.value.image)
        }

        await api.post('/main-slider-ads-post', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        fetchTableData()
        HideLoading()

        formData.value = { name: '', compound: '', image: null }
      } catch (error) {
        HideLoading()
        console.error('Failed to post slider ad.', error)
      }
    }

    // Delete a row
    const deleteRow = async row => {
      ShowLoading()
      try {
        await api.delete(`/main-slider-ads-delete/${row.id}`)
        fetchTableData()
        HideLoading()
      } catch (error) {
        HideLoading()
        console.error('Failed to delete slider ad.', error)
      }
    }
    // Handle file upload
    const handleFileUpload = event => {
      formData.value.image = event.target.files[0]
      event.target.value = ''
    }
    // Fetch data on mounted
    onMounted(fetchTableData)

    return {
      GlobalsStore,
      handleFileUpload,
      formData,
      tableData,
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

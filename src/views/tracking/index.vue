<template>

  <div class="tracking-page">
    <form @submit.prevent="handleSubmit" class="tracking-form" style="padding-top: 117px;">

      <div>
        <label>Name:</label>
        <input v-model="form.name" required />
      </div>
      <div>
        <label>Address:</label>
        <input v-model="form.address" required />
      </div>
      <div>
        <label>City:</label>
        <input v-model="form.city" required />
      </div>
      <div>
        <label>Phone:</label>
        <input v-model="form.phone" required />
      </div>
      <div>
        <label>Resedance:</label>
        <input v-model="form.resedance" required />
      </div>
      <div>
        <label>Notes:</label>
        <input v-model="form.notes" />
      </div>
      <button type="submit">Add Entry</button>
    </form>

    <table class="tracking-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>City</th>
          <th>Phone</th>
          <th>Resedance</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.id">
          <td>{{ entry.name }}</td>
          <td>{{ entry.address }}</td>
          <td>{{ entry.city }}</td>
          <td>{{ entry.phone }}</td>
          <td>{{ entry.resedance }}</td>
          <td>{{ entry.notes }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const form = ref({
  name: '',
  address: '',
  city: '',
  phone: '',
  resedance: '',
  notes: ''
})

const entries = ref([])

const fetchEntries = async () => {
  try {
    const res = await axios.get('/api/tracking')
    entries.value = res.data
  } catch (e) {

  }
}

const handleSubmit = async () => {
  try {
    await axios.post('/api/tracking', form.value)
    await fetchEntries()
    form.value = {
      name: '',
      address: '',
      city: '',
      phone: '',
      resedance: '',
      notes: ''
    }
  } catch (e) {
    // handle error
  }
}

onMounted(fetchEntries)
</script>

<style scoped>
.tracking-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
.tracking-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
.tracking-form > div {
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
}
.tracking-table {
  width: 100%;
  border-collapse: collapse;
}
.tracking-table th, .tracking-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>

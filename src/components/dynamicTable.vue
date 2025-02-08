<template>
  <div class="table-container">
    <!-- Global Search -->
    <input
      v-model="globalSearch"
      @input="onSearch"
      placeholder="Global Search..."
      class="global-search"
    />

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.key">
            {{ header.label }}
            <div>
              <input
                v-model="columnSearch[header.key]"
                @input="onSearch"
                :placeholder="`Search ${header.label}`"
                class="column-search"
              />
            </div>
          </th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="header in headers" :key="header.key">
            {{ row[header.key] }}
          </td>
          <td>
            <button @click="editRow(row)">Edit</button>
            <button @click="deleteRow(row)">Delete</button>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="headers.length + 1">No Data Found</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }}</span>
      <button @click="nextPage" :disabled="!hasMoreData">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Props
const props = defineProps({
  headers: { type: Array, required: true },
  data: { type: Array, required: true },
  fetchData: { type: Function, required: true },
  edit: { type: Function, required: true },
  delete: { type: Function, required: true },
});

// Reactive variables
const globalSearch = ref("");
const columnSearch = ref({});
const currentPage = ref(1);
const hasMoreData = ref(true);

// Fetch Data on Search or Pagination
const onSearch = () => {
  currentPage.value = 1;
  loadData();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadData();
  }
};

const nextPage = () => {
  currentPage.value++;
  loadData();
};

const loadData = async () => {
  const filters = {
    global: globalSearch.value,
    column: columnSearch.value,
    page: currentPage.value,
  };

  const response = await props.fetchData(filters);
  hasMoreData.value = response.hasMore;
};

// Edit/Delete Functions
const editRow = (row) => props.edit(row);
const deleteRow = (row) => props.delete(row);

// Initial Data Fetch
loadData();
</script>

<style scoped>
.table-container {
  width: 100%;
  margin: auto;
}

.global-search,
.column-search {
  margin-bottom: 5px;
  padding: 5px;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div class="p-4 space-y-4">

    <!-- Column Toggle -->
    <div class="flex gap-4 items-center flex-wrap">
      <span class="font-semibold">Show Columns:</span>
      <label v-for="col in allColumns" :key="col.key" class="flex items-center gap-1">
        <input type="checkbox" v-model="visibleColumns" :value="col.key" />
        {{ col.label }}
      </label>
    </div>

    <!-- Search -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="border rounded px-2 py-1 flex-1 min-w-[200px]"
      />

      <!-- Rows per page -->
      <div class="flex items-center gap-2">
        <span>Rows per page:</span>
        <select v-model.number="rowsPerPage" class="border rounded px-2 py-1">
          <option v-for="n in [5,10,20]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <table class="min-w-full border border-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="col in displayedColumns"
            :key="col.key"
            class="px-4 py-2 border-b text-left"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
          <td v-for="col in displayedColumns" :key="col.key" class="px-4 py-2 border-b">
            <!-- Inline Editing -->
            <div v-if="editingCell.row === item.id && editingCell.col === col.key">
              <input
                v-model="item[col.key]"
                @blur="stopEditing"
                @keyup.enter="stopEditing"
                class="border px-1 py-0.5 w-full"
                autofocus
              />
            </div>
            <div
              v-else
              @dblclick="startEditing(item.id, col.key)"
              class="cursor-pointer"
            >
              {{ item[col.key] }}
            </div>
          </td>
        </tr>
        <tr v-if="filteredData.length === 0">
          <td :colspan="displayedColumns.length" class="text-center py-4">
            No data found
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4 flex-wrap gap-2">
      <div>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'

// Data
const data = ref([])
const currentPage = ref(1)
const rowsPerPage = ref(5)
const searchQuery = ref('')

// Editing state
const editingCell = ref({ row: null, col: null })

// Columns
const allColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'body', label: 'Body' },
]
const visibleColumns = ref(allColumns.map(c => c.key))
const displayedColumns = computed(() =>
  allColumns.filter(col => visibleColumns.value.includes(col.key))
)

// Fetch API
const fetchData = async () => {
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
    data.value = res.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
})

// Filtering with debounce for better performance
const filteredData = computed(() => {
  if (!searchQuery.value) return data.value
  const query = searchQuery.value.toLowerCase()
  return data.value.filter(item =>
    displayedColumns.value.some(col =>
      String(item[col.key]).toLowerCase().includes(query)
    )
  )
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredData.value.length / rowsPerPage.value))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredData.value.slice(start, start + rowsPerPage.value)
})

// Reset page when filtered or rowsPerPage change
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
})

// Editing functions
const startEditing = (rowId, colKey) => {
  editingCell.value = { row: rowId, col: colKey }
}

const stopEditing = () => {
  editingCell.value = { row: null, col: null }
}
</script>

<style scoped>
/* Hover effect */
tbody tr:hover {
  background-color: #f9fafb;
}
</style>

<template>
  <div class="p-6 bg-gray-900 text-white shadow-lg rounded-lg space-y-6">

    <!-- Column Toggle -->
    <div class="flex gap-6 items-center flex-wrap">
      <span class="font-semibold text-lg text-gray-200">Show Columns:</span>
      <label
        v-for="col in columns"
        :key="col.key"
        class="flex items-center gap-2 text-gray-400"
      >
        <input type="checkbox" v-model="visibleColumns" :value="col.key" class="rounded border-gray-700" />
        <span class="text-sm">{{ col.label }}</span>
      </label>
    </div>

    <!-- Search and Rows per Page -->
    <div class="flex justify-between items-center flex-wrap gap-6">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="border rounded-lg px-4 py-2 flex-1 min-w-[200px] shadow-sm focus:ring-2 focus:ring-teal-500 bg-gray-800 text-white"
      />

      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-300">Rows per page:</span>
        <select v-model.number="rowsPerPage" class="border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-teal-500 bg-gray-800 text-white">
          <option v-for="n in rowsOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-400 border-solid"></div>
    </div>

    <table v-else class="min-w-full border border-gray-700 rounded-lg overflow-hidden shadow-md">
      <thead class="bg-gray-800 text-white">
        <tr>
          <th
            v-for="col in displayedColumns"
            :key="col.key"
            class="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in paginatedData" :key="row.id" class="hover:bg-gray-700 transition-colors">
          <td
            v-for="col in displayedColumns"
            :key="col.key"
            class="px-6 py-4 border-t border-gray-600 text-sm"
          >
            <div v-if="editingCell.row === row.id && editingCell.col === col.key">
              <input
                v-model="row[col.key]"
                @blur="stopEditing"
                @keyup.enter="stopEditing"
                class="border rounded px-2 py-1 w-full bg-gray-800 text-white"
                autofocus
              />
            </div>
            <div
              v-else
              @dblclick="startEditing(row.id, col.key)"
              class="cursor-pointer text-gray-300"
            >
              {{ row[col.key] }}
            </div>
          </td>
        </tr>

        <tr v-if="filteredData.length === 0">
          <td :colspan="displayedColumns.length" class="text-center py-4 text-gray-500">
            No data found
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-6 flex-wrap gap-4">
      <div class="text-sm text-gray-300">Page {{ currentPage }} of {{ totalPages }}</div>
      <div class="flex gap-4">
        <button
          class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <button
          class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, PropType } from 'vue'
import axios from 'axios'


interface Column {
  key: string
  label: string
}

interface RowData {
  id: number
  [key: string]: any
}

const props = defineProps<{
  apiUrl: string
  columns: Column[]
  rowsOptions?: number[]
  initialRowsPerPage?: number
}>()

const rowsOptions = props.rowsOptions ?? [5, 10, 20]
const rowsPerPage = ref(props.initialRowsPerPage ?? 5)

const data = ref<RowData[]>([])
const currentPage = ref(1)
const searchQuery = ref('')
const editingCell = ref<{ row: number | null; col: string | null }>({ row: null, col: null })
const visibleColumns = ref(props.columns?.map(c => c.key))
const isLoading = ref(true)  


const displayedColumns = computed(() =>
  props.columns?.filter(col => visibleColumns.value.includes(col.key))
)

const filteredData = computed(() => {
  if (!searchQuery.value) return data.value
  const query = searchQuery.value.toLowerCase()
  return data.value.filter(row =>
    displayedColumns.value.some(col =>
      String(row[col.key]).toLowerCase().includes(query)
    )
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / rowsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredData.value.slice(start, start + rowsPerPage.value)
})


watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
})


const fetchData = async () => {
  isLoading.value = true 
  try {
    const res = await axios.get<RowData[]>(props.apiUrl)
    data.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false 
  }
}

const startEditing = (rowId: number, colKey: string) => {
  editingCell.value = { row: rowId, col: colKey }
}

const stopEditing = () => {
  editingCell.value = { row: null, col: null }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
tbody tr:hover {
  background-color: #444; 
}

table th {
  background-color: #333; 
}
</style>

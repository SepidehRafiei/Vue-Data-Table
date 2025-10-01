<template>
  <div class="p-4 space-y-4">

    <!-- Column Toggle -->
    <div class="flex gap-4 items-center flex-wrap">
      <span class="font-semibold">Show Columns:</span>
      <label
        v-for="col in columns"
        :key="col.key"
        class="flex items-center gap-1"
      >
        <input type="checkbox" v-model="visibleColumns" :value="col.key" />
        {{ col.label }}
      </label>
    </div>

    <!-- Search and Rows per Page -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="border rounded px-2 py-1 flex-1 min-w-[200px]"
      />

      <div class="flex items-center gap-2">
        <span>Rows per page:</span>
        <select v-model.number="rowsPerPage" class="border rounded px-2 py-1">
          <option v-for="n in rowsOptions" :key="n" :value="n">{{ n }}</option>
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
        <tr v-for="row in paginatedData" :key="row.id" class="hover:bg-gray-50">
          <td
            v-for="col in displayedColumns"
            :key="col.key"
            class="px-4 py-2 border-b"
          >
            <div v-if="editingCell.row === row.id && editingCell.col === col.key">
              <input
                v-model="row[col.key]"
                @blur="stopEditing"
                @keyup.enter="stopEditing"
                class="border px-1 py-0.5 w-full"
                autofocus
              />
            </div>
            <div
              v-else
              @dblclick="startEditing(row.id, col.key)"
              class="cursor-pointer"
            >
              {{ row[col.key] }}
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
      <div>Page {{ currentPage }} of {{ totalPages }}</div>
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

<script lang="ts" setup>
import { ref, computed, onMounted, watch, PropType } from 'vue'
import axios from 'axios'

/** ---------- Props ---------- */
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

/** ---------- State ---------- */
const data = ref<RowData[]>([])
const currentPage = ref(1)
const searchQuery = ref('')
const editingCell = ref<{ row: number | null; col: string | null }>({ row: null, col: null })
const visibleColumns = ref(props.columns.map(c => c.key))

/** ---------- Computed ---------- */
const displayedColumns = computed(() =>
  props.columns.filter(col => visibleColumns.value.includes(col.key))
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

/** ---------- Watchers ---------- */
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
})

/** ---------- Functions ---------- */
const fetchData = async () => {
  try {
    const res = await axios.get<RowData[]>(props.apiUrl)
    data.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const startEditing = (rowId: number, colKey: string) => {
  editingCell.value = { row: rowId, col: colKey }
}

const stopEditing = () => {
  editingCell.value = { row: null, col: null }
}

/** ---------- Lifecycle ---------- */
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
tbody tr:hover {
  background-color: #f9fafb;
}
</style>

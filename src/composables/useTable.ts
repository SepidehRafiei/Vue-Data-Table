import { ref, computed, watch } from 'vue'
import axios from 'axios'

export interface Column {
  key: string
  label: string
}

export interface RowData {
  id: number
  [key: string]: any
}

export function useTable(apiUrl: string, columns: Column[], rowsOptions = [5,10,20], initialRowsPerPage = 5) {
  const data = ref<RowData[]>([])
  const isLoading = ref(true)
  const searchQuery = ref('')
  const currentPage = ref(1)
  const rowsPerPage = ref(initialRowsPerPage)
  const visibleColumns = ref<string[]>(columns?.map(c => c.key))
  const editingCell = ref<{ row: number|null, col: string|null }>({ row:null, col:null })

  const displayedColumns = computed(() =>
    columns?.filter(col => visibleColumns.value.includes(col.key))
  )

  const filteredData = computed(() => {
    if (!searchQuery.value) return data.value
    const q = searchQuery.value.toLowerCase()
    return data.value.filter(row =>
      displayedColumns.value.some(col =>
        String(row[col.key]).toLowerCase().includes(q)
      )
    )
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / rowsPerPage.value)))

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
      const res = await axios.get<RowData[]>(apiUrl)
      data.value = res.data
    } catch (e) {
      console.error(e)
      data.value = []
    } finally {
      isLoading.value = false
    }
  }

  const startEditing = (rowId:number, colKey:string) => {
    editingCell.value = { row: rowId, col: colKey }
  }
  const stopEditing = () => {
    editingCell.value = { row:null, col:null }
  }

  return {
    // state
    data, isLoading, searchQuery, currentPage, rowsPerPage, visibleColumns, editingCell,
    // computed
    displayedColumns, filteredData, paginatedData, totalPages,
    // methods
    fetchData, startEditing, stopEditing,
    rowsOptions
  }
}

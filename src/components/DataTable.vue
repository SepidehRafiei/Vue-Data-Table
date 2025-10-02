<template>
  <div class="p-6 bg-gray-900 text-white shadow-lg rounded-lg space-y-6 w-full max-w-5xl">
    <ColumnToggle :columns="columns" v-model="visibleColumns" />

    <div class="flex justify-between items-center flex-wrap gap-6">
      <TableSearch v-model="searchQuery" />
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-300">Rows per page:</span>
        <select v-model.number="rowsPerPage" class="border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-teal-500 bg-gray-800 text-white">
          <option v-for="n in rowsOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-48">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-400 border-solid"></div>
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

    <TablePagination :currentPage="currentPage" :totalPages="totalPages" @update:page="(val: number) => currentPage = val" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { Column } from '../composables/useTable'
import { useTable } from '../composables/useTable'
import ColumnToggle from './ColumnToggle.vue'
import TableSearch from './TableSearch.vue'
import TablePagination from './TablePagination.vue'

const props = defineProps<{
  apiUrl: string
  columns: Column[]
}>()

const {
  data, isLoading, searchQuery, currentPage, rowsPerPage, visibleColumns, editingCell,
  displayedColumns, filteredData, paginatedData, totalPages,
  fetchData, startEditing, stopEditing, rowsOptions
} = useTable(props.apiUrl, props.columns)

onMounted(() => fetchData())
</script>

<style scoped>
tbody tr:hover {
  background-color: #444;
}

table th {
  background-color: #333;
}
</style>

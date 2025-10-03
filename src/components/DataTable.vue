<template>
  <div class="p-4 sm:p-6 bg-gray-900 text-white shadow-lg rounded-lg space-y-6 w-full max-w-6xl mx-auto">
    
    <!-- Column Toggle -->
    <ColumnToggle :columns="columns" v-model="visibleColumns" />

    <!-- Search + Rows per page -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full">
      <!-- Search Box -->
      <div class="relative flex-1 w-full">
        <TableSearch v-model="searchQuery" class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-teal-500 transition-all duration-200" />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7 7 0 1110.65 6.65a7 7 0 015.35 10.35z" />
        </svg>
      </div>

      <!-- Rows per page -->
      <div class="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
        <span class="text-xs sm:text-sm text-gray-300 font-medium transition-colors duration-200">
          Rows per page:
        </span>
        <select
          v-model.number="rowsPerPage"
          class="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-teal-500 bg-gray-800 text-white text-xs sm:text-sm transition-all duration-300 ease-in-out hover:bg-gray-700 focus:bg-gray-700"
        >
          <option v-for="n in rowsOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-40 sm:h-48">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-teal-400 border-solid"></div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full border border-gray-700 rounded-lg overflow-hidden shadow-md">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th
              v-for="col in displayedColumns"
              :key="col.key"
              class="px-3 py-2 sm:px-6 sm:py-4 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <transition-group name="fade-slide" tag="tbody">
          <tr
            v-for="row in paginatedData"
            :key="row.id"
            class="hover:bg-gray-700 transition-colors"
          >
            <td
              v-for="col in displayedColumns"
              :key="col.key"
              class="px-3 py-2 sm:px-6 sm:py-4 border-t border-gray-600 text-xs sm:text-sm"
            >
              <div v-if="editingCell.row === row.id && editingCell.col === col.key">
                <input
                  v-model="row[col.key]"
                  @blur="stopEditing"
                  @keyup.enter="stopEditing"
                  class="border rounded px-2 py-1 w-full bg-gray-800 text-white text-xs sm:text-sm transition-all duration-200"
                  autofocus
                />
              </div>
              <div
                v-else
                @dblclick="startEditing(row.id, col.key)"
                class="cursor-pointer text-gray-300 transition-colors duration-200 hover:text-teal-400"
              >
                {{ row[col.key] }}
              </div>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0" :key="'empty'" class="transition-all duration-300">
            <td :colspan="displayedColumns.length" class="text-center py-4 text-gray-500 text-xs sm:text-sm">
              No data found
            </td>
          </tr>
        </transition-group>
      </table>
    </div>

    <!-- Pagination -->
    <TablePagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:page="(val: number) => (currentPage = val)"
      class="w-full"
    />
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
  data,
  isLoading,
  searchQuery,
  currentPage,
  rowsPerPage,
  visibleColumns,
  editingCell,
  displayedColumns,
  filteredData,
  paginatedData,
  totalPages,
  fetchData,
  startEditing,
  stopEditing,
  rowsOptions,
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

/* Fade + slide animation for table rows */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

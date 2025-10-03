<template>
  <div class="flex flex-col sm:flex-row justify-between items-center mt-6 flex-wrap gap-3 sm:gap-4 w-full">
    <!-- Page Info -->
    <div class="text-xs sm:text-sm text-gray-300">
      Page {{ currentPage }} of {{ totalPages }}
    </div>

    <!-- Buttons -->
    <div class="flex flex-wrap gap-2 sm:gap-4">
      <button
        class="px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 text-xs sm:text-sm"
        :disabled="currentPage === 1"
        @click="$emit('update:page', currentPage - 1)"
      >
        Prev
      </button>
      <button
        class="px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 text-xs sm:text-sm"
        :disabled="currentPage === totalPages"
        @click="$emit('update:page', currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ currentPage: number; totalPages: number }>()
defineEmits(['update:page'])
</script>

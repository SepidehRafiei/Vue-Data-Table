<template>
  <div class="flex justify-between items-center mt-6 flex-wrap gap-4">
    <div class="text-sm text-gray-300">Page {{ currentPage }} of {{ totalPages }}</div>
    <div class="flex gap-4">
      <button
        class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="$emit('update:page', currentPage - 1)"
      >
        Prev
      </button>
      <button
        class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
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

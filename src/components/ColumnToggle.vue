<template>
  <div class="p-4 bg-gray-800 rounded-xl shadow-md w-full">
    <div class="flex gap-4 items-center flex-wrap">
      <!-- Title -->
      <span class="font-semibold text-base sm:text-lg text-teal-400">Show Columns:</span>

      <!-- Checkbox Options -->
      <transition-group
        name="fade"
        tag="div"
        class="flex gap-3 flex-wrap items-center"
      >
        <label
          v-for="col in columns"
          :key="col.key"
          class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-600 transition-all duration-200"
        >
          <!-- Custom checkbox -->
          <input
            type="checkbox"
            v-model="localVisible"
            :value="col.key"
            class="w-4 h-4 text-teal-500 bg-gray-800 border-gray-600 rounded focus:ring-teal-400 transition-all duration-200"
          />
          <span class="text-sm text-gray-200">{{ col.label }}</span>
        </label>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Column } from '../composables/useTable'

const props = defineProps<{
  columns: Column[]
  modelValue: string[]
}>()

const emit = defineEmits(['update:modelValue'])

const localVisible = computed({
  get: () => props.modelValue,
  set: (v: string[]) => emit('update:modelValue', v)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>

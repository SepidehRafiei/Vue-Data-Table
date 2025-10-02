<template>
  <div class="flex gap-6 items-center flex-wrap">
    <span class="font-semibold text-lg text-gray-200">Show Columns:</span>
    <label
      v-for="col in columns"
      :key="col.key"
      class="flex items-center gap-2 text-gray-400"
    >
      <input type="checkbox" v-model="localVisible" :value="col.key" class="rounded border-gray-700" />
      <span class="text-sm">{{ col.label }}</span>
    </label>
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

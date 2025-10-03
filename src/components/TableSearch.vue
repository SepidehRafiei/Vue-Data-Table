<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    placeholder="Search..."
    class="border rounded-lg px-4 py-2 flex-1 min-w-[200px] shadow-sm focus:ring-2 focus:ring-teal-500 bg-gray-800 text-white"
  />
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue'])
</script>

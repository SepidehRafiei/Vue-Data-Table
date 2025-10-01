<template>
  <div class="max-w-6xl mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-4">Demo Table</h1>

    <AdvancedTable
      apiUrl="https://jsonplaceholder.typicode.com/posts"
      :columns="columns"
      :rows-options="[5,10,20,50]"
      :initial-rows-per-page="10"
    />
  </div>
</template>

<script lang="ts" setup>
import AdvancedTable from './components/AdvancedTable.vue'

interface Column {
  key: string
  label: string
}

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'body', label: 'Body' }
]
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <DataTable apiUrl="https://jsonplaceholder.typicode.com/posts" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import DataTable from './components/DataTable.vue'

const columns = [
  { key: 'userId', label: 'userId' },
  { key: 'title', label: 'title' },
  { key: 'body', label: 'body' }
]

</script>

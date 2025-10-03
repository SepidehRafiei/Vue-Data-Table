<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <DataTable apiUrl="https://jsonplaceholder.typicode.com/posts" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import DataTable from './components/DataTable.vue'

const columns = [
  { key: 'id', label: 'id' },
  { key: 'title', label: 'title' },
  { key: 'userId', label: 'userId' },
  { key: 'body', label: 'body' }
]

</script>

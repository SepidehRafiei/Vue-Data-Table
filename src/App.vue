<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <DataTable apiUrl="/src/mock/data.json" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import DataTable from './components/DataTable.vue'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
]
</script>

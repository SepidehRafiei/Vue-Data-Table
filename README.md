# Vue DataTable — Modular (Vue 3 + Vite + TypeScript + Tailwind)

## Project Overview
- **Modular structure**
  - `src/components`
    - `DataTable.vue` — main component containing the table
    - `ColumnToggle.vue` — show/hide table columns
    - `TableSearch.vue` — search input component
    - `TablePagination.vue` — pagination controls
  - `src/composables/useTable.ts` — all logic: fetching, filtering, pagination, and cell editing
- **Styling:** Tailwind CSS
- **Setup:** Vite + TypeScript
- Includes a mock data file at `src/mock/data.json` for local testing

## Local Setup
1. Install Node.js >= 18
2. Clone the repository or extract the zip
3. Inside the project folder, run:
```bash
npm install
npm run dev


#  Technical Details / Architecture
All table logic (fetching, filtering, pagination, editing) is handled in useTable, keeping components focused on rendering and interactions.
Components use v-model and emits to communicate with the composable.
Data is currently read from src/mock/data.json. To use a real API, simply update the apiUrl in App.vue.


# Key Files
src/composables/useTable.ts — table logic
src/components/DataTable.vue — parent component
src/mock/data.json — sample data




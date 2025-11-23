<template>
  <div class="transformer-table">
    <div class="table-header">
      <h2>Transformer Data</h2>

      <div class="filters">
        <div class="search-box">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search transformers..."
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="regionFilter" @change="handleRegionFilter" class="filter-select">
            <option value="">All Regions</option>
            <option v-for="region in availableRegions" :key="region" :value="region">
              {{ region }}
            </option>
          </select>
          
          <select v-model="healthFilter" @change="handleHealthFilter" class="filter-select">
            <option value="">All Health Statuses</option>
            <option v-for="health in availableHealthStatuses" :key="health" :value="health">
              {{ health }}
            </option>
          </select>
          
          <button @click="clearFilters" class="clear-btn">Clear Filters</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      Loading transformer data...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>Health</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transformer in filteredTransformers" :key="transformer.assetId" class="table-row">
            <td>{{ transformer.name }}</td>
            <td>{{ transformer.region }}</td>
            <td>
              <span :class="['health-badge', `health-${transformer.health.toLowerCase()}`]">
                {{ transformer.health }}
              </span>
            </td>
            <td>
              <button
                @click="handleToggleSelection(transformer.assetId)"
                :disabled="isToggling"
                :class="['toggle-btn', { 'selected': isSelected(transformer.assetId) }]"
              >
                {{ isSelected(transformer.assetId) ? 'Hide' : 'Show' }} in Chart
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredTransformers.length === 0" class="no-data">
        No transformers found matching the current filters.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTransformerStore } from '@/stores/transformer';

const store = useTransformerStore();
const isToggling = ref(false);
const toggleTimeout = ref<number | null>(null);

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (value: string) => store.setSearchQuery(value)
});

const regionFilter = computed({
  get: () => store.regionFilter,
  set: (value: string) => store.setRegionFilter(value)
});

const healthFilter = computed({
  get: () => store.healthFilter,
  set: (value: string) => store.setHealthFilter(value)
});

const filteredTransformers = computed(() => store.filteredTransformers);
const availableRegions = computed(() => store.availableRegions);
const availableHealthStatuses = computed(() => store.availableHealthStatuses);
const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);

const handleSearch = () => {
  store.setSearchQuery(searchQuery.value);
};

const handleRegionFilter = () => {
  store.setRegionFilter(regionFilter.value);
};

const handleHealthFilter = () => {
  store.setHealthFilter(healthFilter.value);
};

const clearFilters = () => {
  store.clearFilters();
};

const handleToggleSelection = (transformerId: number) => {
  if (isToggling.value) return;
  
  isToggling.value = true;
  store.toggleTransformerSelection(transformerId);
  
  if (toggleTimeout.value) {
    clearTimeout(toggleTimeout.value);
  }
  
  toggleTimeout.value = window.setTimeout(() => {
    isToggling.value = false;
  }, 300);
};

const isSelected = (transformerId: number) => {
  return store.selectedTransformers.has(transformerId);
};
</script>

<style scoped>
.transformer-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.table-header {
  margin-bottom: 24px;
}

.table-header h2 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 140px;
}

.clear-btn {
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #6c757d;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.table th,
.table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.table-row:hover {
  background: #f8f9fa;
}

.health-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.health-excellent {
  background: #d4edda;
  color: #155724;
}

.health-good {
  background: #d1ecf1;
  color: #0c5460;
}

.health-fair {
  background: #fff3cd;
  color: #856404;
}

.health-poor {
  background: #f8d7da;
  color: #721c24;
}

.health-critical {
  background: #f8d7da;
  color: #721c24;
  font-weight: bold;
}

.toggle-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #6c757d;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-btn.selected {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.toggle-btn.selected:hover:not(:disabled) {
  background: #3aa876;
}

.loading,
.error,
.no-data {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 16px;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .table-container {
    font-size: 14px;
  }
  
  .table th,
  .table td {
    padding: 8px 12px;
  }
}
</style>

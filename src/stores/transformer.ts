import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Transformer } from '@/types/transformer';

export const useTransformerStore = defineStore('transformer', () => {
  // State
  const transformers = ref<Transformer[]>([]);
  const selectedTransformers = ref<Set<number>>(new Set());
  const searchQuery = ref('');
  const regionFilter = ref('');
  const healthFilter = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const filteredTransformers = computed(() => {
    let filtered = transformers.value;

    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(transformer =>
        transformer.name.toLowerCase().includes(query) ||
        transformer.region.toLowerCase().includes(query)
      );
    }

    // Apply region filter
    if (regionFilter.value) {
      filtered = filtered.filter(transformer =>
        transformer.region === regionFilter.value
      );
    }

    // Apply health filter
    if (healthFilter.value) {
      filtered = filtered.filter(transformer =>
        transformer.health === healthFilter.value
      );
    }

    return filtered;
  });

  const availableRegions = computed(() => {
    const regions = new Set(transformers.value.map(t => t.region));
    return Array.from(regions).sort();
  });

  const availableHealthStatuses = computed(() => {
    const healthStatuses = new Set(transformers.value.map(t => t.health));
    return Array.from(healthStatuses).sort();
  });

  const selectedTransformerData = computed(() => {
    return transformers.value.filter(transformer =>
      selectedTransformers.value.has(transformer.assetId)
    );
  });

  // Actions
  const loadTransformers = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/sampledata.json');
      if (!response.ok) {
        throw new Error('Failed to load transformer data');
      }
      
      const data: Transformer[] = await response.json();
      transformers.value = data;
      
      // Initialize all transformers as selected
      selectedTransformers.value = new Set(data.map(t => t.assetId));
      
      // Load persisted state from localStorage
      loadPersistedState();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  const toggleTransformerSelection = (transformerId: number) => {
    const newSelection = new Set(selectedTransformers.value);
    if (newSelection.has(transformerId)) {
      newSelection.delete(transformerId);
    } else {
      newSelection.add(transformerId);
    }
    selectedTransformers.value = newSelection;
    savePersistedState();
  };

  const selectAllTransformers = () => {
    selectedTransformers.value = new Set(transformers.value.map(t => t.assetId));
    savePersistedState();
  };

  const deselectAllTransformers = () => {
    selectedTransformers.value.clear();
    savePersistedState();
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    savePersistedState();
  };

  const setRegionFilter = (region: string) => {
    regionFilter.value = region;
    savePersistedState();
  };

  const setHealthFilter = (health: string) => {
    healthFilter.value = health;
    savePersistedState();
  };

  const clearFilters = () => {
    searchQuery.value = '';
    regionFilter.value = '';
    healthFilter.value = '';
    savePersistedState();
  };

  // Persistence
  const savePersistedState = () => {
    const state = {
      selectedTransformers: Array.from(selectedTransformers.value),
      searchQuery: searchQuery.value,
      regionFilter: regionFilter.value,
      healthFilter: healthFilter.value
    };
    localStorage.setItem('transformer-app-state', JSON.stringify(state));
  };

  const loadPersistedState = () => {
    const saved = localStorage.getItem('transformer-app-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.selectedTransformers) {
          selectedTransformers.value = new Set(state.selectedTransformers);
        }
        if (state.searchQuery) {
          searchQuery.value = state.searchQuery;
        }
        if (state.regionFilter) {
          regionFilter.value = state.regionFilter;
        }
        if (state.healthFilter) {
          healthFilter.value = state.healthFilter;
        }
      } catch (err) {
        console.warn('Failed to load persisted state:', err);
      }
    }
  };

  return {
    // State
    transformers,
    selectedTransformers,
    searchQuery,
    regionFilter,
    healthFilter,
    isLoading,
    error,
    
    // Getters
    filteredTransformers,
    availableRegions,
    availableHealthStatuses,
    selectedTransformerData,
    
    // Actions
    loadTransformers,
    toggleTransformerSelection,
    selectAllTransformers,
    deselectAllTransformers,
    setSearchQuery,
    setRegionFilter,
    setHealthFilter,
    clearFilters
  };
});

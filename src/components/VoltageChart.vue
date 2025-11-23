<template>
  <div class="voltage-chart">
    <div class="chart-header">
      <h2>Voltage Readings Over Time</h2>
      
      <div class="chart-controls">
        <div class="selection-controls">
          <button @click="selectAll" class="control-btn">Select All</button>
          <button @click="deselectAll" class="control-btn">Deselect All</button>
        </div>
        
        <div class="transformer-checkboxes">
          <label
            v-for="transformer in transformers"
            :key="transformer.assetId"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :checked="isSelected(transformer.assetId)"
              @change="toggleSelection(transformer.assetId)"
              class="checkbox-input"
            />
            <span class="checkbox-label">{{ transformer.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <div v-if="isLoading" class="loading">
        Loading chart data...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else-if="selectedTransformerData.length === 0" class="no-data">
        No transformers selected. Please select transformers from the table or use the checkboxes above.
      </div>
      
      <div v-else class="chart-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, toRaw } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useTransformerStore } from '@/stores/transformer';

Chart.register(...registerables);

const store = useTransformerStore();
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const chart = ref<Chart | null>(null);
    const isDestroying = ref(false);
    const updateTimeout = ref<number | null>(null);

    const transformers = computed(() => store.transformers);
    const selectedTransformerData = computed(() => store.selectedTransformerData);
    const isLoading = computed(() => store.isLoading);
    const error = computed(() => store.error);

    const isSelected = (transformerId: number) => {
      return store.selectedTransformers.has(transformerId);
    };

    const toggleSelection = (transformerId: number) => {
      store.toggleTransformerSelection(transformerId);
    };

    const selectAll = () => {
      store.selectAllTransformers();
    };

    const deselectAll = () => {
      store.deselectAllTransformers();
    };

    const destroyChart = () => {
      if (chart.value && !isDestroying.value) {
        isDestroying.value = true;
        try {
          if (chart.value.ctx) {
            chart.value.stop();
          }
          chart.value.destroy();
        } catch (err) {
          console.warn('Error destroying chart:', err);
        } finally {
          chart.value = null;
          isDestroying.value = false;
        }
      }
    };

    const createChart = async () => {
      if (!chartCanvas.value || isDestroying.value) return;

      const ctx = chartCanvas.value.getContext('2d');
      if (!ctx) {
        console.warn('Could not get canvas context');
        return;
      }

      // Destroy existing chart first
      destroyChart();

      // Wait for next tick to ensure proper cleanup
      await nextTick();
      
      // Double-check canvas is still available
      if (!chartCanvas.value || isDestroying.value) return;

      // Get raw data to avoid reactivity issues
      const rawData = toRaw(selectedTransformerData.value);
      
      if (!rawData || rawData.length === 0) {
        return;
      }

      const datasets = rawData.map((transformer, index) => {
        const colors = [
          '#42b983', // Green
          '#3498db', // Blue
          '#e74c3c', // Red
          '#f39c12', // Orange
          '#9b59b6', // Purple
          '#1abc9c', // Turquoise
          '#e67e22', // Carrot
          '#34495e'  // Dark Blue
        ];

        // Create plain objects to avoid reactivity issues
        const data = transformer.lastTenVoltgageReadings?.map(reading => {
          try {
            return {
              x: new Date(reading.timestamp).toLocaleDateString(),
              y: parseFloat(reading.voltage) || 0
            };
          } catch (err) {
            console.warn('Error parsing reading:', reading, err);
            return {
              x: 'Invalid Date',
              y: 0
            };
          }
        }) || [];

        return {
          label: transformer.name || `Transformer ${transformer.assetId}`,
          data: data,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '20',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false
        };
      }).filter(dataset => dataset.data.length > 0); // Only include datasets with data

      if (datasets.length === 0) {
        return;
      }

      try {
        // Create chart with proper typing and type assertions
        const chartConfig = {
          type: 'line' as const,
          data: {
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Completely disable animations
            interaction: {
              intersect: false,
              mode: 'index' as const
            },
            plugins: {
              title: {
                display: true,
                text: 'Transformer Voltage Readings',
                font: {
                  size: 16,
                  weight: 'bold' as const
                }
              },
              legend: {
                display: true,
                position: 'top' as const
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  title: (context: any) => {
                    return context[0]?.parsed?.x ? `Date: ${context[0].parsed.x}` : 'Date';
                  },
                  label: (context: any) => {
                    return context.dataset?.label ? `${context.dataset.label}: ${context.parsed?.y || 0}V` : 'Unknown';
                  }
                }
              }
            },
            scales: {
              x: {
                type: 'category' as const,
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxRotation: 45
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Voltage (V)'
                },
                beginAtZero: false
              }
            }
          }
        };

        // Ensure the canvas is properly set up and component is still mounted
        if (chartCanvas.value && !isDestroying.value) {
          // Create the chart instance
          chart.value = new Chart(chartCanvas.value, chartConfig as any);
          
          // Verify chart was created successfully
          if (chart.value && chart.value.ctx) {
            console.log('Chart created successfully');
          } else {
            console.warn('Chart creation failed');
          }
        }

      } catch (err) {
        console.error('Error creating chart:', err);
      }
    };

    const debouncedUpdateChart = () => {
      // Clear existing timeout
      if (updateTimeout.value) {
        clearTimeout(updateTimeout.value);
      }

      // Set new timeout
      updateTimeout.value = window.setTimeout(() => {
        if (selectedTransformerData.value.length === 0) {
          destroyChart();
          return;
        }
        
        // Only create chart if we have data and canvas is available
        if (chartCanvas.value && !isDestroying.value) {
          createChart();
        }
      }, 400); // Increased debounce time
    };

    const updateChart = () => {
      debouncedUpdateChart();
    };

    // Watch for changes in selected transformers
    watch(selectedTransformerData, updateChart, { deep: true });

    onMounted(() => {
      // Wait a bit for the DOM to be ready and data to be loaded
      setTimeout(() => {
        if (selectedTransformerData.value.length > 0 && chartCanvas.value && !isDestroying.value) {
          createChart();
        }
      }, 800); // Increased delay to ensure everything is ready
    });

onUnmounted(() => {
  if (updateTimeout.value) {
    clearTimeout(updateTimeout.value);
  }
  destroyChart();
});
</script>

<style scoped>
.voltage-chart {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.chart-header {
  margin-bottom: 24px;
}

.chart-header h2 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.selection-controls {
  display: flex;
  gap: 12px;
}

.control-btn {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background: #3aa876;
}

.transformer-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.checkbox-item:hover {
  background: #f8f9fa;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #495057;
  cursor: pointer;
}

.chart-container {
  position: relative;
  min-height: 400px;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.loading,
.error,
.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6c757d;
  font-size: 16px;
  width: 100%;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .chart-controls {
    flex-direction: column;
    gap: 16px;
  }
  
  .transformer-checkboxes {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-wrapper {
    height: 300px;
  }
}
</style>

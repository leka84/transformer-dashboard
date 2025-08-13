<template>
  <div id="app">
    <header class="app-header">
      <h1>Transformer Asset Dashboard</h1>
      <p>Monitor and visualize transformer voltage readings in real-time</p>
    </header>

    <main class="app-main">
      <TransformerTable />
      <VoltageChart />
    </main>

    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useTransformerStore } from '@/stores/transformer';
import TransformerTable from '@/components/TransformerTable.vue';
import VoltageChart from '@/components/VoltageChart.vue';
import AppFooter from '@/components/Footer.vue';

export default defineComponent({
  name: 'App',
  components: {
    TransformerTable,
    VoltageChart,
    AppFooter
  },
  /**
   * Component setup function that initializes the transformer store
   * and loads transformer data when the component is mounted.
   * 
   * @returns {Object} Empty object as no reactive data is returned
   */
  setup() {
    const store = useTransformerStore();

    onMounted(() => {
      store.loadTransformers();
    });

    return {};
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-header {
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.app-header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  font-weight: 300;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .app-header {
    padding: 24px 16px;
  }
  
  .app-header h1 {
    font-size: 24px;
  }
  
  .app-header p {
    font-size: 14px;
  }
  
  .app-main {
    padding: 16px;
  }
}
</style>

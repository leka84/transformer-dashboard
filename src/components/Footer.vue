<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-info">
        <p>Transformer Asset Dashboard. Built with Vue.js 3 and TypeScript.</p>
        <p>Real-time monitoring and visualization of transformer voltage readings.</p>
      </div>
      <span class="footer-info">&copy; 2025 All rights reserved</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component - no additional logic needed
</script>

<style scoped>
.app-footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 24px 0;
  margin-top: 48px;
  border-top: 1px solid #34495e;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
}

.footer-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.footer-info p:first-child {
  font-weight: 600;
  color: #42b983;
}

@media (max-width: 768px) {
  .footer-content {
    padding: 0 16px;
  }
  
  .footer-links {
    gap: 12px;
  }
  
  .footer-link {
    font-size: 11px;
  }
}
</style>

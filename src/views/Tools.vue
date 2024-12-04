<template>
  <div class="tools-container">
    <h1>AI Tools</h1>
    <div class="tools-grid">
      <!-- 工具卡片示例 -->
      <div class="tool-card">
        <div class="tool-header">
          <h3>Coming Soon</h3>
          <span class="status">In Development</span>
        </div>
        <p>Our first AI tool is currently under development. Stay tuned!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tools-container {
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.tools-container h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a1a;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.tool-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tool-header h3 {
  font-size: 1.25rem;
  color: #1a1a1a;
}

.status {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  color: #4a4a4a;
}

.tool-card p {
  color: #4a4a4a;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .tools-container {
    padding: 6rem 1rem 2rem;
  }
  
  .tools-container h1 {
    font-size: 2rem;
  }
}
</style>

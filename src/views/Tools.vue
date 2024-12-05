<template>
  <div class="tools-container">
    <!-- 工具列表页面 -->
    <template v-if="!isToolRoute">
      <h1>AI 工具集</h1>
      <div class="tools-grid">
        <router-link 
          v-for="tool in tools" 
          :key="tool.path"
          :to="tool.path"
          class="tool-card"
        >
          <div class="tool-header">
            <h3>{{ tool.name }}</h3>
            <span class="status" :class="{ 'status-disabled': !tool.available }">
              {{ tool.available ? '可用' : '不可用' }}
            </span>
          </div>
          <p>{{ tool.description }}</p>
        </router-link>
      </div>
    </template>
    <!-- 工具内容区域 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isToolRoute = computed(() => {
  return route.path !== '/tools'
})

const tools = [
  {
    name: 'AI 图像生成器',
    path: 'image-generator',
    description: '使用 AI 技术生成各种创意图像',
    available: false
  },
  {
    name: 'AI 文本补全',
    path: 'text-completion',
    description: '智能文本补全和生成助手',
    available: false
  },
  {
    name: 'AI 代码助手',
    path: 'code-assistant',
    description: '智能代码补全和优化建议',
    available: false
  },
  {
    name: '宾果游戏',
    path: 'bingo-game',
    description: '创建并分享你的专属宾果游戏',
    available: true
  }
]
</script>

<style scoped>
.tools-container {
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.tools-container h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.tool-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tool-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.status {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.status:not(.status-disabled) {
  color: #10b981;
  background: #ecfdf5;
}

.status-disabled {
  color: #6b7280;
  background: #f3f4f6;
}

.tool-card:has(.status-disabled) {
  opacity: 0.75;
  cursor: not-allowed;
}

.tool-card:has(.status-disabled):hover {
  transform: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <section class="result-section">
    <div class="container">
      <h2 class="section-title">
        你的亲密画像
      </h2>

      <!-- Result Card -->
      <div id="result-card" class="card">
        <!-- Header -->
        <div class="header">
          <div>
            <div class="header-title">你的 AI 亲密画像</div>
            <div class="header-sub">基于使用场景与三维度评估的轻量画像</div>
          </div>
          <div class="badge">{{ archetype.name }}</div>
        </div>

        <!-- Closeness -->
        <div class="closeness">
          <div class="value">{{ userData.dimensions.closeness }}%</div>
          <div class="label">Closeness</div>
          <p>{{ archetype.description }}</p>
        </div>

        <!-- Preferred Models -->
        <div class="models">
          <h4>偏好模型</h4>
          <div class="tags">
            <div
              v-for="modelId in userData.preferredModels"
              :key="modelId"
              class="tag"
            >
              {{ getModelName(modelId) }}
            </div>
            <div
              v-if="userData.customModel"
              class="tag"
            >
              其他: {{ userData.customModel }}
            </div>
          </div>
        </div>

        <!-- Usage Top3 -->
        <div class="usage">
          <h4>使用场景 TOP3</h4>
          <div
            v-for="scenario in topScenarios"
            :key="scenario.key"
            class="bar-row"
          >
            <div class="bar-label">{{ scenario.label }}</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: scenario.value + '%' }"></div>
            </div>
            <div class="bar-value">{{ scenario.value }}%</div>
          </div>
        </div>

        <!-- Dimensions -->
        <div class="dimensions">
          <h4>三维度评估</h4>
          <div class="bar-row">
            <div class="bar-label">Closeness</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: userData.dimensions.closeness + '%' }"></div>
            </div>
            <div class="bar-value">{{ userData.dimensions.closeness }}%</div>
          </div>
          <div class="bar-row">
            <div class="bar-label">Dependence</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: userData.dimensions.dependence + '%' }"></div>
            </div>
            <div class="bar-value">{{ userData.dimensions.dependence }}%</div>
          </div>
          <div class="bar-row">
            <div class="bar-label">Skepticism</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: userData.dimensions.skepticism + '%' }"></div>
            </div>
            <div class="bar-value">{{ userData.dimensions.skepticism }}%</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="brand">closeai.moe</div>
          <div class="slogan">Think with care · Share with style</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          @click="exportCard"
          class="btn btn-primary"
          :disabled="isExporting"
        >
          <span v-if="isExporting" class="loading-spinner"></span>
          下载图片
        </button>
        <button
          @click="copyShareText"
          class="btn btn-primary"
        >
          复制分享文本
        </button>
      </div>

      <!-- Inline Notification -->
      <div v-if="showNotification" class="notification">
        <svg xmlns="http://www.w3.org/2000/svg" class="notification-icon" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ notificationMessage }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { snapdom } from '@zumer/snapdom'
import { generateShareURL } from '../utils/storage.js'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  },
  archetype: {
    type: Object,
    required: true
  }
})

const isExporting = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')

const modelNames = {
  openai: 'OpenAI GPT',
  anthropic: 'Anthropic Claude',
  google: 'Google Gemini',
  meta: 'Meta Llama',
  xai: 'xAI Grok',
  qwen: 'Qwen（通义）',
  doubao: 'Doubao（豆包）',
  deepseek: 'DeepSeek',
  glm: 'GLM（智谱）',
  moonshot: 'Moonshot Kimi（月之暗面）'
}

const scenarioLabels = {
  programming: '编程 / 技术',
  creative: '写作 / 创意',
  learning: '学习 / 搜索',
  chat: '日常 / 聊天',
  tasks: '事务 / 打杂'
}

const getModelName = (modelId) => {
  return modelNames[modelId] || modelId
}

const topScenarios = computed(() => {
  const scenarios = Object.entries(props.userData.usageScenarios)
    .map(([key, value]) => ({
      key,
      label: scenarioLabels[key],
      value
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)

  return scenarios
})

const exportCard = async () => {
  isExporting.value = true
  try {
    const card = document.getElementById('result-card')
    if (!card) {
      throw new Error('Result card not found')
    }

    const result = await snapdom(card, {
      width: 720,
      scale: 2,
      dpr: 1,
      backgroundColor: '#fff'
    })
    const img = await result.toPng()
    
    const link = document.createElement('a')
    link.download = `closeai-profile-${Date.now()}.png`
    link.href = img.src
    link.click()
  } catch (error) {
    console.error('Export failed:', error)
    alert('导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}

const showInlineNotification = (message) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const copyShareText = async () => {
  const shareText = `我的AI亲密度是 ${props.userData.dimensions.closeness}%！\n\n我的画像：${props.archetype.name}\n${props.archetype.description}\n\n快来测测你的吧：https://closeai.moe`

  try {
    await navigator.clipboard.writeText(shareText)
    showInlineNotification('分享文本已复制到剪贴板！')
  } catch (error) {
    console.error('Copy failed:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = shareText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showInlineNotification('分享文本已复制到剪贴板！')
  }
}
</script>

<style scoped>
.result-section {
  background: #f5f5f5;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  margin: 0;
  padding: 20px;
  color: #222;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #222;
}

.card {
  background: #fff;
  max-width: 720px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

/* Mobile responsive styles */
@media (min-width: 768px) {
  .result-section {
    padding: 40px;
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
  
  .card {
    padding: 40px;
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.header-sub {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #333;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  padding: 8px 16px;
  min-height: 32px;
  line-height: 1;
}

@media (min-width: 768px) {
  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }
  
  .header-title {
    font-size: 24px;
    text-align: left;
  }
  
  .header-sub {
    font-size: 13px;
    text-align: left;
  }
  
  .badge {
    font-size: 14px;
    padding: 8px 16px;
    min-height: 32px;
  }
}

.closeness {
  text-align: center;
  margin-bottom: 20px;
}

.closeness .value {
  font-size: 60px;
  font-weight: 900;
  color: #000;
  line-height: 1;
}

.closeness .label {
  color: #555;
  font-size: 12px;
}

.closeness p {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  padding: 0 10px;
}

@media (min-width: 768px) {
  .closeness {
    margin-bottom: 28px;
  }
  
  .closeness .value {
    font-size: 80px;
  }
  
  .closeness .label {
    font-size: 14px;
  }
  
  .closeness p {
    font-size: 15px;
    padding: 0;
  }
}

h4 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  margin-bottom: 12px;
}

.models {
  margin-bottom: 28px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.tag {
  border: 1px solid #ccc;
  border-radius: 14px;
  padding: 4px 12px;
  font-size: 13px;
  color: #333;
}

.usage,
.dimensions {
  margin-bottom: 28px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.bar-label {
  font-size: 12px;
  flex: 0 0 80px;
  color: #555;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #000;
  width: 0%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.bar-value {
  flex: 0 0 40px;
  text-align: right;
  font-size: 12px;
  font-weight: 700;
  color: #000;
}

@media (min-width: 768px) {
  .bar-row {
    gap: 10px;
    margin-bottom: 12px;
  }
  
  .bar-label {
    font-size: 14px;
    flex: 0 0 120px;
  }
  
  .bar-track {
    height: 10px;
    border-radius: 6px;
  }
  
  .bar-fill {
    border-radius: 6px;
  }
  
  .bar-value {
    flex: 0 0 50px;
    font-size: 14px;
  }
}

.footer {
  border-top: 1px solid #eee;
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
}

.footer .brand {
  font-size: 18px;
  font-weight: 800;
  color: #000;
}

.footer .slogan {
  font-size: 13px;
  color: #777;
  margin-top: 4px;
}

.action-buttons {
  text-align: center;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  background: #333;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

@media (min-width: 768px) {
  .action-buttons {
    margin-top: 2rem;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
  
  .btn {
    padding: 12px 24px;
    font-size: 16px;
    width: auto;
  }
}

.btn:hover {
  background: #555;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.notification {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 12px;
  padding: 12px 20px;
  margin: 1rem auto 0;
  max-width: 400px;
}

.notification-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}
</style>

<template>
  <section class="py-16 px-4 bg-base-200">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-3xl font-bold text-center mb-12 text-base-content">
        你的亲密画像
      </h2>

      <!-- Result Card -->
      <div id="result-card" class="card bg-base-100 shadow-soft-xl rounded-2xl p-8 max-w-2xl mx-auto">
        <!-- Main Closeness Percentage -->
        <div class="text-center mb-8">
          <div class="text-8xl font-black text-primary mb-2">
            {{ userData.dimensions.closeness }}%
          </div>
          <div class="text-lg text-base-content/70">Closeness</div>
        </div>

        <!-- Archetype Badge -->
        <div class="text-center mb-8">
          <div class="badge badge-primary badge-lg px-4 py-2 text-lg font-semibold">
            {{ archetype.name }}
          </div>
          <p class="text-base-content/80 mt-3 leading-relaxed">
            {{ archetype.description }}
          </p>
        </div>

        <!-- Preferred Models -->
        <div class="mb-8">
          <h4 class="text-sm font-semibold text-base-content/60 mb-3 uppercase tracking-wide">
            偏好模型
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="modelId in userData.preferredModels"
              :key="modelId"
              class="badge badge-outline badge-primary"
            >
              {{ getModelName(modelId) }}
            </span>
            <span
              v-if="userData.customModel"
              class="badge badge-outline badge-primary"
            >
              其他: {{ userData.customModel }}
            </span>
          </div>
        </div>

        <!-- Top 3 Usage Scenarios -->
        <div class="mb-8">
          <h4 class="text-sm font-semibold text-base-content/60 mb-3 uppercase tracking-wide">
            使用场景 TOP3
          </h4>
          <div class="space-y-2">
            <div
              v-for="scenario in topScenarios"
              :key="scenario.key"
              class="flex items-center gap-3"
            >
              <span class="text-sm text-base-content/80 min-w-0 flex-1">
                {{ scenario.label }}
              </span>
              <div class="flex-1 bg-base-300 rounded-full h-2">
                <div
                  class="bg-primary h-2 rounded-full transition-all duration-500"
                  :style="{ width: scenario.value + '%' }"
                ></div>
              </div>
              <span class="text-sm font-medium text-primary min-w-[3rem] text-right">
                {{ scenario.value }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Dimensions -->
        <div class="mb-8">
          <h4 class="text-sm font-semibold text-base-content/60 mb-3 uppercase tracking-wide">
            三维度评估
          </h4>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-sm text-base-content/80 min-w-0 flex-1">Closeness</span>
              <div class="flex-1 bg-base-300 rounded-full h-2">
                <div
                  class="bg-primary h-2 rounded-full"
                  :style="{ width: userData.dimensions.closeness + '%' }"
                ></div>
              </div>
              <span class="text-sm font-medium text-primary min-w-[3rem] text-right">
                {{ userData.dimensions.closeness }}%
              </span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-base-content/80 min-w-0 flex-1">Dependence</span>
              <div class="flex-1 bg-base-300 rounded-full h-2">
                <div
                  class="bg-primary h-2 rounded-full"
                  :style="{ width: userData.dimensions.dependence + '%' }"
                ></div>
              </div>
              <span class="text-sm font-medium text-primary min-w-[3rem] text-right">
                {{ userData.dimensions.dependence }}%
              </span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-base-content/80 min-w-0 flex-1">Skepticism</span>
              <div class="flex-1 bg-base-300 rounded-full h-2">
                <div
                  class="bg-primary h-2 rounded-full"
                  :style="{ width: userData.dimensions.skepticism + '%' }"
                ></div>
              </div>
              <span class="text-sm font-medium text-primary min-w-[3rem] text-right">
                {{ userData.dimensions.skepticism }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center border-t border-base-300 pt-6 mt-8">
          <div class="text-lg font-bold text-primary mb-1">closeai.moe</div>
          <div class="text-sm text-base-content/60">Think with care · Share with style</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="text-center mt-8 space-x-4">
        <button
          @click="exportCard"
          class="btn btn-primary btn-lg"
          :disabled="isExporting"
        >
          <span v-if="isExporting" class="loading loading-spinner loading-sm"></span>
          下载图片
        </button>
        <button
          @click="copyShareText"
          class="btn btn-outline btn-lg"
        >
          复制分享文本
        </button>
        <button
          @click="copyShareURL"
          class="btn btn-secondary btn-lg"
        >
          复制分享链接
        </button>
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

    // Use the basic usage pattern from snapdom docs
    const result = await snapdom(card)
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

const copyShareText = async () => {
  const shareText = `我的AI亲密度是 ${props.userData.dimensions.closeness}%！\n\n我的画像：${props.archetype.name}\n${props.archetype.description}\n\n快来测测你的吧：https://closeai.moe`

  try {
    await navigator.clipboard.writeText(shareText)
    alert('分享文本已复制到剪贴板！')
  } catch (error) {
    console.error('Copy failed:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = shareText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('分享文本已复制到剪贴板！')
  }
}

const copyShareURL = async () => {
  const shareURL = generateShareURL(props.userData)

  try {
    await navigator.clipboard.writeText(shareURL)
    alert('分享链接已复制到剪贴板！')
  } catch (error) {
    console.error('Copy failed:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = shareURL
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('分享链接已复制到剪贴板！')
  }
}
</script>

<style scoped>
.shadow-soft-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>

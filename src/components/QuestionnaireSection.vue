<template>
  <section class="py-8 md:py-16 px-4 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-base-content">
        问卷调查
      </h2>

      <!-- Usage Scenarios -->
      <div class="mb-8 md:mb-12">
        <h3 class="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-base-content">
          1. 你在这些场景里用 AI 的程度有多少？
        </h3>
        <div class="space-y-6">
          <div v-for="(scenario, key) in scenarios" :key="key" class="form-control">
            <label class="label">
              <span class="label-text text-base font-medium">{{ scenario.label }}</span>
              <span class="label-text-alt text-primary font-bold">{{ localUsageScenarios[key] }}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              :value="localUsageScenarios[key]"
              @input="updateUsageScenario(key, $event)"
              class="range range-primary"
            />
          </div>
        </div>
      </div>

      <!-- Model Preferences -->
      <div class="mb-8 md:mb-12">
        <h3 class="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-base-content">
          2. 你最常使用/最喜欢的模型或平台是？
        </h3>
        <p class="text-sm text-base-content/60 mb-4">最多选择 3 个</p>
        <div class="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
          <button
            v-for="model in availableModels"
            :key="model.id"
            @click="toggleModel(model.id)"
            :disabled="!userData.preferredModels.includes(model.id) && userData.preferredModels.length >= 3"
            :class="[
              'badge badge-lg cursor-pointer transition-all duration-200',
              userData.preferredModels.includes(model.id)
                ? 'badge-selected'
                : userData.preferredModels.length >= 3 
                  ? 'badge-unselected disabled'
                  : 'badge-unselected'
            ]"
          >
            {{ model.name }}
          </button>
        </div>

        <!-- Custom model input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">其他（自定义）</span>
          </label>
          <input
            type="text"
            v-model="userData.customModel"
            placeholder="输入其他模型名称"
            class="input input-bordered"
            maxlength="20"
          />
        </div>
      </div>

      <!-- Dimensions -->
      <div class="mb-8 md:mb-12">
        <h3 class="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-base-content">
          3. 请评估你在以下维度上的情况
        </h3>
        <div class="space-y-6">
          <div v-for="(dimension, key) in dimensions" :key="key" class="form-control">
            <label class="label">
              <span class="label-text text-base font-medium">{{ dimension.label }}</span>
              <span class="label-text-alt text-primary font-bold">{{ localDimensions[key] }}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              :value="localDimensions[key]"
              @input="updateDimension(key, $event)"
              class="range range-primary"
            />
            <div class="label">
              <span class="label-text-alt text-xs text-base-content/50">{{ dimension.description }}</span>
            </div>
          </div>
        </div>
      </div>


      <!-- Complete Button -->
      <div class="text-center">
        <button
          @click="completeQuestionnaire"
          class="btn btn-primary btn-lg px-8 md:px-12 py-3 text-base md:text-lg font-medium w-full sm:w-auto"
        >
          生成我的亲密画像
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete'])

// Local state for smooth slider interaction
const localUsageScenarios = ref({ ...props.userData.usageScenarios })
const localDimensions = ref({ ...props.userData.dimensions })

// Sync local state when props change externally
watch(() => props.userData.usageScenarios, (newVal) => {
  localUsageScenarios.value = { ...newVal }
}, { deep: true })

watch(() => props.userData.dimensions, (newVal) => {
  localDimensions.value = { ...newVal }
}, { deep: true })

const scenarios = {
  programming: { label: '编程 / 技术' },
  creative: { label: '写作 / 创意' },
  learning: { label: '学习 / 搜索' },
  chat: { label: '日常 / 聊天' },
  tasks: { label: '事务 / 打杂' }
}

const availableModels = [
  { id: 'openai', name: 'OpenAI GPT' },
  { id: 'anthropic', name: 'Anthropic Claude' },
  { id: 'google', name: 'Google Gemini' },
  { id: 'meta', name: 'Meta Llama' },
  { id: 'xai', name: 'xAI Grok' },
  { id: 'qwen', name: 'Qwen（通义）' },
  { id: 'doubao', name: 'Doubao（豆包）' },
  { id: 'deepseek', name: 'DeepSeek' },
  { id: 'glm', name: 'GLM（智谱）' },
  { id: 'moonshot', name: 'Moonshot Kimi（月之暗面）' }
]

const dimensions = {
  closeness: {
    label: 'Closeness（亲密度）',
    description: '你与AI的亲近程度'
  },
  dependence: {
    label: 'Dependence（依赖度）',
    description: '你对AI的依赖程度'
  },
  skepticism: {
    label: 'Skepticism（怀疑/校验强度）',
    description: '你对AI结果的怀疑和校验程度'
  }
}

const currentArchetype = ref(null)
let syncTimeout = null

const calculateArchetype = () => {
  const { dependence, skepticism } = props.userData.dimensions
  const closeness = props.userData.dimensions.closeness

  let archetypeName = ''
  let description = ''

  if (dependence >= 60 && skepticism >= 60) {
    archetypeName = '审慎共创者'
    description = '你在AI的帮助下高效工作，同时保持警惕'
  } else if (dependence >= 60 && skepticism < 60) {
    archetypeName = '依赖驱动者'
    description = 'AI已成为你日常生活的重要伙伴'
  } else if (dependence < 60 && skepticism >= 60) {
    archetypeName = '克制怀疑者'
    description = '你谨慎对待AI的使用，保持距离'
  } else {
    archetypeName = '观察者'
    description = '你对AI保持观察态度，尚未深入参与'
  }

  if (closeness >= 80) {
    description += '。留意自动驾驶模式，避免过度依赖'
  } else if (closeness <= 30) {
    description += '。也许可以尝试一些低风险应用'
  }

  return { name: archetypeName, description }
}

const syncToParent = () => {
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(() => {
    Object.assign(props.userData.usageScenarios, localUsageScenarios.value)
    Object.assign(props.userData.dimensions, localDimensions.value)
  }, 150)
}

const updateUsageScenario = (key, event) => {
  localUsageScenarios.value[key] = parseInt(event.target.value)
  syncToParent()
}

const updateDimension = (key, event) => {
  localDimensions.value[key] = parseInt(event.target.value)
  syncToParent()
}

const toggleModel = (modelId) => {
  const index = props.userData.preferredModels.indexOf(modelId)
  if (index > -1) {
    props.userData.preferredModels.splice(index, 1)
  } else if (props.userData.preferredModels.length < 3) {
    props.userData.preferredModels.push(modelId)
  }
}

// Watch for changes to update archetype preview
watch(
  () => [props.userData.dimensions.dependence, props.userData.dimensions.skepticism, props.userData.dimensions.closeness],
  () => {
    currentArchetype.value = calculateArchetype()
  },
  { immediate: true }
)

const completeQuestionnaire = () => {
  emit('complete', props.userData)
}
</script>

<style scoped>
.range {
  height: 16px;
  border-radius: 8px;
  background: hsl(var(--bc) / 0.2);
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  touch-action: pan-x;
  -webkit-user-select: none;
  user-select: none;
}

.range::-webkit-slider-track {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(to right, #3b82f6 0%, #3b82f6 var(--range-shdw), #e5e7eb var(--range-shdw), #e5e7eb 100%);
}

.range::-webkit-slider-thumb {
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background: #3b82f6;
  border: 3px solid white;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  z-index: 1;
}

.range::-moz-range-track {
  height: 16px;
  border-radius: 8px;
  background: #e5e7eb;
  border: none;
}

.range::-moz-range-progress {
  height: 16px;
  border-radius: 8px;
  background: #3b82f6;
}

.range::-moz-range-thumb {
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background: #3b82f6;
  border: 3px solid white;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  border: none;
}

/* Enhanced badge styles for better multi-selection visibility */
.badge-selected {
  background: #3b82f6 !important;
  color: white !important;
  border: 3px solid #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  transform: scale(1.05) !important;
  font-weight: 700 !important;
}

.badge-unselected {
  background: hsl(var(--b1)) !important;
  color: hsl(var(--bc) / 0.7) !important;
  border: 2px solid hsl(var(--bc) / 0.2) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  font-weight: 500 !important;
}

.badge-unselected:hover {
  background: hsl(var(--p) / 0.1) !important;
  border-color: hsl(var(--p) / 0.6) !important;
  color: hsl(var(--p)) !important;
  transform: scale(1.02) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Disabled state for when 3 models are selected */
.badge-unselected.disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.badge-unselected.disabled:hover {
  transform: none !important;
  background: hsl(var(--b1)) !important;
  border-color: hsl(var(--bc) / 0.2) !important;
  color: hsl(var(--bc) / 0.7) !important;
}
</style>

<template>
  <section class="py-16 px-4 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-3xl font-bold text-center mb-12 text-base-content">
        问卷调查
      </h2>

      <!-- Usage Scenarios -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-6 text-base-content">
          1. 你在这些场景里用 AI 的程度有多少？
        </h3>
        <div class="space-y-6">
          <div v-for="(scenario, key) in scenarios" :key="key" class="form-control">
            <label class="label">
              <span class="label-text text-base font-medium">{{ scenario.label }}</span>
              <span class="label-text-alt text-primary font-bold">{{ userData.usageScenarios[key] }}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              :value="userData.usageScenarios[key]"
              @input="updateUsageScenario(key, $event)"
              class="range range-primary"
            />
          </div>
        </div>
      </div>

      <!-- Model Preferences -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-6 text-base-content">
          2. 你最常使用/最喜欢的模型或平台是？
        </h3>
        <p class="text-sm text-base-content/60 mb-4">最多选择 3 个</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="model in availableModels"
            :key="model.id"
            @click="toggleModel(model.id)"
            :class="[
              'badge badge-lg cursor-pointer transition-all',
              userData.preferredModels.includes(model.id)
                ? 'badge-primary text-primary-content'
                : 'badge-outline hover:badge-primary/20'
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
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-6 text-base-content">
          3. 请评估你在以下维度上的情况
        </h3>
        <div class="space-y-6">
          <div v-for="(dimension, key) in dimensions" :key="key" class="form-control">
            <label class="label">
              <span class="label-text text-base font-medium">{{ dimension.label }}</span>
              <span class="label-text-alt text-primary font-bold">{{ userData.dimensions[key] }}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              :value="userData.dimensions[key]"
              @input="updateDimension(key, $event)"
              class="range range-primary"
            />
            <div class="label">
              <span class="label-text-alt text-xs text-base-content/50">{{ dimension.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-time Archetype Preview -->
      <div v-if="currentArchetype" class="alert alert-info mb-8">
        <div>
          <h4 class="font-bold">{{ currentArchetype.name }}</h4>
          <p>{{ currentArchetype.description }}</p>
        </div>
      </div>

      <!-- Complete Button -->
      <div class="text-center">
        <button
          @click="completeQuestionnaire"
          class="btn btn-primary btn-lg px-12 py-3 text-lg font-medium"
        >
          生成我的亲密画像
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete'])

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

const updateUsageScenario = (key, event) => {
  props.userData.usageScenarios[key] = parseInt(event.target.value)
}

const updateDimension = (key, event) => {
  props.userData.dimensions[key] = parseInt(event.target.value)
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
  height: 6px;
}

.range::-webkit-slider-thumb {
  height: 20px;
  width: 20px;
}
</style>

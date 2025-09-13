<script setup>
import { ref, onMounted, watch } from 'vue'
import HeroSection from './components/HeroSection.vue'
import NudgeSection from './components/NudgeSection.vue'
import QuestionnaireSection from './components/QuestionnaireSection.vue'
import ResultCard from './components/ResultCard.vue'
import FooterSection from './components/FooterSection.vue'
import { saveUserData, loadUserData, decodeUserDataFromURL } from './utils/storage.js'

// User responses data
const userData = ref({
  usageScenarios: {
    programming: 50,
    creative: 50,
    learning: 50,
    chat: 50,
    tasks: 50
  },
  preferredModels: [],
  customModel: '',
  dimensions: {
    closeness: 50,
    dependence: 50,
    skepticism: 50
  }
})

const showResult = ref(false)
const archetype = ref(null)

// Load data on mount
onMounted(() => {
  // Check for shared data in URL first
  const urlParams = new URLSearchParams(window.location.search)
  const sharedData = urlParams.get('data')
  
  if (sharedData) {
    const decodedData = decodeUserDataFromURL(sharedData)
    if (decodedData) {
      userData.value = decodedData
      // Auto-calculate and show result for shared data
      archetype.value = calculateArchetype(decodedData)
      showResult.value = true
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }
  }
  
  // Otherwise load from localStorage
  const savedData = loadUserData()
  if (savedData) {
    userData.value = savedData
  }
})

// Save data whenever it changes
watch(userData, (newData) => {
  saveUserData(newData)
}, { deep: true })

const startQuestionnaire = () => {
  // Scroll to questionnaire section
  document.getElementById('questionnaire')?.scrollIntoView({ behavior: 'smooth' })
}

const onQuestionnaireComplete = (data) => {
  userData.value = data
  // Calculate archetype based on data
  archetype.value = calculateArchetype(data)
  showResult.value = true
  // Scroll to result
  setTimeout(() => {
    document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}

const calculateArchetype = (data) => {
  const { dependence, skepticism } = data.dimensions
  const closeness = data.dimensions.closeness

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
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <HeroSection @start="startQuestionnaire" />
    <NudgeSection />
    <QuestionnaireSection
      id="questionnaire"
      :userData="userData"
      @complete="onQuestionnaireComplete"
    />
    <ResultCard
      v-if="showResult"
      id="result"
      :userData="userData"
      :archetype="archetype"
    />
    <FooterSection />
  </div>
</template>

<style>
/* Global styles for daisyUI dim theme */
body {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>

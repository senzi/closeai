<script setup lang="ts">
import { ref, onMounted } from 'vue'

const timelineItems = [
  {
    year: 'Past',
    title: 'The Era of Closed AI',
    description: 'AI development was characterized by closed systems, proprietary algorithms, and limited access. The gap between AI capabilities and human needs continued to widen.',
    icon: '🔒'
  },
  {
    year: 'Present',
    title: 'The Transition Period',
    description: 'We are witnessing a growing demand for transparent and accessible AI. However, major players still maintain their walled gardens.',
    icon: '⚡'
  },
  {
    year: '2024',
    title: 'Close AI Emerges',
    description: 'We introduce a new paradigm: AI that truly stays close to human needs. Our commitment to openness and accessibility marks a new chapter in AI development.',
    icon: '🌟'
  },
  {
    year: 'Near Future',
    title: 'Community-Driven Innovation',
    description: 'AI development becomes increasingly collaborative. Open-source contributions and community feedback directly shape the evolution of AI tools.',
    icon: '🤝'
  },
  {
    year: 'Vision',
    title: 'AI That Understands',
    description: 'AI systems that not only serve but truly understand human needs. Technology that adapts to people, not the other way around.',
    icon: '🎯'
  }
]

const isVisible = ref(false)

onMounted(() => {
  // 添加一个小延迟使动画更自然
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="vision-container">
    <section class="vision-hero">
      <h1>Our Vision for AI</h1>
      <p class="lead">From Closed Systems to Close Relationships</p>
    </section>

    <section class="timeline-section" :class="{ 'visible': isVisible }">
      <div class="timeline">
        <div
          v-for="(item, index) in timelineItems"
          :key="index"
          class="timeline-item"
          :style="{ '--delay': index * 0.2 + 's' }"
        >
          <div class="timeline-icon">{{ item.icon }}</div>
          <div class="timeline-content">
            <div class="timeline-year">{{ item.year }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="vision-conclusion">
      <div class="conclusion-content">
        <h2>Join Us in Shaping the Future</h2>
        <p>We believe that the future of AI lies not in creating barriers, but in breaking them down. Our vision is to develop AI that truly understands and serves human needs, making technology more accessible and meaningful for everyone.</p>
        <router-link to="/tools" class="cta-button">Explore Our Tools</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.vision-container {
  padding-top: 5rem;
}

.vision-hero {
  background: #ffffff;
  padding: 6rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.vision-hero h1 {
  font-size: 3rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.25rem;
  color: #4a4a4a;
  max-width: 600px;
  margin: 0 auto;
}

.timeline-section {
  padding: 6rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.timeline-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}

.timeline-item {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(20px);
}

.timeline-section.visible .timeline-item {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: var(--delay);
}

.timeline-icon {
  width: 48px;
  height: 48px;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.timeline-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-left: 2rem;
  flex: 1;
  max-width: 500px;
}

.timeline-year {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4a4a4a;
  margin-bottom: 0.5rem;
}

.timeline-content h3 {
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.timeline-content p {
  color: #4a4a4a;
  line-height: 1.6;
}

.vision-conclusion {
  background: #ffffff;
  padding: 6rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.conclusion-content {
  max-width: 800px;
  margin: 0 auto;
}

.conclusion-content h2 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.conclusion-content p {
  color: #4a4a4a;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cta-button:hover {
  background: #000000;
  transform: translateY(-2px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .vision-hero {
    padding: 4rem 1rem;
  }
  
  .vision-hero h1 {
    font-size: 2.5rem;
  }
  
  .timeline-section {
    padding: 4rem 1rem;
  }
  
  .timeline::before {
    left: 24px;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 24px;
  }
  
  .timeline-content {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
  }
  
  .vision-conclusion {
    padding: 4rem 1rem;
  }
  
  .conclusion-content h2 {
    font-size: 1.75rem;
  }
}
</style>

<template>
  <section class="hero min-h-screen bg-gradient-to-br from-base-100 to-base-200">
    <div class="hero-content text-center px-4">
      <div class="max-w-md w-full">
        <h1 class="hero-title font-bold mb-4 text-primary">
          closeai.moe
        </h1>
        <h2 class="hero-subtitle font-light mb-8 text-base-content">
          How Close Are You to AI?
        </h2>
        <button
          @click="$emit('start')"
          class="btn btn-primary btn-lg px-8 py-3 text-lg font-medium w-full sm:w-auto"
        >
          开始测一测
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
.hero-title {
  font-size: 3.75rem; /* text-6xl */
}

.hero-subtitle {
  font-size: 1.5rem; /* text-2xl */
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem; /* Smaller on tablets */
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem; /* Even smaller on phones */
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }
  
  .hero-content {
    padding: 0.5rem;
  }
  
  .btn {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
}
</style>

<template>
  <section class="hero min-h-screen bg-gradient-to-br from-base-100 to-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-6xl font-bold mb-4 text-primary">
          closeai.moe
        </h1>
        <h2 class="text-2xl font-light mb-8 text-base-content">
          How Close Are You to AI?
        </h2>
        <button
          @click="$emit('start')"
          class="btn btn-primary btn-lg px-8 py-3 text-lg font-medium"
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
/* Additional styling if needed */
</style>

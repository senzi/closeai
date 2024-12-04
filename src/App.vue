<script setup lang="ts">
import Logo from './assets/logo.svg'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <header>
      <nav>
        <div class="logo">
          <RouterLink to="/">
            <img :src="Logo" alt="Close AI Logo" class="logo-icon" />
            <span>Close AI</span>
          </RouterLink>
        </div>
        <div class="nav-links">
          <RouterLink to="/tools">Tools</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/vision">Vision</RouterLink>
        </div>
      </nav>
    </header>

    <main>
      <RouterView></RouterView>
    </main>

    <footer>
      <p>&copy; 2024 Close AI. Making AI truly accessible.</p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
}

header {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
}

nav {
  max-width: 1200px;
  width: 100%;
  margin: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #1a1a1a;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #4a4a4a;
  font-weight: 500;
  transition: color 0.2s ease;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #1a1a1a;
}

main {
  flex: 1;
  padding-top: 5rem;
}

.hero {
  text-align: center;
  padding: 8rem 2rem 6rem;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.25rem;
  color: #4a4a4a;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cta-primary, .cta-secondary {
  padding: 0.8rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cta-primary {
  background: #1a1a1a;
  color: white;
}

.cta-secondary {
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
}

.cta-primary:hover {
  background: #000000;
  transform: translateY(-2px);
}

.cta-secondary:hover {
  background: rgba(26, 26, 26, 0.05);
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.feature-card p {
  color: #4a4a4a;
  line-height: 1.6;
}

footer {
  text-align: center;
  padding: 2rem;
  background: #ffffff;
  color: #4a4a4a;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .nav-links {
    display: none;
  }

  header {
    padding: 0.75rem;
  }

  nav {
    margin: 0 1rem;
  }

  .features {
    padding: 2rem 1rem;
  }
}
</style>

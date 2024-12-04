<template>
  <section class="hero">
    <h1>AI That Stays Close</h1>
    <p class="subtitle">Bringing artificial intelligence closer to human needs</p>
    <div class="cta-buttons">
      <router-link to="/tools" class="cta-primary">Explore Tools</router-link>
      <router-link to="/about" class="cta-secondary">Learn More</router-link>
    </div>
  </section>

  <section class="features">
    <div class="feature-card">
      <h3>Truly Open</h3>
      <p>We believe in transparency and genuine openness in AI development</p>
    </div>
    <div class="feature-card">
      <h3>Human-Centric</h3>
      <p>Built with real human needs in mind, not corporate interests</p>
    </div>
    <div class="feature-card">
      <h3>Close to You</h3>
      <p>AI that adapts to your needs, not the other way around</p>
    </div>
  </section>
</template>

<style scoped>
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

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
}
</style>

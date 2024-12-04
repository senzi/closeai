<template>
  <div class="about-container">
    <section class="about-hero">
      <h1>About Close AI</h1>
      <p class="lead">Building AI that truly understands and serves human needs</p>
    </section>
    
    <section class="about-content">
      <div class="content-block">
        <h2>Our Vision</h2>
        <p>At Close AI, we believe that artificial intelligence should be developed with transparency, openness, and a deep understanding of human needs. We're committed to creating AI tools that are not just powerful, but also accessible and truly open to everyone.</p>
      </div>
      
      <div class="content-block">
        <h2>Why "Close"?</h2>
        <p>The name "Close AI" reflects our commitment to bringing AI closer to people. While others may distance themselves from the community, we believe in creating a tight-knit relationship between AI development and the people it serves.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-container {
  padding-top: 5rem;
}

.about-hero {
  background: #ffffff;
  padding: 6rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.about-hero h1 {
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

.about-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.content-block {
  margin-bottom: 3rem;
}

.content-block h2 {
  font-size: 1.75rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.content-block p {
  color: #4a4a4a;
  line-height: 1.8;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .about-hero {
    padding: 4rem 1rem;
  }
  
  .about-hero h1 {
    font-size: 2.5rem;
  }
  
  .about-content {
    padding: 2rem 1rem;
  }
}
</style>

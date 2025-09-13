<template>
  <footer class="footer-section">
    <div class="footer-content">
      <div class="footer-links">
        <a 
          href="https://github.com/senzi/closeai" 
          target="_blank" 
          rel="noopener noreferrer"
          class="footer-link github-link"
        >
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        
        <a 
          href="https://weibo.com/u/7402396589" 
          target="_blank" 
          rel="noopener noreferrer"
          class="footer-link weibo-link"
        >
          @阿尼亚是安妮亞
        </a>
      </div>
      
      <div class="footer-info">
        <span class="license">MIT License</span>
        <span class="divider">•</span>
        <span class="vibe">vibe coding</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-section {
  margin-top: 4rem;
  padding: 2rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.05));
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.footer-link:hover {
  color: #646cff;
  background: rgba(100, 108, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.2);
}

.github-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  flex-wrap: wrap;
  justify-content: center;
}

.license, .vibe {
  font-weight: 500;
}

.divider {
  opacity: 0.6;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .footer-section {
    margin-top: 3rem;
    padding: 1.5rem 1rem;
  }
  
  .footer-links {
    gap: 1rem;
  }
  
  .footer-link {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
  
  .github-icon {
    width: 16px;
    height: 16px;
  }
  
  .footer-info {
    gap: 0.5rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .footer-section {
    margin-top: 2rem;
    padding: 1rem 0.5rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
  
  .footer-link {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .divider {
    display: none;
  }
}

/* Light mode support */
@media (prefers-color-scheme: light) {
  .footer-section {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02));
  }
  
  .footer-link {
    color: rgba(0, 0, 0, 0.7);
    background: rgba(0, 0, 0, 0.05);
  }
  
  .footer-link:hover {
    color: #646cff;
    background: rgba(100, 108, 255, 0.1);
  }
  
  .footer-info {
    color: rgba(0, 0, 0, 0.5);
  }
}
</style>

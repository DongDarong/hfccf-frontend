<template>
  <div class="brand-header">
    <div class="brand-header__logo">
      <div class="brand-header__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
          <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="brand-header__title">
        <!-- Split brand text to apply product colors per segment. -->
        <span class="brand-header__edu">Edu</span><span class="brand-header__sport">Sport</span><span class="brand-header__pro">Pro</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-header {
  padding: 0.25rem 0;
}

.brand-header__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-header__icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--hope-o-cyan-blue) 0%, #0087b8 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 174, 239, 0.25);
  flex-shrink: 0;
}

.brand-header__icon svg {
  width: 100%;
  height: 100%;
}

.brand-header__title {
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  display: flex;
}

.brand-header__edu {
  color: var(--hope-h-lime-green);
}

.brand-header__sport {
  color: var(--hope-o-cyan-blue);
}

.brand-header__pro {
  color: var(--hope-p-vibrant-red);
}
</style>

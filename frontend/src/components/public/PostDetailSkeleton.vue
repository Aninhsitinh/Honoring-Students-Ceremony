<!-- PostDetailSkeleton.vue -->
<template>
  <div class="post-detail-skeleton">
    <!-- Hero Skeleton -->
    <div class="sk-hero">
      <div class="container hero-content">
        <div class="meta-row">
          <div class="sk sk-badge"></div>
          <div class="sk sk-date"></div>
        </div>
        <div class="sk sk-title"></div>
        <div class="sk sk-title short"></div>
      </div>
    </div>

    <!-- Body Skeleton -->
    <article class="container">
      <div class="post-body-sk glass">
        <div class="sk sk-line"></div>
        <div class="sk sk-line"></div>
        <div class="sk sk-line"></div>
        <div class="sk sk-line mid"></div>
        <br><br>
        <div class="sk sk-img"></div>
        <br><br>
        <div class="sk sk-line"></div>
        <div class="sk sk-line short"></div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.sk {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.12) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

.sk-hero {
  height: 400px;
  background: var(--color-bg-card);
  display: flex;
  align-items: flex-end;
  padding-bottom: 3rem;
}

.hero-content {
  width: 100%;
}

.meta-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.sk-badge { height: 24px; width: 100px; border-radius: 20px; }
.sk-date { height: 20px; width: 120px; }
.sk-title { height: 48px; width: 80%; margin-bottom: 0.5rem; }
.sk-title.short { width: 50%; }

.post-body-sk {
  margin-top: -3rem;
  position: relative;
  z-index: 10;
  padding: 3rem;
  border-radius: var(--radius-xl);
}

.post-body-sk .sk {
  background: linear-gradient(
    90deg,
    var(--color-bg-card) 25%,
    var(--color-bg-card-hover) 50%,
    var(--color-bg-card) 75%
  );
  background-size: 200% 100%;
}

.sk-line { height: 16px; width: 100%; margin-bottom: 0.8rem; }
.sk-line.mid { width: 75%; }
.sk-line.short { width: 40%; }
.sk-img { height: 300px; width: 100%; border-radius: 12px; }
</style>

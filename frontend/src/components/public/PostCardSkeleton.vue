<!-- PostCardSkeleton.vue – mirrors the exact layout of PostCard.vue -->
<template>
  <div class="post-card card skeleton-card">
    <!-- thumbnail -->
    <div class="sk sk-thumbnail"></div>
    <!-- body -->
    <div class="post-body">
      <div class="post-meta-sk">
        <div class="sk sk-date"></div>
        <div class="sk sk-badge"></div>
      </div>
      <div class="sk sk-title"></div>
      <div class="sk sk-title short"></div>
      <div class="sk sk-excerpt"></div>
      <div class="sk sk-excerpt mid"></div>
      <div class="sk sk-excerpt short"></div>
    </div>
  </div>
</template>

<style scoped>
.sk {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    var(--color-bg-card) 25%,
    var(--color-bg-card-hover) 50%,
    var(--color-bg-card) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-card {
  cursor: default;
  pointer-events: none;
  overflow: hidden;
}

/* Thumbnail */
.sk-thumbnail {
  width: 100%;
  height: 200px;
  border-radius: 0;
}

/* Body */
.post-body {
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.post-meta-sk {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.2rem;
}

.sk-date   { height: 12px; width: 80px; }
.sk-badge  { height: 12px; width: 60px; border-radius: 20px; }
.sk-title  { height: 18px; width: 90%; }
.sk-title.short { width: 65%; }
.sk-excerpt { height: 12px; width: 100%; }
.sk-excerpt.mid   { width: 85%; }
.sk-excerpt.short { width: 55%; }
</style>

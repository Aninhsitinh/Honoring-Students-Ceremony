<!-- StudentCardSkeleton.vue – mirrors the exact layout of StudentCard.vue -->
<template>
  <div class="student-card card skeleton-card">
    <!-- image area -->
    <div class="card-image-wrap">
      <div class="sk sk-image"></div>
    </div>
    <!-- body -->
    <div class="card-body">
      <div class="sk sk-name"></div>
      <div class="sk sk-code"></div>
      <div class="sk sk-dept"></div>
      <div class="sk sk-desc"></div>
      <div class="sk sk-desc short"></div>
    </div>
  </div>
</template>

<style scoped>
/* Shared shimmer base */
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

/* Image */
.sk-image {
  width: 100%;
  height: 200px;
  border-radius: 0;
}

/* Body rows */
.card-body {
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.sk-name  { height: 18px; width: 70%; }
.sk-code  { height: 13px; width: 45%; }
.sk-dept  { height: 13px; width: 80%; }
.sk-desc  { height: 12px; width: 100%; }
.sk-desc.short { width: 60%; }
</style>

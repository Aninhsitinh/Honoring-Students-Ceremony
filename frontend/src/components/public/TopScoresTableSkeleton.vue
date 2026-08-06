<!-- TopScoresTableSkeleton.vue – shimmering table rows while scores load -->
<template>
  <div class="scores-table-wrap glass">
    <table class="scores-table">
      <thead>
        <tr>
          <th v-for="h in headers" :key="h">
            <div class="sk sk-th"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in rows" :key="n" class="sk-row">
          <td><div class="sk sk-cell wide"></div></td>
          <td><div class="sk sk-cell mid"></div></td>
          <td><div class="sk sk-cell short"></div></td>
          <td><div class="sk sk-cell mid"></div></td>
          <td><div class="sk sk-cell score"></div></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  rows: { type: Number, default: 6 },
  headers: { type: Array, default: () => ['', '', '', '', ''] },
})
</script>

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

.sk-th    { height: 11px; width: 70%; }

.sk-row td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.sk-cell       { height: 13px; }
.sk-cell.wide  { width: 160px; }
.sk-cell.mid   { width: 110px; }
.sk-cell.short { width: 80px; }
.sk-cell.score { width: 50px; border-radius: 20px; }

/* inherit table styles from parent */
.scores-table { width: 100%; border-collapse: collapse; }
</style>

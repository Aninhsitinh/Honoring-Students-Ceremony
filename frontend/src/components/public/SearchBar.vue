<template>
  <div class="search-bar glass">
    <span class="search-icon" v-html="searchIcon"></span>
    <input
      type="text"
      class="search-input"
      :placeholder="$t('home.search_placeholder')"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button v-if="modelValue" class="search-clear" @click="$emit('update:modelValue', '')" v-html="xIcon"></button>
  </div>
</template>

<script setup>
import icons from '../../utils/icons'

defineProps({
  modelValue: { type: String, default: '' },
})
defineEmits(['update:modelValue'])

const searchIcon = icons.search
const xIcon = icons.x
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  max-width: 500px;
  margin: 0 auto;
  transition: all var(--transition-base);
}

.search-bar:focus-within {
  border-color: var(--color-text-accent);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.search-icon {
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-clear {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.search-clear:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

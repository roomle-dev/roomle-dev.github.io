<template>
  <div class="gh-link" :class="positionClasses">
    <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="">
    <a :href="link" target="_blank">Source</a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  link: string
  position?: 'top left' | 'top right' | 'bottom left' | 'bottom right'
}>(), {
  position: 'top left'
})

const positionClasses = computed(() => {
  const [vertical, horizontal] = props.position.split(' ')
  return `pos-${vertical}-${horizontal}`
})
</script>

<style scoped>

img {
  height: 1.7rem;
}

.gh-link {
  position: fixed;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;

  height: 3rem;
  width: 8rem;

  color: #000;
  background: #fff;

  box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);

  z-index: 999;
}

/* Top Left */
.pos-top-left {
  top: 0;
  left: 0;
  border-bottom-right-radius: 0.6rem;
}

/* Top Right */
.pos-top-right {
  top: 0;
  right: 0;
  border-bottom-left-radius: 0.6rem;
}

/* Bottom Left */
.pos-bottom-left {
  bottom: 0;
  left: 0;
  border-top-right-radius: 0.6rem;
}

/* Bottom Right */
.pos-bottom-right {
  bottom: 0;
  right: 0;
  border-top-left-radius: 0.6rem;
}
</style>

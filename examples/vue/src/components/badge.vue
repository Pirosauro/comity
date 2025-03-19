<template>
  <span>Hey {{ env }}!</span>
</template>

<script setup>
defineProps({
  env: {
    type: String,
    required: true,
  },
});
</script>

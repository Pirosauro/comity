<script setup lang="ts">
import BadgeIsland from '../badge.island.js';
</script>

<template>
  <div>
    <BadgeIsland $client:load client="hydrated" server="SSR" />
  </div>
</template>

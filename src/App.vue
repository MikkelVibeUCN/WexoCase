<template>
  <div class="layout-container">
    <navbar />

    <div class="page-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath" />
      </router-view>
    </div>
    <customFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import navbar from './components/navbar.vue'
import customFooter from './components/footer.vue'

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.page-content {
  padding-top: 64px; /* leaves space for navbar */
  padding-bottom: 1.4em; /* leaves space for footer */
}

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex-grow: 1; /* this pushes the footer down */
  padding-top: 64px; /* adjust based on your navbar */
  padding-bottom: 1.4em;
}
</style>
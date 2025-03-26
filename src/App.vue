<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

</script>

<template>
  <Navbar/>
  <div class="page-content">
    <RouterView/>
  </div>
  <Footer/>
</template>

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
  padding-top: 64px;
  padding-bottom: 200px;
}
</style>

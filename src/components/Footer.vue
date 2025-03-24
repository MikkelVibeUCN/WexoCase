<template>
    <footer class="footer">
      <div class="footer-left">
        <img src="/Icon.png" alt="Logo" class="logo" />
        <div class="social-icons">
          <img src="./icons/Instagram.svg" alt="Instagram" />
          <img src="./icons/Linkedin.svg" alt="LinkedIn" />
          <img src="./icons/X.svg" alt="X" />
        </div>
      </div>
  
      <div class="footer-right">
        <div class="footer-title">Explore</div>
        <router-link to="/genres" class="footer-link">Genres</router-link>
        <router-link to="/popular" class="footer-link">Popular</router-link>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  .footer {
    background-color: #000000;
    border-top: 7px solid #0D0D0D;
    width: 100vw;
    bottom: 0;
    position: fixed;
    margin-left: -50vw;
    margin-right: -50vw;

    left: 50%;
    right: 50%;


    display: flex;
    align-items: center;
    justify-content: space-between;
    

    box-sizing: border-box;
    padding: 0.5rem 1rem;
  }
  
  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .logo {
    width: 30px;
    height: auto;
  }
  
  .social-icons {
    display: flex;
    gap: 1rem;
  }
  
  .social-icons img {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  
  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    text-align: right;
  }
  
  .footer-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .footer-link {
    text-decoration: none;
    color: white;
    font-size: 0.95rem;
  }
  
  .footer-link:hover {
    text-decoration: underline;
  }
  </style>
  
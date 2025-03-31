<template>
    <div class="footer">
      <div class="footer-left">
        <img src="/Icon.png" alt="Logo" class="logo" />
        <div class="social-icons">
          <img src="/Instagram.svg" alt="Instagram" />
          <img src="/Linkedin.svg" alt="LinkedIn" />
          <img src="/X.svg" alt="X" />
        </div>
      </div>
  
      <div class="footer-right">
        <div class="footer-title">Explore</div>
        <router-link to="/genres" class="footer-link">Genres</router-link>
        <router-link to="/popular" class="footer-link">Popular</router-link>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  .footer {
    width: 100%;
    height: 15rem;
    background-color: #000000;
    border: 7px solid #0D0D0D;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }

  
  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 3rem;
  }
  
  .logo {
    width: 25%;
    height: auto;
    display: flex;
  }
  
  .social-icons {
    display: flex;
    gap: 1rem;
  }
  
  .social-icons img {
    width: 3%;
    height: auto;
    cursor: pointer;
  }
  
  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 3rem;
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
  
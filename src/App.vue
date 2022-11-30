<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  const pluginCCapture = document.createElement("script");
  pluginCCapture.setAttribute(
    "src",
    "/CCapture.all.min.js"
  ); 
  document.head.appendChild(pluginCCapture); 
})
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <!--<RouterLink to="/about">About</RouterLink>-->
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  text-align:center;
  padding: 20px 0px;
}

nav > a {
  padding: 0 10px;
}
</style>

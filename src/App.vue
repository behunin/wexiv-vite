<script setup>
import HelloWorld from './components/HelloWorld.vue'
import ReloadPromptVue from './components/ReloadPrompt.vue';
</script>

<template>
  <header class="mx-3">
    <p>This is a simple tool to read metadata from your images.</p>
    <p>Created using emscripten to compile Exiv2 to WebAssembly.</p>
    <p>For your viewing pleasure at any time you visit this site, metadata is locally stored using IndexedDB.</p>
    <p>If you have already copied your metadata you can skip to step 3.</p>
  </header>
  <HelloWorld />
  <ReloadPromptVue />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #2c3e50;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2c3e50;
  color: aliceblue;
  margin-top: 6px;
}
</style>

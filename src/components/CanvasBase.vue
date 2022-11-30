<script setup>
import { computed, watch, reactive } from 'vue'
import CanvasThree from './CanvasThree.vue'

import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute();
const router = useRouter();
const state = reactive({ 
  record: "not-recording",
  trigger:0
})

const recordConfig = {};
const stopFrame = 0;

function recording(e) {
  const way = e.target.id;
  if (way === 'record-pic') {
    state.recordConfig = { 
      framerate: 30,
      name: `canvas-${route.params.id}_${Math.random().toFixed(4)}`,
      startTime: 1,
      format: 'png'
    }
    state.stopFrame = 1;
    state.record = "recording-pic";
  } else {
    state.recordConfig = { 
      framerate: 30,
      name: `canvas-${route.params.id}_${Math.random().toFixed(4)}`,
      startTime: 1,
      // motionBlurFrames: 1,
      format: 'gif',
      workersPath: '/'
    }
    state.stopFrame = 50;
    state.record = "recording-gif";
  }
  state.trigger++;
}

function initialize(e) {
  state.record = "not-recording";
}

const prev = computed(() => {
  return `/${Number(route.params.id) - 1}`
})
const next = computed(() => {
  return `/${Number(route.params.id) + 1}`
})
</script>

<template>
  <div>
    <div class="canvas-header">
      Canvas {{ $route.params.id }}
    </div>
    <CanvasThree 
      :id="$route.params.id"
      :record="state.record"
      :recordConfig="state.recordConfig"
      :stopFrame="state.stopFrame"
      :trigger="state.trigger"
    />
  </div>

  <footer>
    <div>
      <nav>
        <RouterLink @click="initialize" :to="prev">prev</RouterLink>
        <RouterLink @click="initialize" :to="next">next</RouterLink>
      </nav>
    </div>
    <div class="btn-container">
      <button id="record-pic" @click="recording" >record pics</button>
      <button id="record-gif" @click="recording" >record gif</button>
    </div>
  </footer>
</template>

<style scoped>
.canvas-header {
  text-align:center;
}

footer {
  text-align:center;
  padding: 0px 0px;
}

nav > a {
  padding: 0 10px;
}

button {
  margin:5px;
  padding:3px 6px;
  outline:0;
  border: 2px solid #222;
  cursor:pointer;
  background-color:#fff;
  font-family: monospace;
}

.btn-container {
  margin:10px;
}
</style>

<script setup>

import { computed, watch, onUnmounted, onMounted } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  record: {
    type: String
  },
  recordConfig: {
    type: Object,
    default: () => ({}),
  },
  stopFrame: {
    type: Number
  },
  trigger: {
    type: Number
  }
})

const canvasId = computed(() => {
  return `canvas-${props.id}`
});

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
 
let vert, frag;

let stats;
let scene, renderer, camera;
let materialPlane;

let frame = 0;

const width = 500;
const height = 500;

let recordingStop = 0;
let capturer, canvas;

let requestID;

function init() {

  frame = 0;
  recordingStop = 0;

  const vertexShader = vert.default;
  const fragmentShader = frag.default;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    width / height,
    1,
    3000
  );
  canvas = document.getElementById(canvasId._value);
  
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(width, height);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // plane
  const geometryPlane = new THREE.PlaneGeometry(10,10);
  materialPlane = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0 },
    }
  })
  const plane = new THREE.Mesh(geometryPlane, materialPlane);
  plane.position.set(0, 0, 0);
  scene.add(plane);

  camera.position.set(0, 0, 7);
  camera.lookAt( scene.position );

  const controls = new OrbitControls( camera, renderer.domElement );

  stats = new Stats();
  document.body.appendChild( stats.dom );

  if (props.record != 'not-recording') {
    capturer = new CCapture(JSON.parse(JSON.stringify(props.recordConfig)));
    console.log(JSON.parse(JSON.stringify(props.recordConfig))) 
    capturer.start();
  }
}

function animate() {
  
  // requestID = requestAnimationFrame(animate);
  requestAnimationFrame(animate);
  frame+=1;
  const time = - performance.now() * 0.001;
  materialPlane.uniforms.u_time.value = time;

  renderer.render(scene, camera);
  stats.update();

  if (props.record != 'not-recording' && recordingStop < 1) {
    capturer.capture(canvas);
    if (frame > props.stopFrame) {
      capturer.stop();
      capturer.save();
      recordingStop++;
    }
  }

}

onMounted(() => {
  (async () => {
    vert = await import(`../assets/glsl/${props.id}/shader.vert.js`);
    frag = await import(`../assets/glsl/${props.id}/shader.frag.js`);
    init();
    animate();
  })(); 
})

/*
onUnmounted(() => {
  // cancelAnimationFrame( requestID );
})
*/

watch(() => props.id, (newValue, oldValue) => {
  // scene pre-cleaning
  scene.traverse(function ( object ) {
    if ( object.geometry ) {
      object.geometry.dispose();
    }
    if ( object.material ) {
      object.material.dispose();
    }
  });
  // scene hard-cleaning
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
  // renderer cleaning
  renderer.dispose();
  renderer.context=undefined;
  renderer.domElement=undefined;

  (async () => {
    vert = await import(`../assets/glsl/${props.id}/shader.vert.js`);
    frag = await import(`../assets/glsl/${props.id}/shader.frag.js`);
    init();
    // animate();
  })(); 
})

watch(() => props.trigger, (newValue, oldValue) => {
  init();
})

</script>

<template>
  <div class="canvas-container">
    <canvas 
      :id="canvasId"
      :style="{ width:width+'px', height:height+'px'}"
    >
    </canvas>
  </div>
</template>

<style scoped>
.canvas-container {
  text-align: center;
  padding:20px;
}
</style>
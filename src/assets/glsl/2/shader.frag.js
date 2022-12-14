export default /* glsl */`





// #ifdef GL_ES
// precision mediump float;
// #endif

varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;

float random (vec2 st) {
  return fract(sin(dot(st.xy,
                        vec2(12.9808,78.233)))*
      43758.5453123);
}

vec2 random2(vec2 st){
  st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float line2 (vec2 st, float position, float thickness, vec3 colorH) {
  float t = abs(1.0-sin(u_time));
  float noisyPos = noise(st*1.);
  position *= noisyPos * 1. * t;
  float fi = step(1.- position, st.y) + 1. - step(1. - position - thickness, st.y);
  return fi + colorH.x;
}

vec3 line (vec2 st, float position, float thickness) {
  vec3 line = vec3(step(1.- position, st.y) + 
                   1. - step(1. - position - thickness, st.y));
  return line;
}

vec3 modified (vec2 st, float position, float thickness) {

  // modifier
  float t = abs(1.0-sin(u_time));
  float noisyPos = noise(st * 10. + 9.);
  position += noisyPos * t;

  // smooth line
  vec3 line = vec3(smoothstep(1.- position - 0.006, 1.- position, st.y) + 
                   1. - smoothstep(1. - position - thickness - 0.006, 1. - position - thickness,st.y));
  return line;
}

void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  // set the background color to green
  vec3 color = vec3(0.334,0.870,0.066);
  // set the line color to yellow
  vec3 colorLine = vec3(0.985,0.754,0.142);
    
  // set the line
  // vec3 straightLine = line(st, 0.4, 0.1);
    
  vec3 modifiedLine = modified(st, 0.4, 0.1);
    
  color = mix(colorLine, color, modifiedLine);
  gl_FragColor = vec4(color, 1.0);
}

`;
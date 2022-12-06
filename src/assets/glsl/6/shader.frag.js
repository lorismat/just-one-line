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

vec3 modified (vec2 st, float position, float thickness) {
  float smoothFactor = 0.001;
  float t = abs(1.0-sin(u_time)) ;
  float noisyPos = noise(st * 2.) * 0.03;
  position += noisyPos * t * 20.;
  vec3 line = vec3(smoothstep(1.- position - smoothFactor, 1.- position, st.y) + 
                   1. - smoothstep(1. - position - thickness - smoothFactor, 1. - position - thickness,st.y));
  return line;
}

void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  // set the background color to green
  vec3 color = vec3(0.220,0.020,0.405);
  // set the line color to yellow
  vec3 colorLine = vec3(0.218,0.785,0.985);
    
  // set the line
  // vec3 straightLine = line(st, 0.8, 0.1);
    
  vec3 modifiedLine1 = modified(st, 0.1, 0.01);
  vec3 modifiedLine2 = modified(st, 0.3, 0.01);
  vec3 modifiedLine3 = modified(st, 0.5, 0.01);
  vec3 modifiedLine4 = modified(st, 0.7, 0.01);
  vec3 modifiedLine5 = modified(st, 0.9, 0.01);
  vec3 modifiedLine6 = modified(st, 0.6, 0.01);
    
  color = mix(colorLine, color, modifiedLine1);
  color = mix(colorLine, color, modifiedLine2);
  color = mix(colorLine, color, modifiedLine3);
  color = mix(colorLine, color, modifiedLine4);
  color = mix(colorLine, color, modifiedLine5);
  color = mix(colorLine, color, modifiedLine6);
  gl_FragColor = vec4(color, 1.0);
}

`;
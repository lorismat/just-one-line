export default /* glsl */`


// #ifdef GL_ES
// precision mediump float;
// #endif

varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;

//----------------------------------------
// http://www.flong.com/archive/texts/code/shapers_circ/
// credit: Golan Levin and Collaborators 
float doubleCircleSeat (float x, float a){
  float min_param_a = 0.0;
  float max_param_a = 1.0;
  a = max(min_param_a, min(max_param_a, a)); 

  float y = 0.0;
  if (x<=a){
    y = sqrt(pow(a,2.0) - pow(x-a,2.0));
  } else {
    y = 1.0 - sqrt(pow(1.0-a,2.0) - pow(x-a,2.0));
  }
  return y;
}

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

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

vec3 modified (vec2 st, float position, float thickness, float sign) {
  float smoothFactor = 0.001;
  float t = abs(1.0-sin(u_time));

  float noisyPos = doubleCircleSeat(noise(st * 3.), 0.9) * 0.2;
  float noisyInc = noise(st * 10.) * 0.2;
  float noisyExt = noise(vec2(st.y, st.y) * 10.) * 0.01;
  
  position += noisyPos * t * sign;
  position += noisyInc * t * sign;
  position += noisyExt * t * sign;

  vec3 line = vec3(smoothstep(1.- position - smoothFactor, 1.- position, st.y) + 
                   1. - smoothstep(1. - position - thickness - smoothFactor, 1. - position - thickness,st.y));
  return line;
}

void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  // h
  float h = 194./360.;
  float hL = 297./360.;
  // s
  float s = 1.;
  float sL = 0.51;
  // b
  float b = 1.;
  float bL = 0.7;

  // set the background color to green
  vec3 color = hsb2rgb(vec3(h, s, b));
  // set the line color to yellow
  vec3 colorLine = hsb2rgb(vec3(hL, sL, bL));
    
  // set the line
  // vec3 straightLine = line(st, 0.8, 0.1);
    
  vec3 modifiedLine1 = modified(st, 0.2, 0.05, 1.);
  vec3 modifiedLine2 = modified(st, 0.3, 0.05, -1.);
  vec3 modifiedLine6 = modified(st, 0.8, 0.1, -1.);
    
  color = mix(colorLine, color, modifiedLine1);
  color = mix(colorLine, color, modifiedLine2);
  color = mix(colorLine, color, modifiedLine6);

  gl_FragColor = vec4(color, 1.0);
}

`;
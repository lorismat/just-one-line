export default /* glsl */`
varying vec2 vUv;
uniform float u_time;

vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                            6.0)-3.0)-1.0,
                    0.0,
                    1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
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

float line (vec2 st, float position, float thickness, vec3 colorH) {
  float t = abs(1.0-sin(u_time));
  float noisyPos = noise(st*1.);
  position *= noisyPos * 46. * t;
  // return step(1.- position, st.y) + 1. - step(1. - position - thickness * random(vec2(st.y)), st.y);
  float fi = step(1.- position, st.y) + 1. - step(1. - position - thickness, st.y);
  return fi + colorH.x;
}

void main () {

  vec2 st = vUv;
  vec3 color = vec3(1.0);
  vec3 colorH = hsb2rgb(vec3(0.078,0.630,0.216));
  color *= line(st, random(vec2(3.,40.)), 0.1, colorH);
  color.x += 0.3;
  gl_FragColor = vec4(color, 1.0);
}
`;
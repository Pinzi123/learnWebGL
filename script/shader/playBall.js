const vsSource = `
precision mediump float;
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec4 aNormal;
attribute vec3 eyeP;

uniform mat4 uNormalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uMvMatrixFromLight;

uniform vec3 uLightColor;
uniform vec3 uLightPosition;
uniform vec3 uAmbientLight;
uniform float hh;
uniform float time;

attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;
void main(void) {
  float planeY = -5.0;
  vec4 pos = uModelViewMatrix * aVertexPosition;
  if(hh!=0.0&&hh!=0.1)
    pos.y += time;
  if(hh==1.0)
    pos = vec4(pos.x, (pos.y-(pos.y-planeY)*2.0) , pos.z, pos.w);
  gl_Position = uProjectionMatrix * pos;
  
  vTextureCoord = aTextureCoord;
}
`;
const fsSource = `
precision mediump float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float hh;
void main(void) {
  if(hh==0.1)
    gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).rgb, 0.9);
  else
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;

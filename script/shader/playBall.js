const vsSource = `
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
uniform bool hh;

attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;
void main(void) {
  
  vec4 pos = uModelViewMatrix * aVertexPosition;
  if(hh)
    pos = vec4(pos.x, (-5.0-(pos.y+5.0)) , pos.z, pos.w);

  gl_Position = uProjectionMatrix * pos;
  
  vTextureCoord = aTextureCoord;
}
`;
const fsSource = `
precision mediump float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform bool hh;
void main(void) {
  if(hh)
    gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).rgb, 0.1);
  else
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;

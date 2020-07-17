
const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aTextureCoord;
attribute vec4 aOffset;

varying  vec4 vColor;
varying  vec2 vTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool isPlane;
void main(void) {
  if(isPlane){
    gl_Position = uProjectionMatrix * uModelViewMatrix *(aVertexPosition);
  }else{
    gl_Position = uProjectionMatrix * uModelViewMatrix *(aVertexPosition+aOffset);
  }
  vColor = vColor;
  vTextureCoord = aTextureCoord;
}
`;

// Fragment shader program

const fsSource = `
precision mediump float;
uniform sampler2D uSampler;

varying  vec2 vTextureCoord;
varying  vec4 vColor;
uniform bool isPlane;
void main(void) {
  vec4 color = texture2D(uSampler, vTextureCoord);
  if(color.a<0.5||isPlane){
    gl_FragColor = vColor;
  }else{
    gl_FragColor = color;
  }
  // gl_FragColor = vec4(mix(color.rgb,vColor.rgb,color.a),1.0);
}
`;

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec4 aOffset;
varying highp vec4 vColor;

void main(void) {
  gl_Position = aVertexPosition+aOffset;
  vColor = aVertexColor;
}
`;

// Fragment shader program

const fsSource = `
precision highp float;

varying highp vec4 vColor;
void main(void) {
  gl_FragColor = vec4(0.0,1.0,1.0,1.0);
  
}
`;
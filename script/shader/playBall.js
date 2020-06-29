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
varying lowp vec4 vColor;
void main(void) {
  vec4 pos = vec4(aVertexPosition.xyzw);
  if(hh)
    pos = vec4(aVertexPosition.x, -5.0 -(5.0 + aVertexPosition.y), aVertexPosition.z, aVertexPosition.w);

  gl_Position = uProjectionMatrix * uModelViewMatrix * pos;
  
  vec4 vertexPosition = uModelMatrix * pos;
  vec3 eyeDirection = normalize(eyeP - vec3(vertexPosition));
  vec3 lightDirection = normalize(uLightPosition - vec3(vertexPosition));
  vec3 normal = normalize(vec3(uNormalMatrix * aNormal));

  vec3 diffuse = uLightColor * aVertexColor.rgb * max(dot(lightDirection,normal), 0.0);
  vec3 h = (eyeDirection + lightDirection)/length(eyeDirection + lightDirection);
  vec3 specular = uLightColor * aVertexColor.rgb * pow(max(dot(normal,h), 0.0),2.0);
  vec3 ambient = uAmbientLight * aVertexColor.rgb;
  vColor = vec4(ambient + diffuse + specular, aVertexColor.a);
}
`;
const fsSource = `
precision mediump float;

varying lowp vec4 vColor;
void main(void) {
    gl_FragColor = vColor;
}
`;

const shaderSingleColor = `
void main(void)
{
gl_FragColor = vec4(1.00, 0.00, 0.00, 0.3);
}
`;
//边缘绘制
/**
 * 1、
 * 那就是考量视线向量与此片元处法向量的夹角，若夹角大于一定的值则认为是边缘。
 * 实际开发时只需要通过两个向量的点积值进行判断即可。
 * 否决，一个面的夹角都大于呢？
 */
/**
 * 2、沿法线挤出轮廓
 * vec4 origin = uProjectionMatrix * uModelViewMatrix * vec4(0.0,0.0,0.0,1.0);
 * vec4 normal = vec4(uProjectionMatrix * uModelViewMatrix * aNormal)-origin;
 * 
 * 傻乎乎的，还不如直接用矩阵方法放大模型顶点来的简单
 * 不过，他有一个好处，不会造成对描边粗细的影响
 * 
 */
/**
 * 3、使用模板测试
 * 第一步，正常绘制物体，记录当前模板缓冲值为1
 * 第一步，放大一些些，在绘制一遍，只绘制模板值为为1的区域
 */



  const vsSource = `#version 300 es
    precision mediump float;
    in vec4 aVertexPosition;
    in vec4 aVertexColor;
    in vec4 aNormal;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uMvMatrixFromLight;

    uniform vec3 uLightColor;
    uniform vec3 uLightPosition;
    uniform vec3 uAmbientLight;
    uniform mat4 uViewMatrix;
    uniform vec3 eye;

    out vec2 vTextureCoord;
    out float edge;
    out vec4 vColor;
    void main(void) {
      vec4 finalPos = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

      vec4 origin = uProjectionMatrix * uModelViewMatrix * vec4(0.0,0.0,0.0,1.0);
      vec4 normal = vec4(uProjectionMatrix * uModelViewMatrix * aNormal)-origin;
      vec2 skjNormal = normalize(vec2(normal.xy));

      gl_Position = finalPos +  normal*1.0;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program
  const fsSource = `#version 300 es
    precision mediump float;
    in vec4 vColor;
    in float edge;

    out vec4 FragColor;
    vec4 edgeColor = vec4(0.0,0.0,0.0,1.0);
    void main(void) {
        FragColor = vColor;
    }
  `;


  var svsSource = `#version 300 es
    precision mediump float;
    in vec4 aVertexPosition;
    in vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

// Fragment shader program for generating a shadow map
var sfsSource =`#version 300 es
    #ifdef GL_ES
    precision mediump float;
    #endif
    out vec4 FragColor;
    void main() {
        FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 1.0);
    }
`;

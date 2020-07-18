var svsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

// Fragment shader program for generating a shadow map
var sfsSource =`
    #ifdef GL_ES
    precision mediump float;
    #endif
    void main() {
        // gl_FragCoord.z 的深度值存储在只有 8 位的红色分量中导致的，
        // 所以距离过远之后，8 位的红色分量就存储不下了，好的方法是所有的分量都用上来存储；
        const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
        const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
        vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift); // Calculate the value stored into each byte
        rgbaDepth = rgbaDepth - rgbaDepth.gbaa * bitMask; // Cut off the value which do not fit in 8 bits
        gl_FragColor = rgbaDepth;
    }
`;

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

    varying vec4 vColor;
    varying vec4 v_PositionFromLight;
    const float rrr = 0.50;
    uniform float progress;
    void main(void) {
      vec4 aCubePosition = vec4(aVertexPosition.x, aVertexPosition.y ,aVertexPosition.z ,aVertexPosition.w);
      if(aVertexPosition.x>rrr){
        aCubePosition.x = rrr;
      }
      if(aVertexPosition.x<-rrr){
        aCubePosition.x = -rrr;
      }
      if(aVertexPosition.y>rrr){
        aCubePosition.y = rrr;
      }
      if(aVertexPosition.y<-rrr){
        aCubePosition.y = -rrr;
      }
      if(aVertexPosition.z>rrr){
        aCubePosition.z = rrr;
      }
      if(aVertexPosition.z<-rrr){
        aCubePosition.z = -rrr;
      }
      if(progress>0.0&&progress<1.0)
        aCubePosition =  mix(aVertexPosition, aCubePosition, progress);
      else if(progress==0.0)
        aCubePosition = aVertexPosition;
      else
        aCubePosition = mix(aVertexPosition, aCubePosition, 1.0);
      gl_Position =  uProjectionMatrix * uModelViewMatrix * aCubePosition;
      vec4 vertexPosition = uModelMatrix * aCubePosition;
      vec3 eyeDirection = normalize(eyeP - vec3(vertexPosition));
      vec3 lightDirection = normalize(uLightPosition - vec3(vertexPosition));
      vec3 normal = normalize(vec3(uNormalMatrix * aNormal));

      vec3 diffuse = uLightColor * aVertexColor.rgb * max(dot(lightDirection,normal), 0.0);
      vec3 h = (eyeDirection + lightDirection)/length(eyeDirection + lightDirection);
      vec3 specular = uLightColor * aVertexColor.rgb * pow(max(dot(normal,h), 0.0),2.0);
      vec3 ambient = uAmbientLight * aVertexColor.rgb;
      vColor = vec4(ambient + diffuse + specular, aVertexColor.a);

      v_PositionFromLight = uProjectionMatrix * uMvMatrixFromLight * aCubePosition;
    }
  `;

  // Fragment shader program

  const fsSource = `
    precision highp float;
    
    varying vec4 vColor;
    uniform sampler2D uShadowMap;
    varying vec4 v_PositionFromLight;

    float unpackDepth(const in vec4 rgbaDepth) {
      const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
      float depth = dot(rgbaDepth, bitShift); // Use dot() since the calculations is same
      return depth;
    }
    void main(void) {
        vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
        vec4 rgbaDepth = texture2D(uShadowMap, shadowCoord.xy);
        float depth =  unpackDepth(rgbaDepth);
        float visibility = (shadowCoord.z > depth+ 0.0005) ? 0.5 : 1.0;
        gl_FragColor = vec4(vColor.rgb * visibility, vColor.a);
    }
  `;
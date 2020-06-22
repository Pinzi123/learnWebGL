var svsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

// Fragment shader program for generating a shadow map
var sfsSource =`
    void main() {
        gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);
    }
`;


  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec4 aNormal;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uMvMatrixFromLight;

    uniform vec3 uLightColor;
    uniform vec3 uLightPosition;
    uniform vec3 uAmbientLight;

    varying lowp vec4 vColor;
    varying vec4 v_PositionFromLight;
    void main(void) {
      vec3 eyeP = vec3(-0.0, 0.0, -6.0);
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vec3 lightDirection = normalize(uLightPosition - vec3(aVertexPosition));
      vec3 eyeDirection = normalize(eyeP - vec3(aVertexPosition));

      vec3 normal = normalize(vec3(uNormalMatrix * aNormal));
      vec3 diffuse = uLightColor * aVertexColor.rgb * max(dot(lightDirection,normal), 0.0);
      vec3 h = (eyeDirection + lightDirection)/length(eyeDirection + lightDirection);
      vec3 specular = uLightColor * aVertexColor.rgb * pow(max(dot(eyeDirection,h), 0.0),3.0);
      vec3 ambient = uAmbientLight * aVertexColor.rgb;
      vColor = vec4(ambient + diffuse + specular, aVertexColor.a);
      v_PositionFromLight = uProjectionMatrix * uMvMatrixFromLight * aVertexPosition;
    }
  `;

  // Fragment shader program

  const fsSource = `
    precision highp float;
    
    varying lowp vec4 vColor;
    uniform sampler2D uShadowMap;
    varying vec4 v_PositionFromLight;
    void main(void) {
        vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
        float depth = texture2D(uShadowMap, shadowCoord.xy).r;
        float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;
        gl_FragColor = vec4(vColor.rgb * visibility, vColor.a);
    }
  `;